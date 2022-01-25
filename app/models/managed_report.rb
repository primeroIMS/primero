# frozen_string_literal: true

# Describes ManagedReport in Primero.
class ManagedReport
  attr_accessor :values

  def properties
    {}
  end

  def build_report
    raise NotImplementedError
  end

  def subreports
    []
  end

  def apply_filters(params)
    {}.merge(params)
  end
end
