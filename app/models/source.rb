# frozen_string_literal: true

# Model for MRM Source
class Source < ApplicationRecord
  has_many :violations

  store_accessor :data, :unique_id

  after_initialize :set_unique_id

  def set_unique_id
    self.unique_id = id
  end
end
