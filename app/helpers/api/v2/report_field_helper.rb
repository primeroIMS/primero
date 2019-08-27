module Api::V2::ReportFieldHelper
  def report_field(field, type, order, pivot_name)
    report_field = {
      name: field.name,
      display_name: field.display_name_i18n,
      position: { type: type, order: order }
    }

    if field.option_strings_source.present?
      source_options = field.option_strings_source.split.first
      case source_options
        when 'Location'
          admin_level = pivot_name.last.is_number? ? pivot_name.last.to_i : 0
          report_field = report_field.merge({ option_strings_source: 'Location', admin_level: admin_level })
        when 'lookup'
          lookup = Lookup.find_by(unique_id: field.option_strings_source.split.last)
          if lookup.present?
            all_lookup_values = complete_locales_for_options(lookup.lookup_values_i18n)
            report_field = report_field.merge({ option_labels: all_lookup_values })
          end
      end
    end

    if field.option_strings_text_i18n.present?
      all_options = complete_locales_for_options(field.option_strings_text_i18n)
      report_field = report_field.merge({ option_labels: all_options })
    end

    report_field
  end
end