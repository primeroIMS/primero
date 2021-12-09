# frozen_string_literal: true

# Model for MRM Perpetrator
class Perpetrator < ApplicationRecord
  include ViolationAssociable

  has_and_belongs_to_many :violations

  # TODO: returns the names of the armed_force.name and armed_group.name
  def armed_force_group_name
    []
  end
end
