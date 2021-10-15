# frozen_string_literal: true

# Model for MRM Perpetrator
class Perpetrator < ApplicationRecord
  has_and_belongs_to_many :violations

  store_accessor :data, :unique_id

  after_initialize :set_unique_id

  def set_unique_id
    self.unique_id = id
  end

  def self.build_record(violation, data)
    perpetrator = find_or_initialize_by(id: data['unique_id'])
    perpetrator.data = data
    perpetrator
  end

  # TODO: returns the names of the armed_force.name and armed_group.name
  def armed_force_group_name
    []
  end
end
