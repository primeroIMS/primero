# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

module SunspotHelper
  def indexed_field(value, klass = nil)
    Sunspot::Type.for_class(klass || value.class).to_indexed(value)
  end
end
