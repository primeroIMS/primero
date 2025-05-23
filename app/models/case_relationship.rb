# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

# Model for case relationships
# rubocop:disable Naming/VariableNumber
class CaseRelationship < ApplicationRecord
  RELATIONSHIP_MAP = {
    'farm_for' => 'farmer_on'
  }.freeze

  validates_presence_of :case_id_1, :case_id_2, :relationship_type
  validate :valid_relationship_type

  scope :list, lambda { |case_id, type|
    query_field = RELATIONSHIP_MAP[type] ? 'case_id_2' : 'case_id_1'
    where("#{query_field} = :id", id: case_id).where(disabled: false).order(created_at: :desc)
  }

  def valid_relationship_type
    return true if RELATIONSHIP_MAP.key?(relationship_type) || RELATIONSHIP_MAP.value?(relationship_type)

    errors.add(:relationship_type, I18n.t('errors.models.case_relationship.relationship_type'))
  end

  def self.new_case_relationship(primary_case_id:, related_case_id:, type:)
    mapped_relationship = RELATIONSHIP_MAP[type]
    new(
      case_id_1: mapped_relationship.present? ? related_case_id : primary_case_id,
      case_id_2: mapped_relationship.present? ? primary_case_id : related_case_id,
      relationship_type: RELATIONSHIP_MAP[type] || type,
      disabled: false
    )
  end

  def relationship(child_id)
    child_id == case_id_1 ? relationship_type : RELATIONSHIP_MAP.key(relationship_type)
  end

  def case_id(child_id)
    child_id == case_id_1 ? case_id_2 : case_id_1
  end
end
# rubocop:enable Naming/VariableNumber
