# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Model for MRM Source
class Source < ApplicationRecord
  include ViolationAssociable

  has_and_belongs_to_many :violations
end
