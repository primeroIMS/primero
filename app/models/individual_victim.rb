# frozen_string_literal: true

# Model for MRM IndividualVictim
class IndividualVictim < ApplicationRecord
  has_and_belongs_to_many :violations
end
