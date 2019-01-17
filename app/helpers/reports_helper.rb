module ReportsHelper

  # Creates a histogram out of an array, preserving the order and creating
  # a new count for identical but separated elements
  # pattern_histogram(["a","a","b","a"])
  # =>
  # [["a",2],["b",1],["a",1]]
  def pattern_histogram(array)
    result = []
    previous = nil
    array.each do |element|
      if element != previous || !element.present?
        result << [element, 1]
      else
        result[-1][1] = result[-1][1] + 1
      end
      previous = element
    end
    return result
  end

  # Compute the complex headers for the disaggregate fields.
  # There will be a row for every disaggregate pivot nest
  def report_header_rows(disaggregate_fields)
    header_rows = []
    if disaggregate_fields.present?
      disaggregate_fields.first.length.times.each do |i|
        header_rows << pattern_histogram(disaggregate_fields[1..-1].map{|v|v[i]})
      end
      header_rows.length.times.each do |i|
        row = header_rows[i]
        previous = nil
        row.length.times.each do |j|
          value = row[j][0]
          if value != previous && previous == ""
            header_rows[i][j-1] = [t('report.all'), header_rows[i][j-1][1]]
          end
          previous = value
        end
      end
      #Append a totals column
      if header_rows.size > 0
        header_rows.first << [t('report.total'), 1]
        header_rows[1..-1].each do |row|
          row << ["", 1]
        end
      end
    end
    unless header_rows.present?
      header_rows = [[[t('report.total'),1]]]
    end
    return header_rows
  end

  def report_sidebar_value(aggregate_value)
    value = ""
    aggregate_value.reverse_each do |v|
      if v.present?
        value = v
        break
      end
    end
    return value
  end

  def report_row_type(aggregate_value)
    if aggregate_value.last.present?
      'report_row_values'
    else
      'report_row_aggregate'
    end
  end

  # Assumes grouped fields is a hash that resembles:
  # {
  #    "module_name" => [
  #      "form_name", [
  #         ["field_name", "field_display_name", "field_type"]**
  #      ]**
  #    ]**
  # }
  def select_options_fields_grouped_by_form(grouped_fields, include_type=false)
    unique_fields = Set.new
    grouped_fields_options = []
    if grouped_fields.present?
      grouped_fields.keys.each do |module_name|
        grouped_fields[module_name].each do |form|
          form_array = ["#{form[0]} (#{module_name})", []]
          form[1].each do |field|
            if unique_fields.add? field[0]
              form_array[1] << [field[1], field[0]]
              form_array[1].last << field[2] if include_type
            end
          end
          grouped_fields_options << form_array
        end
      end
    end
    return grouped_fields_options
  end

  #TODO: This logically belongs with fields
  def lookups_list_from_field(field)
    field_options = []
    if field.present?
      field_options = field.select_options
      #check if the select has an empty option
      if field_options.size > 0 && field_options[0].size > 0 && field_options[0][0] == I18n.t("fields.select_box_empty_item")
        field_options.shift
      end
    end
    return field_options
  end

  def report_filter_lookup_options(lookups, value)
    if value.present? && lookups.present?
      lookups.all.map{ |l| [l.id, l.lookup_values] }.to_h.try(:[], value) || []
    else
      []
    end
  end

  def data_report_filters(record_type)
    [
      {
        type: 'date',
        name: record_type == 'case' ? 'registration_date' : 'date_of_incident'
      },
      {
        type: 'select',
        name: 'ctfmr_verified',
        options: 'lookup-verification-status',
        multiple: true
      },
      {
        type: 'select',
        name: 'perpetrator_category',
        options: ["Armed force", "Armed group", "Other party to the conflict", "Unknown"],
        multiple: true
      }
    ]
  end
end