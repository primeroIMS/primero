module Reports

  class AgeRange < Range
    MAX = 10000
    MIN = -1

    def <=>(other)
      other_min = other.respond_to?(:min) ? other.min : MIN
      self.min <=> other_min
    end

    def to_s
      max_s = (self.max >= MAX) ? '+' : " - #{self.max}"
      "#{min}#{max_s}"
    end
  end


end