# frozen_string_literal: true

# Model for MRM Response
class Response < ApplicationRecord
  include MRMAssociable

  belongs_to :violation, optional: true

  def violations=(data)
    return unless data.present? && data.one?

    self.violation = data.first
  end
end
