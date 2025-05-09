# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.
class Indicators::IndicatorPivot < ValueObject
  attr_accessor :field_name, :index, :multivalue, :type, :admin_level, :constrained, :query_param

  def select
    raise NotImplementedError
  end

  def select_location_pivot
    raise NotImplementedError
  end

  def join_multivalue
    raise NotImplementedError
  end

  def constraint_values
    raise NotImplementedError
  end

  def name
    "pivot#{index}"
  end

  def multivalue?
    multivalue == true
  end

  def location?
    type == 'location'
  end

  def constrained?
    constrained == true
  end

  def to_param
    return query_param if query_param.present?
    return "loc:#{field_name}#{admin_level}" if location?

    field_name
  end
end
