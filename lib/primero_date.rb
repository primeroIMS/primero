class PrimeroDate < Date
  CONVERSIONS = {
    month_names: ::Date::MONTHNAMES,
    abbr_month_names: ::Date::ABBR_MONTHNAMES,
    day_names: ::Date::DAYNAMES,
    abbr_day_names: ::Date::ABBR_DAYNAMES
  }

  def self.unlocalize_date_string(string, locale = nil)
    locale ||= I18n.config.locale
    I18n.enforce_available_locales!(locale)

    conv = CONVERSIONS.reduce(string.downcase) do |str, (type, replacements)|
      map = I18n.t(type, scope: "date", locale: locale)
                .zip(replacements)
                .to_h
                .tap { |h| h.delete(nil) }
      str.gsub(/\b(#{map.keys.join("|")})\b/) { |match| map[match] }
    end
  end
 
  def self.couchrest_typecast(parent, property, value)
    begin
      # The value comes from the database as a string with the format 'yyyy/mm/dd'
      if value.to_s =~ /(\d{4})[\-|\/](\d{2})[\-|\/](\d{2})/
        # Faster than parsing the date
        Date.new($1.to_i, $2.to_i, $3.to_i)
      else
        self.parse_with_format(value)
      end
    rescue ArgumentError
      value
    end
  end

  def self.parse_with_format(value)
    return value if value.is_a?(Date) || (value.is_a? PrimeroDate)
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
    if match_data
      # Determine whether we are given the month number or the month name
      month_format = match_data[2].match(/^(0[1-9]|[1-9]|1[0-2])$/).nil? ? "%b" : "%m"
      # Determine whether the year has two-digits format or four-digits formatI18n
      year_format = match_data[3].match(/^(\d{2})$/).nil? ? "%Y" : "%y"
      # Try to parse the value with the detected format
      return Date.strptime self.unlocalize_date_string(value), "%d-#{month_format}-#{year_format}"
    end
    raise ArgumentError, "invalid date"
  end
end