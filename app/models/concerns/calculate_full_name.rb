# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Calculates the full name of a record
module CalculateFullName
  extend ActiveSupport::Concern

  included do
    before_save :auto_populate_name
  end

  def auto_populate_name
    # This 2 step process is necessary because you don't want to overwrite self.name if auto_populate is off
    a_name = AutoPopulateService.auto_populate(self, 'name')
    self.name = a_name if a_name.present?
  end
end
