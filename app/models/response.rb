# frozen_string_literal: true

# Model for MRM Response
class Response < ApplicationRecord
  belongs_to :violation, optional: true

  store_accessor :data, :unique_id

  after_initialize :set_unique_id

  def set_unique_id
    self.unique_id = id
  end

  def self.build_record(violation, data)
    response = find_or_initialize_by(id: data['unique_id'])
    response.data = data
    response.violation = violation
    response
  end
end
