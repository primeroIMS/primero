# frozen_string_literal: true

# Superclass for all Record exporters
class Exporters::BaseExporter
  EXPORTABLE_FIELD_TYPES = [
    Field::TEXT_FIELD, Field::TEXT_AREA, Field::RADIO_BUTTON, Field::SELECT_BOX, Field::NUMERIC_FIELD,
    Field::DATE_FIELD, Field::DATE_RANGE, Field::TICK_BOX, Field::TALLY_FIELD, Field::SUBFORM
  ].freeze

  attr_accessor :locale, :lookups, :fields, :field_names, :forms, :field_value_service,
                :location_service, :record_type, :user, :options

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

  def initialize(output_file_path = nil, locale = nil, record_type = nil, user = nil, options = {})
    @io = output_file_path.present? ? File.new(output_file_path, 'w') : StringIO.new
    self.locale = locale || I18n.locale
    self.record_type = record_type
    self.user = user
    self.options = options
    intialize_services
    establish_export_constraints
  end

  def export(*_args)
    raise NotImplementedError
  end

  def intialize_services
    self.location_service = LocationService.instance
    self.field_value_service = FieldValueService.new(location_service: location_service)
  end

  def establish_export_constraints
    self.forms = forms_to_export
    self.fields = fields_to_export
    self.field_names = fields.map(&:name)
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

  def forms_to_export
    user_forms_subforms_permitted = user.role.permitted_forms(record_type, true, true)
    forms = user_forms_subforms_permitted.map { |form| forms_without_hidden_fields(form) }

    return forms unless options[:form_unique_ids].present?

    forms.select { |form| options[:form_unique_ids].include?(form.unique_id) }
  end

  def fields_to_export
    fields = forms.map(&:fields).flatten.reject(&:hide_on_view_page?).uniq(&:name)
    fields -= (self.class.excluded_field_names&.to_a || [])
    return fields if options[:field_names].blank?

    map_fields(options, fields)
  end

  def map_fields(options, fields)
    # TODO: Don't forget this:
    # user.can?(:write, model_class) ? permitted_fields : permitted_fields.select(&:showable?)
    options[:field_names].map { |field_name| find_field(fields, field_name) }.compact
  end

  def find_field(fields, field_name)
    fields.find { |field| field.name == field_name }
  end

  def forms_without_hidden_fields(form)
    form_dup = duplicate_form(form)
    form_dup.fields.reject(&:hide_on_view_page?).each do |field|
      if field.type == Field::SUBFORM
        # TODO: This cause N+1
        field.subform = forms_without_hidden_fields(field.subform)
      elsif !field.visible then next
      end
      form_dup.fields << field
    end
    form_dup
  end

  def duplicate_form(form)
    form_dup = FormSection.new(form.as_json)
    form_dup.subform_field = duplicate_field(form.subform_field) if form.subform_field.present?
    form_dup.fields = form.fields.map { |field| duplicate_field(field) }
    form_dup
  end

  def duplicate_field(field)
    field_dup = Field.new(field.as_json)
    field_dup.subform = FormSection.new(field.subform.as_json) if field.subform.present?
    field_dup
  end
end
