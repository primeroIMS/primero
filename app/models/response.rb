# frozen_string_literal: true

# Model for MRM Response
class Response < ApplicationRecord
  include ViolationAssociable

  belongs_to :violation, optional: true

  def violations=(data)
    return unless data.present? && data.one?

    self.violation = data.first
  end

  def associations_as_data
    data['violations_ids'] = violation_id
    data
  end
end
