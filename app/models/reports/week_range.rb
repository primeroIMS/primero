# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# rubocop:disable Style/ClassAndModuleChildren
module Reports
  # Class for Week Range
  class WeekRange < DateRange
    # rubocop:enable Style/ClassAndModuleChildren
    def core_value
      [date.year, date.cweek]
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
