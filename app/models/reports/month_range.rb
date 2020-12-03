module Reports

  class MonthRange < DateRange

    def core_value
      [self.date.year, self.date.month]
    end

    def format
      '%b-%Y'
    end

  end

end
