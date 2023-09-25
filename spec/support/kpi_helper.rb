# frozen_string_literal: true

module KpiHelper
  def kpi(klass, from, to, owned_by_groups)
    klass.new({ from:, to:, owned_by_groups: })
  end
end
