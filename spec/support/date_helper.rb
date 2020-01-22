module DateHelper
  def this_week
    if Time.zone.now.beginning_of_day == Time.zone.now.beginning_of_week
      Time.zone.now.beginning_of_day
    else
      1.day.ago
    end
  end

  def last_week
    if Time.zone.now.beginning_of_day == Time.zone.now.beginning_of_week
      Time.zone.now.beginning_of_day - 1.week
    else
      Time.zone.now.beginning_of_week - 1.week
    end
  end
end
