class PrimeroDate < Date

  DATE_REGEX=/^\d{2}-(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-\d{4}$/

  CONVERSIONS = I18n.available_locales.reject{|l| l == :ru || l == :zh}.map{|l| [l, {
    month_names: I18n.t('abbr_month_names', scope: 'date', locale: l),
    abbr_month_names: I18n.t('month_names', scope: 'date', locale: l)
  }]}.to_h

  def self.unlocalize_date_string(string)
    locale = I18n.config.locale

    str = string.split(/[\/,-]/)

    CONVERSIONS[locale].each do |k, m|
      month = m.index(str[1].downcase)
      if month.present?
        str[1] = CONVERSIONS[:en][:month_names][month]
      end
    end

    str.join('-')
  end

  # TODO-time: Keep all backend times in UTC
  def self.couchrest_typecast(parent, property, value)
    begin
      # The value comes from the database as a string with the format 'yyyy/mm/dd'
      # And a DateTime object converted to string has the same format 'yyyy/mm/dd'
      # If this statement is true data comes from the database or a model
      # It should return a datetime in local time for application
      # TODO: # It should return a datetime in utc time because the time remains on the backend
      if value.to_s =~ /(\d{4})[\-|\/](\d{2})[\-|\/](\d{2})/
        year = $1.to_i
        month = $2.to_i
        day = $3.to_i

        database_datetime_format = /^(\d{4})[\-|\/](\d{2})[\-|\/](\d{2,4})\s(\d{1,2}:\d{1,2}:\d{1,2})(\s[\+|-]\d{1,4})?$/
        rails_datetime_format = /\d{4}[\-|\/]\d{2}[\-|\/]\d{2}T\d{2}:\d{2}:\d{2}/
        # Faster than parsing the date
        if value.to_s =~ database_datetime_format || value.to_s =~ rails_datetime_format
        # TODO-time: Change 'in_time_zone' to 'utc'
          DateTime.parse(value.to_s).utc.to_datetime
        else
          Date.new(year, month, day)
        end
      # Else, the data is a string being read from the browser application and is in local time
      # We should then return a datetime in UTC for the database to store
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

  # This function only deals with dates from the application, which are in local time.
  # It should return a Datetime in UTC for the database
  def self.parse_with_format(value, skip_offset=false)
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
      return Date.strptime(self.unlocalize_date_string(value), "%d-#{@month_format}-#{@year_format}")
    elsif match_data_with_time
      self.determine_format(match_data_with_time)
      datetime_eval = DateTime.strptime(self.unlocalize_date_string(value), "%d-#{@month_format}-#{@year_format} %H:%M")
      datetime_eval = datetime_eval.change(:offset => Time.now.in_time_zone.zone).utc unless skip_offset

      return datetime_eval
    end

    raise ArgumentError, "invalid date"
  end

  # This is a wrapper for some of the Date and DateTime helpers
  # Valid inputs are as follows
  # 'current'
  # 'now'
  # 'yesterday'
  # 'today'
  # 'tomorrow'
  # '<integer> <date/time unit> <ago|from_now>'
  # example: '10 days ago'  or  '3 weeks from_now'
  def self.date_value(value_string)
    if value_string.present? && value_string.is_a?(String)
      date_format = value_string.split(' ')
      case date_format.length
        when 1
          parse_single_value(date_format)
        when 3
          parse_three_values(date_format)
        else
          ''
      end
    else
      ''
    end
  end

  private

  #TODO-time: Returns requested Time or Date object exclusively in local time
  #TODO-time: This function should only be used to create new DateTimes for display in browser
  #TODO-time: Date.send('today') returns the date based on utc, which can give you a day in the future
  #TODO-time: if ['today'].include?(df): DateTime.send('current').to_date
  #TODO-time: elsif ['yesterday', 'tomorrow'].include?(df): DateTime.send(df)
  def self.parse_single_value(date_format)
    df = date_format.first.downcase
    if ['yesterday', 'today', 'tomorrow'].include?(df)
      Date.send(df)
    elsif ['current', 'now'].include?(df)
      DateTime.send(df).in_time_zone.to_datetime
    else
      ''
    end
  end

  def self.parse_three_values(date_format)
    #First element must be an integer - ex:  '10 days ago'
    if (true if Integer(date_format.first) rescue false) == true &&
        ['day', 'days', 'week', 'weeks', 'month', 'months', 'year', 'years'].include?(date_format[1]) &&
        ['ago', 'from_now'].include?(date_format.last)
      eval(date_format.join('.'))
    else
      ''
    end
  end
end
