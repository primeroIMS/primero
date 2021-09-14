# frozen_string_literal: true

# Superclass for all Record exporters
class Exporters::BaseExporter
  EXPORTABLE_FIELD_TYPES = [
    Field::TEXT_FIELD, Field::TEXT_AREA, Field::RADIO_BUTTON, Field::SELECT_BOX, Field::NUMERIC_FIELD,
    Field::DATE_FIELD, Field::DATE_RANGE, Field::TICK_BOX, Field::TALLY_FIELD, Field::SUBFORM
  ].freeze

  attr_accessor :locale, :lookups, :fields, :forms, :field_value_service, :location_service

  class << self
    def supported_models
      ApplicationRecord.descendants
    end

    def mime_type
      id
    end

    def excluded_field_names
      Field.binary.pluck(:name)
    end

    def authorize_fields_to_user?
      true
    end

    # This is a class method that does a one-shot export to a String buffer.
    # Don't use this for large data sets.
    def export(*args)
      exporter_obj = new
      exporter_obj.export(*args)
      exporter_obj.complete
      exporter_obj.buffer.string
    end
  end

  def initialize(output_file_path = nil, locale = nil)
    @io = if output_file_path.present?
            File.new(output_file_path, 'w')
          else
            StringIO.new
          end
    self.locale = locale || I18n.locale
    self.location_service = LocationService.instance
    self.field_value_service = FieldValueService.new(location_service: location_service)
  end

  def export(*_args)
    raise NotImplementedError
  end

  def establish_export_constraints(records, user, options = {})
    self.forms = forms_to_export(records, user, options)
    self.fields = fields_to_export(forms, options)
  end

  def model_class(models)
    return unless models.present? && models.is_a?(Array)

    models.first.class
  end

  def export_value(value, field)
    if value.is_a?(Date) then I18n.l(value)
    elsif value.is_a?(Time) then I18n.l(value, format: :with_time)
    elsif value.is_a?(Array)
      value.map { |v| export_value(v, field) }
    elsif field
      field_value_service.value(field, value, locale: locale)
    else
      value
    end
  end

  def complete
    (buffer.class == File) && !buffer.closed? && @io.close
  end

  def buffer
    @io
  end

  private

  def forms_to_export(records, user, options = {})
    record_type = model_class(records)&.parent_form
    user_forms_subforms_permitted = user.role.permitted_forms(record_type, true, true) +
                                    user.role.permitted_subforms(record_type, true)
    forms = user_forms_subforms_permitted.map do |form|
      forms_without_hidden_fields(form)
    end
    return forms unless options[:form_unique_ids].present?

    forms.select { |form| options[:form_unique_ids].include?(form.unique_id) }
  end

  def fields_to_export(forms, options = {})
    fields = forms.map(&:fields).flatten.reject(&:hide_on_view_page?).uniq(&:name)
    fields -= (self.class.excluded_field_names&.to_a || [])
    return fields unless options[:field_names].present?

    # TODO: Don't forget this:
    # user.can?(:write, model_class) ? permitted_fields : permitted_fields.select(&:showable?)
    options[:field_names].map do |field_name|
      fields.find { |field| field.name == field_name }
    end.compact
  end

  def forms_without_hidden_fields(form)
    form_dup = form.dup
    form_dup.subform_field = form.subform_field
    form.fields.reject(&:hide_on_view_page?).map(&:dup).each do |field|
      if field.type == Field::SUBFORM
        # TODO: This cause N+1
        field.subform = forms_without_hidden_fields(field.subform)
      elsif !field.visible
        next
      end
      form_dup.fields << field
    end
    form_dup
  end
end
