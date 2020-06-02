# frozen_string_literal: true

# ReportFieldService
class ReportFieldService
  HORIZONTAL = 'horizontal'
  VERTICAL = 'vertical'

  def self.horizontal_fields(report)
    report.aggregate_by.each_with_index.map do |f,i|
      report_field(report.pivots_map[f], f, HORIZONTAL, i)
    end
  end

  def self.vertical_fields(report)
    report.disaggregate_by.each_with_index.map do |f,i|
      report_field(report.pivots_map[f], f, VERTICAL, i)
    end
  end

  def self.report_field(field, pivot_name, type, order)
    return pivot_name if field.nil?

    report_field_hash = {
      name: field.name,
      display_name: field.display_name_i18n,
      position: { type: type, order: order }
    }
    report_field_hash.merge(self.report_field_options(field, pivot_name) || {})
  end

  def self.report_field_options(field, pivot_name)
    if field.is_location?
      admin_level = pivot_name.last.is_number? ? pivot_name.last.to_i : 0
      { option_strings_source: 'Location', admin_level: admin_level }
    elsif field.option_strings_text_i18n.present?
      all_options = FieldI18nService.fill_options(field.option_strings_text_i18n)
      { option_labels: all_options }
    elsif field.option_strings_source.present?
      source_options = field.option_strings_source.split.first
      if source_options == 'lookup'
        lookup = Lookup.find_by(unique_id: field.option_strings_source.split.last)
        if lookup.present?
          all_lookup_values = FieldI18nService.fill_options(lookup.lookup_values_i18n)
          { option_labels: all_lookup_values }
        end
      end
    end
  end

  def self.aggregate_by_from_params(params)
    report_params = params[:fields]&.select { |param| param['position']['type'] == HORIZONTAL }
    report_params&.sort_by { |field| field[:position][:order] }
  end

  def self.disaggregate_by_from_params(params)
    report_params = params[:fields]&.select { |param| param['position']['type'] == VERTICAL }
    report_params&.sort_by { |field| field[:position][:order] }
  end
end
