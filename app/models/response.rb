# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Model for MRM Response
class Response < ApplicationRecord
  include ViolationAssociable

  belongs_to :violation, optional: true

  def violations=(data)
    return unless data.present? && data.one? && data.first.is_a?(Violation)

    self.violation = data.first
  end

  def violations
    violation
  end

  def associations_as_data
    data['violations_ids'] = violation_id
    data
  end
end
