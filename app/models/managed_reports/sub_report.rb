# frozen_string_literal: true

# Describes a Sub Report for a Managed Report
class ManagedReports::SubReport < ValueObject
  attr_accessor :data

  def build_report(current_user, params = [])
    self.data = indicators.reduce({}) do |acc, indicator|
      acc.merge(indicator.id => indicator.build(current_user, params).data)
    end
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
