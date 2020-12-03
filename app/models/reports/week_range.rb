module Reports

  class WeekRange < DateRange

    def core_value
      [self.date.year, self.date.cweek]
    end

    def to_s
      if date.present? && date > MIN
        "#{date.beginning_of_week.strftime(format)} - #{date.end_of_week.strftime(format)}"
      else
        ''
      end
    end

  end

end
