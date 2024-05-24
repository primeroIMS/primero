# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Model for MRM Perpetrator
class Perpetrator < ApplicationRecord
  include ViolationAssociable

  has_and_belongs_to_many :violations

  store_accessor(:data, :armed_force_group_party_name, :perpetrator_category)

  # TODO: returns the names of the armed_force.name and armed_group.name
  def armed_force_group_name
    []
  end
end
