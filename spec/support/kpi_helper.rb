module KpiHelper
  def kpi(klass, from, to, owned_by_groups)
    klass.new({ from: from, to: to, owned_by_groups: owned_by_groups })
  end
end
