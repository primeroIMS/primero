# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform API query parameter field_name=YYYYMMDD..YYYMMDD into a Sunspot query
class SearchFilters::DateRange < SearchFilters::SearchFilter
  attr_accessor :field_name, :from, :to

  class << self
    def dawn_of_time
      Time.zone.at(0)
    end

    def recent_past
      Time.zone.now - 10.days
    end

    def last_week(field_name)
      new(
        field_name:,
        from: 1.week.ago.beginning_of_week,
        to: 1.week.ago.end_of_week
      )
    end

    def this_week(field_name)
      new(
        field_name:,
        from: present.beginning_of_week,
        to: present.end_of_week
      )
    end

    def present
      Time.zone.now
    end
  end

  def query
    return "(#{from_query} AND #{to_query})" if to.present?

    "(#{from_query})"
  end

  def from_query
    SearchFilters::DateValue.new(field_name:, value: from, operator: '>=').query
  end

  def to_query
    SearchFilters::DateValue.new(field_name:, value: to, operator: '<=').query
  end

  def this_quarter?
    return false unless from.present? && to.present?

    from.to_date == Date.today.beginning_of_quarter && to.to_date == Date.today.end_of_quarter
  end

  def last_quarter?
    return false unless from.present? && to.present?

    last_quarter = Date.today - 3.month
    from.to_date == last_quarter.beginning_of_quarter && to.to_date == last_quarter.end_of_quarter
  end

  def this_year?
    return false unless from.present? && to.present?

    from.to_date == Date.today.beginning_of_year && to.to_date == Date.today.end_of_year
  end

  def last_year?
    return false unless from.present? && to.present?

    last_year = Date.today - 1.year
    from.to_date == last_year.beginning_of_year && to.to_date == last_year.end_of_year
  end

  def this_month?
    return false unless from.present? && to.present?

    from.to_date == Date.today.beginning_of_month && to.to_date == Date.today.end_of_month
  end

  def last_month?
    return false unless from.present? && to.present?

    last_month = Date.today - 1.month
    from.to_date == last_month.beginning_of_month && to.to_date == last_month.end_of_month
  end

  def to_h
    {
      type: 'date_range',
      field_name:,
      value: {
        from:,
        to:
      }
    }
  end

  def to_s
    "#{field_name}=#{from&.iso8601}..#{to&.iso8601}"
  end
end
