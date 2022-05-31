# frozen_string_literal: true

# Describes a Sub Report for a Managed Report
class ManagedReports::SubReport < ValueObject
  attr_accessor :data

  def build_report(current_user, params = {})
    self.data = {
      data: indicators.reduce({}) do |acc, indicator|
        acc.merge(indicator.id => indicator.build(current_user, params).data)
      end,
      metadata: {
        display_graph: display_graph,
        lookups: lookups,
        table_type: table_type
      }
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
end
