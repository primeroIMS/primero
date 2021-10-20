# frozen_string_literal: true

# Model for MRM GroupVictim
class GroupVictim < ApplicationRecord
  include MRMAssociable

  has_and_belongs_to_many :violations
end
