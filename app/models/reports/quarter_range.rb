module Reports
  class QuarterRange < DateRange
    def core_value
      self.date.beginning_of_quarter
    end

    def calculate_quarter(date)
      case date.month
      when 1,2,3
        return 1
      when 4,5,6
        return 2
      when 7,8,9
        return 3
      when 10,11,12
        return 4
      end
    end

    def format
      "#{I18n.t('report.date_ranges.quarter_abbr', quarter: calculate_quarter(core_value))} (%Y)"
    end
  end
end