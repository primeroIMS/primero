# frozen_string_literal: true

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
