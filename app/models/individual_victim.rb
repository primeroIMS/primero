# frozen_string_literal: true

# Model for MRM IndividualVictim
class IndividualVictim < ApplicationRecord
  include MRMAssociable

  has_and_belongs_to_many :violations
end
