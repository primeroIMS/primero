class Date
  def self.parse(value)
    # valid_formats:
    #   "%d-%b-%Y" # 05-Sep-2014 | 05-September-2014 | 5-Sep-2014 | 5-September-2014
    #   "%d-%b-%y" # 05-Sep-14   | 05-September-14   | 5-Sep-14   | 05-September-14
    #   "%d-%m-%Y" # 05-09-2014  | 05-9-2014         | 5-09-2014  | 5-9-2014
    #   "%d-%m-%y" # 05-09-14    | 05-9-14           | 5-09-14    | 5-9-14
    value = value.gsub(/^(.*)[-|\/](.*)[-|\/](.*)$/, "#{$1.strip}-#{$2.strip}-#{$3.strip}") if value.match /^(.*)[-|\/](.*)[-|\/](.*)$/
    match_data = value.match /^(\d{1,2})[-|\/](.*)[-|\/](\d{2,4})$/
    if match_data
      value = "#{match_data[1]}-#{match_data[2]}-#{match_data[3]}"
      month_format = match_data[2].match(/^(0[1-9]|[1-9]|1[0-2])$/).nil? ? "%b" : "%m"
      year_format = match_data[3].match(/^(\d{2})$/).nil? ? "%Y" : "%y"
      return Date.strptime value, "%d-#{month_format}-#{year_format}"
    end
    raise ArgumentError, "invalid date"
  end
end