module Reports

  class YearRange < DateRange

    def core_value
      self.date.year
    end

    def format
      '%Y'
    end

  end

end
