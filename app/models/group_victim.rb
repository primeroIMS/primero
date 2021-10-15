# frozen_string_literal: true

# Model for MRM GroupVictim
class GroupVictim < ApplicationRecord
  has_and_belongs_to_many :violations

  store_accessor :data, :unique_id

  after_initialize :set_unique_id

  def set_unique_id
    self.unique_id = id
  end

  def self.build_record(violation, data)
    group_victim = find_or_initialize_by(id: data['unique_id'])
    group_victim.data = data
    group_victim
  end
end
