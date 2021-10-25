# frozen_string_literal: true

# Model for MRM Source
class Source < ApplicationRecord
  include ViolationAssociable

  has_many :violations
end
