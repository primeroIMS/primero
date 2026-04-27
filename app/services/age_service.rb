# frozen_string_literal: true

# Utility methods for handling ages and birthdays
class AgeService
  def self.day_of_year(date)
    yday = date.yday
    yday -= 1 if date.leap? && (yday >= 60)
    yday
  end

  def self.age(date_of_birth, as_of = Date.current)
    return nil unless date_of_birth.is_a?(Date)

    born_later_this_month = (as_of.month == date_of_birth.month) && (as_of.day >= date_of_birth.day)
    born_later_this_year = as_of.month > date_of_birth.month
    offset = born_later_this_month || born_later_this_year ? 0 : 1
    as_of.year - date_of_birth.year - offset
  end
end
