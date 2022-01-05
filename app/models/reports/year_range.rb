# frozen_string_literal: true

# rubocop:disable Style/ClassAndModuleChildren
module Reports
  # Class for Year Range
  class YearRange < DateRange
    # rubocop:enable Style/ClassAndModuleChildren
    def core_value
      date.year
    end

    def format
      '%Y'
    end
  end
end
