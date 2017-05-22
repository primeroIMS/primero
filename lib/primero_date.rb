class PrimeroDate < Date

  CONVERSIONS = I18n.available_locales.reject{|l| l == :ru || l == :zh}.map{|l| [l, {
    month_names: I18n.t('abbr_month_names', scope: 'date', locale: l),
    abbr_month_names: I18n.t('month_names', scope: 'date', locale: l)
  }]}.to_h

  def self.unlocalize_date_string(string)
    locale = I18n.config.locale

    str = string.split('-')

    CONVERSIONS[locale].each do |k, m|
      month = m.index(str[1].downcase)
      if month.present?
        str[1] = CONVERSIONS[:en][:month_names][month]
      end
    end

    str.join('-')
  end

  def self.couchrest_typecast(parent, property, value)
    begin
      # The value comes from the database as a string with the format 'yyyy/mm/dd'
      if value.to_s =~ /(\d{4})[\-|\/](\d{2})[\-|\/](\d{2})/
        year = $1.to_i
        month = $2.to_i
        day = $3.to_i

        database_datetime_format = /^(\d{4})[\-|\/](\d{2})[\-|\/](\d{2,4})\s(\d{1,2}:\d{1,2}:\d{1,2})(\s[\+|-]\d{1,4})?$/
        rails_datetime_format = /\d{4}[\-|\/]\d{2}[\-|\/]\d{2}T\d{2}:\d{2}:\d{2}/
        # Faster than parsing the date
        if value.to_s =~ database_datetime_format || value.to_s =~ rails_datetime_format
          Time.zone.parse(value.to_s)
        else
          Date.new(year, month, day)
        end
      else
        self.parse_with_format(value)
      end
    rescue ArgumentError
      value
    end
  end

  def self.determine_format(data)
    # Determine whether we are given the month number or the month name
    @month_format = data[2].match(/^(0[1-9]|[1-9]|1[0-2])$/).nil? ? "%b" : "%m"
    # Determine whether the year has two-digits format or four-digits format
    @year_format = data[3].match(/^(\d{2})$/).nil? ? "%Y" : "%y"
  end

  def self.parse_with_format(value)
    return value if value.is_a?(Date) || (value.is_a? PrimeroDate) || (value.is_a? Time)

    # Separator can be "-" or "/". Valid formats:
    #   "%d-%b-%Y" # 05-Sep-2014 | 05-September-2014 | 5-Sep-2014 | 5-September-2014
    #   "%d-%b-%y" # 05-Sep-14   | 05-September-14   | 5-Sep-14   | 05-September-14
    #   "%d-%m-%Y" # 05-09-2014  | 05-9-2014         | 5-09-2014  | 5-9-2014
    #   "%d-%m-%y" # 05-09-14    | 05-9-14           | 5-09-14    | 5-9-14

    # Remove empty spaces if found. (12 - Jun - 2014 -> 12-Jun-2014)
    value = "#{$1.strip}-#{$2.strip}-#{$3.strip}" if value.match /^(.*)[-|\/](.*)[-|\/](.*)$/
    # If the value to parse has a valid format, get the format and parse the value.
    # It should be day month year
    match_data = value.match /^(\d{1,2})-(.*)-(\d{2,4})$/
    match_data_with_time = value.match /^(\d{1,2})-(.*)-(\d{2,4})\s(\d{1,2}:\d{1,2})(\s[\+|-]\d{1,4})?$/

    if match_data
      self.determine_format(match_data)
      # Try to parse the value with the detected format
      return Date.strptime self.unlocalize_date_string(value), "%d-#{@month_format}-#{@year_format}"
    elsif match_data_with_time
      self.determine_format(match_data_with_time)
      return DateTime.parse(Time.strptime(self.unlocalize_date_string(value), "%d-#{@month_format}-#{@year_format} %H:%M").to_s)
    end

    raise ArgumentError, "invalid date"
  end
end