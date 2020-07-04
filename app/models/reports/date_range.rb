module Reports

  class DateRange

    MIN = Date.new

    attr_accessor :date

    def initialize(date_string)
      self.date = Date.parse(date_string) rescue MIN
    end

    def core_value
      self.date
    end

    def <=>(other)
      self.core_value <=> other.core_value
    end

    def eql?(other)
      self.core_value.eql?(other.core_value)
    end

    def hash
      core_value.hash
    end

    def format
      '%d-%b-%Y'
    end

    def to_s
      if date.present? && date > MIN
        date.strftime(format)
      else
        ''
      end
    end

  end

end
