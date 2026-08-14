# frozen_string_literal: true

# ReportFieldService
class ReportFieldService
  HORIZONTAL = 'horizontal'
  VERTICAL = 'vertical'

  def self.horizontal_fields(report)
    report.aggregate_by.each_with_index.map do |pivot_name, i|
      field = report.pivots_map[pivot_name]
      report_field(field, pivot_name, HORIZONTAL, i, report.record_type).merge(
        registry_field_options(field, report.registry_records)
      )
    end
  end

  def self.vertical_fields(report)
    report.disaggregate_by.each_with_index.map do |pivot_name, i|
      field = report.pivots_map[pivot_name]
      report_field(field, pivot_name, VERTICAL, i, report.record_type).merge(
        registry_field_options(field, report.registry_records)
      )
    end
  end

  def self.report_field(field, pivot_name, type, order, record_type)
    report_field_hash = {
      name: field&.name,
      display_name: field&.display_name_i18n,
      position: { type:, order: }
    }
    report_field_hash.merge(report_field_options(field, pivot_name, record_type) || {})
  end

  def self.user_groups_options
    enabled_user_groups = UserGroup.enabled.pluck(:unique_id, :name).map { |id, display_text| { id:, display_text: } }

    { option_labels: I18n.available_locales.to_h { |locale| [locale, enabled_user_groups] } }
  end

  def self.registry_field_options(field, registry_records = [])
    return {} unless field.type == Field::REGISTRY

    collapsed_field_names = registry_collapsed_field_names(field)
    fields_options_from_source = registry_fields_options_from_source(collapsed_field_names)
    {
      registry_type: field.option_strings_source,
      registry_option_labels: registry_fields_options_from_record(
        collapsed_field_names, fields_options_from_source, registry_records
      ) || {}
    }
  end

  def self.registry_fields_options_from_record(field_names, fields_with_options = {}, registry_records = [])
    registry_records&.each_with_object({}) do |registry_record, memo|
      field_names.each do |field_name|
        memo[field_name] ||= { option_labels: [] }

        display_text = display_text_for(
          registry_record.data[field_name], fields_with_options&.dig(field_name, :option_labels)
        )

        memo[field_name][:option_labels] << { 'id' => registry_record.id, 'display_text' => display_text }
      end
    end
  end

  def self.display_text_for(value, option_labels)
    lookup_options = option_labels&.select { |option| Array.wrap(value).include?(option['id']) }

    # Registry records are english-only.
    display_text = lookup_options&.map { |option| option['display_text']['en'] }&.join('|')
    FieldI18nService.fill_with_locales({ 'en' => display_text || value })
  end

  def self.registry_fields_options_from_source(field_names)
    Field.joins(:form_section).where(name: field_names, form_section: { parent_form: 'registry_record' })
         .each_with_object({}) do |field, memo|
      options = report_field_options(field, field.name, 'registry_record')
      next unless options.present?

      memo[field.name] = normalize_registry_options(options) || options
    end
  end

  def self.normalize_registry_options(options)
    # TODO: Remove this code once the report_field_options method is modified to return the correct options format.
    return unless options.key?(:option_labels)

    { option_labels: FieldI18nService.fill_lookups_options(FieldI18nService.convert_options(options[:option_labels])) }
  end

  def self.registry_collapsed_field_names(field)
    collapsed_field_names = SystemSettings.current.registry_options&.dig(
      field.option_strings_source, 'collapsed_field_names'
    )
    return [] if collapsed_field_names.blank?

    collapsed_field_names
  end

  def self.report_option_strings_source(field)
    source_options = field.option_strings_source.split.first

    return user_groups_options if source_options == 'UserGroup'
    return unless source_options == 'lookup'

    lookup = Lookup.find_by(unique_id: field.option_strings_source.split.last)
    return unless lookup.present?

    all_lookup_values = FieldI18nService.fill_options(lookup.lookup_values_i18n)
    { option_labels: all_lookup_values }
  end

  def self.report_field_options(field, pivot_name, record_type)
    if field&.location? || field&.reporting_location?
      build_reporting_location_field_options(field, pivot_name, record_type)
    elsif field&.agency?
      { option_strings_source: 'Agency' }
    elsif field&.option_strings_text_i18n.present?
      { option_labels: FieldI18nService.fill_options(field.option_strings_text_i18n) }
    elsif field&.option_strings_source.present?
      report_option_strings_source(field)
    end
  end

  def self.report_field_admin_level(field, pivot_name, record_type)
    if field&.location?
      pivot_name.last.to_i
    elsif field&.reporting_location?
      system_settings = SystemSettings.current
      return system_settings.incident_reporting_location_config.admin_level if record_type == Incident.parent_form

      system_settings.reporting_location_config.admin_level
    end
  end

  def self.aggregate_by_from_params(params)
    report_params = params[:fields]&.select { |param| param['position']['type'] == HORIZONTAL }
    report_params&.sort_by { |field| field[:position][:order] }&.map { |field| field['name'] }
  end

  def self.disaggregate_by_from_params(params)
    report_params = params[:fields]&.select { |param| param['position']['type'] == VERTICAL }
    report_params&.sort_by { |field| field[:position][:order] }&.map { |field| field['name'] }
  end

  def self.build_reporting_location_field_options(field, pivot_name, record_type)
    options = { option_strings_source: 'Location' }
    return options unless pivot_name.last.is_number?

    options.merge(admin_level: report_field_admin_level(field, pivot_name, record_type))
  end
end
