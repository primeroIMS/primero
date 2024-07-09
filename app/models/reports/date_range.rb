# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# rubocop:disable Style/ClassAndModuleChildren
module Reports
  # Class for Date Range
  class DateRange
    # rubocop:enable Style/ClassAndModuleChildren
    MIN = Date.new

    attr_accessor :date

    def initialize(date_string)
      self.date = begin
        Date.parse(date_string)
      rescue StandardError
        MIN
      end
    end

    def core_value
      date
    end

    def <=>(other)
      core_value <=> other.core_value
    end

    def eql?(other)
      core_value.eql?(other.core_value)
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
