# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Objects that describes a computed field on a record, such as the case_id_display or name
class AutoPopulateInformation < ValueObject
  attr_accessor :field_key, :format, :separator, :auto_populated

  def initialize(args = {})
    super(args)
    self.auto_populated ||= false
    self.format ||= []
    self.separator ||= ''
  end
end
