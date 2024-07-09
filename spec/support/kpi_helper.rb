# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

module KpiHelper
  def kpi(klass, from, to, owned_by_groups)
    klass.new({ from:, to:, owned_by_groups: })
  end
end
