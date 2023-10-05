# frozen_string_literal: true

# Superclass for all Record exporters
# rubocop:disable Metrics/ClassLength
class Exporters::BaseExporter
  EXPORTABLE_FIELD_TYPES = [
    Field::TEXT_FIELD, Field::TEXT_AREA, Field::RADIO_BUTTON, Field::SELECT_BOX, Field::NUMERIC_FIELD,
    Field::DATE_FIELD, Field::DATE_RANGE, Field::TICK_BOX, Field::TALLY_FIELD, Field::SUBFORM
  ].freeze

  FIRST_ROW_INDEX = 1

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
    def export(records, *)
      exporter_obj = new(*)
      exporter_obj.export(records)
      exporter_obj.complete
      exporter_obj.buffer.string
    end
  end

  def initialize(output_file_path = nil, config = {}, options = {})
    @io = output_file_path.present? ? File.new(output_file_path, 'w') : StringIO.new
    self.locale = config[:locale] || I18n.locale
    self.record_type = config[:record_type]
    self.user = config[:user]
    self.options = options
    intialize_services
    establish_export_constraints
  end

  def export(records)
    #  If we need to embed other associated data we can add methods from the RecordDataService in this class.
    records.each { |record| embed_associated_data(record) }
  end

  def embed_associated_data(record)
    embed_family_info(record)
  end

  def embed_family_info(record)
    return unless record.is_a?(Child) && record.family_id.present?

    record.data['family_id'] = record.family_id if field_names.include?('family_id')
    record.data['family_member_id'] = record.family_member_id if field_names.include?('family_member_id')
    embed_family_details(record)
    embed_family_details_section(record)
  end

  def embed_family_details(record)
    family_details = FamilyLinkageService.family_to_child(record.family)
    global_field_names = field_names & FamilyLinkageService::GLOBAL_FAMILY_FIELDS
    global_field_names.each { |field_name| record.data[field_name] = family_details[field_name] }
  end

  def embed_family_details_section(record)
    return unless field_names.include?('family_details_section')

    record.data['family_details_section'] = record.family_members_details
  end

  def intialize_services
    self.location_service = LocationService.instance
    self.field_value_service = FieldValueService.new(location_service:)
  end

  def establish_export_constraints
    return unless setup_export_constraints? && user.present?

    self.forms = forms_to_export
    self.fields = fields_to_export
    self.field_names = fields.map(&:name)
  end

  def setup_export_constraints?
    true
  end

  def export_value(value, field)
    if value.is_a?(Date) then I18n.l(value)
    elsif value.is_a?(Time) then I18n.l(value, format: :with_time)
    elsif value.is_a?(Array)
      value.map { |v| export_value(v, field) }
    elsif field
      field_value_service.value(field, value, locale:)
    else
      value
    end
  end

  def complete
    buffer.instance_of?(File) && !buffer.closed? && @io.close
  end

  def buffer
    @io
  end

  def user_permitted_forms(record_type, user, include_subforms = false)
    user.role.permitted_forms(record_type, true, include_subforms)
  end

  def embed_family_data(record, data)
    return data unless record.is_a?(Child) && record.family.present?

    FamilyLinkageService::GLOBAL_FAMILY_FIELDS.each { |field_name| data[field_name] = record.family.data[field_name] }
    data['family_details_section'] = record.family_members_details
    data
  end

  private

  def forms_to_export(include_subforms = false)
    forms = user_permitted_forms(record_type, user, include_subforms)
    forms = forms.where(unique_id: options[:form_unique_ids]) if options[:form_unique_ids].present?
    forms.map { |form| forms_without_hidden_fields(form) }
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
    form_dup.fields = form_dup.fields.reject { |field| field.hide_on_view_page? || !field.visible }.map do |field|
      # TODO: This cause N+1
      if field.subform.present? && field.type == Field::SUBFORM
        field.subform = forms_without_hidden_fields(field.subform)
      end

      field
    end
    form_dup
  end

  def duplicate_form(form)
    form_dup = FormSection.new(form.as_json.except('id'))
    form_dup.subform_field = Field.new(form.subform_field.as_json.except('id')) if form.subform_field.present?
    form_dup.fields = duplicate_fields(form_dup, form.fields)
    form_dup
  end

  def duplicate_fields(form_dup, fields)
    fields.map do |field|
      field_dup = Field.new(field.as_json.except('id'))
      field_dup.subform = duplicate_form(field.subform) if field.subform.present?
      field_dup.form_section = form_dup
      field_dup
    end
  end

  def locale_hash
    { locale: }
  end

  def name_first_cell_by_column(column_index)
    "#{ColName.instance.col_str(column_index)}#{FIRST_ROW_INDEX}"
  end
end
# rubocop:enable Metrics/ClassLength
