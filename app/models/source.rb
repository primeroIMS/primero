# frozen_string_literal: true

# Model for MRM Source
class Source < ApplicationRecord
  has_many :violations
end
