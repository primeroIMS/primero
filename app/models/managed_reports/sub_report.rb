# frozen_string_literal: true

# Describes a Sub Report for a Managed Report
class ManagedReports::SubReport < ValueObject
  attr_accessor :data

  def build_report(params = [])
    self.data = indicators.reduce({}) { |acc, indicator| acc.merge(indicator.id => indicator.build(params).data) }
    self.data = data.merge(lookups: lookups) if lookups.present?
  end

  def id; end

  def indicators
    []
  end

  def lookups
    {}
  end
end
