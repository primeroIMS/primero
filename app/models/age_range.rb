# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Used to encapsulate an age range configuration.
# Eg. [0..4, 5..11, 12..17, 18..59, 60..AgeRange::MAX]
class AgeRange < Range
  MAX = 999
  MIN = -1
  DEFAULT_AGE_RANGES = [
    AgeRange.new(0, 4).freeze,
    AgeRange.new(5, 11).freeze,
    AgeRange.new(12, 17).freeze,
    AgeRange.new(18, 59).freeze,
    AgeRange.new(60, MAX).freeze
  ].freeze

  class << self
    def from_string(string_range)
      b = e = ''
      if string_range.include? '+'
        b = string_range.split('+').first
        e = MAX
      else
        split_on = split_on(string_range)
        b = string_range.split(split_on).first
        e = string_range.split(split_on).last
      end
      AgeRange.new(Integer(b), Integer(e))
    end

    private

    def split_on(string_range)
      if string_range.include? '-'
        '-'
      elsif string_range.include? '..'
        '..'
      end
    end
  end

  def <=>(other)
    other_min = other.respond_to?(:min) ? other.min : MIN
    min <=> other_min
  end

  def to_s
    max_s = max >= MAX ? '+' : " - #{max}"
    "#{min}#{max_s}"
  end
end
