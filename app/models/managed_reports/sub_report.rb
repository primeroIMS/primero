# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Describes a Sub Report for a Managed Report
class ManagedReports::SubReport < ValueObject
  attr_accessor :data, :user, :params

  def build_report(current_user, params = {})
    self.user = current_user
    self.params = params
    self.data = {
      data: indicators.reduce({}) do |acc, indicator|
        acc.merge(indicator.id => indicator.build(current_user, params).data)
      end,
      metadata:
    }
  end

  def metadata
    {
      display_graph:,
      lookups:,
      table_type:,
      order:,
      indicators_rows:,
      indicators_subcolumns:
    }
  end

  def display_graph
    true
  end

  def table_type
    'default'
  end

  def id; end

  def indicators
    []
  end

  def lookups
    {}
  end

  def order
    indicators.map(&:id)
  end

  def indicators_subcolumns
    {}
  end

  def indicators_rows
    {}
  end

  def sub_column_items(lookup_unique_id)
    lookup = Lookup.find_by(unique_id: lookup_unique_id)
    return [] if lookup.blank?

    lookup.lookup_values.map { |lk| lk['id'] }
  end
end
