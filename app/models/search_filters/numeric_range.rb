# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform API query parameter field_name=m..n into a Sunspot query
class SearchFilters::NumericRange < SearchFilters::SearchFilter
  attr_accessor :field_name, :from, :to

  def query_scope(sunspot)
    this = self
    sunspot.instance_eval do
      if this.to.blank?
        with(this.field_name).greater_than_or_equal_to(this.from)
      else
        with(this.field_name, this.from...this.to)
      end
    end
  end

  def query
    "(#{from_query} AND #{to_query})"
  end

  def from_query
    SearchFilters::Value.new(field_name:, value: from, operator: '>').query
  end

  def to_query
    SearchFilters::Value.new(field_name:, value: to, operator: '<').query
  end

  def to_h
    {
      type: 'numeric_range',
      field_name:,
      value: {
        from:,
        to:
      }
    }
  end

  def to_s
    "#{field_name}=#{from}..#{to&.to_s}"
  end
end
