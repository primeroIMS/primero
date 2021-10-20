# frozen_string_literal: true

# Model for MRM Source
class Source < ApplicationRecord
  include MRMAssociable

  has_many :violations
end
