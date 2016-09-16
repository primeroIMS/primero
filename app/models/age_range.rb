class AgeRange < Range
  MAX = 999
  MIN = -1

  class << self
    def from_string(string_range)
      b = e = ''
      if string_range.include? '+'
        b = string_range.split('+').first
        e = MAX
      elsif string_range.include? '-'
        b = string_range.split('-').first
        e = string_range.split('-').last
      elsif string_range.include? '.'
        b = string_range.split('.').first
        e = string_range.split('.').last
      end
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
