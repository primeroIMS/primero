class PrimeroDate < Date

  def self.couchrest_typecast(parent, property, value)
    begin
      self.parse_with_format(value)
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
      # Determine whether the year has two-digits format or four-digits format
      year_format = match_data[3].match(/^(\d{2})$/).nil? ? "%Y" : "%y"
      # Try to parse the value with the detected format
      return Date.strptime value, "%d-#{month_format}-#{year_format}"
    end
    raise ArgumentError, "invalid date"
  end
end