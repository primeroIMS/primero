# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# rubocop:disable Style/ClassAndModuleChildren
module Reports
  # Class for Month Range
  class MonthRange < DateRange
    # rubocop:enable Style/ClassAndModuleChildren
    def core_value
      [date.year, date.month]
    end

    def format
      '%b-%Y'
    end
  end
end
