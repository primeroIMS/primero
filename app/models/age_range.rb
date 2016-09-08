class AgeRange < Range
  MAX = 999
  MIN = -1

  class << self
    def create(string_range)
      b = string_range.split('.').first
      e = string_range.split('.').last
      AgeRange.new(Integer(b),Integer(e))
    end
  end

  def <=>(other)
    other_min = other.respond_to?(:min) ? other.min : MIN
    self.min <=> other_min
  end

  def to_s
    max_s = (self.max >= MAX) ? '+' : " - #{self.max}"
    "#{min}#{max_s}"
  end
end
