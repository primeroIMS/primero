# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

# Model for case relationships
class CaseRelationship < ApplicationRecord
  RELATIONSHIP_MAP = {
    'farm_for' => 'farmer_on'
  }.freeze

  RELATIONSHIP_FIELD_MAP = {
    'farmer_on' => 'from_case_id',
    'farm_for' => 'to_case_id'
  }.freeze

  validates_presence_of :from_case_id, :to_case_id, :relationship_type
  validate :valid_relationship_type
  validate :validate_not_linked_to_self

  belongs_to :from_case, class_name: 'Child', foreign_key: :from_case_id
  belongs_to :to_case, class_name: 'Child', foreign_key: :to_case_id

  scope :list, lambda { |case_id, relationship_type|
    where(
      RELATIONSHIP_FIELD_MAP[relationship_type] => case_id,
      relationship_type: RELATIONSHIP_MAP[relationship_type] || relationship_type
    ).order(created_at: :desc)
  }

  def valid_relationship_type
    return true if RELATIONSHIP_MAP.key?(relationship_type) || RELATIONSHIP_MAP.value?(relationship_type)

    errors.add(:relationship_type, I18n.t('errors.models.case_relationship.relationship_type'))
  end

  def self.new_case_relationship(primary_case_id:, related_case_id:, relationship_type:)
    mapped_relationship = RELATIONSHIP_MAP[relationship_type]
    new(
      from_case_id: mapped_relationship.present? ? related_case_id : primary_case_id,
      to_case_id: mapped_relationship.present? ? primary_case_id : related_case_id,
      relationship_type: mapped_relationship || relationship_type,
      disabled: false
    )
  end

  def relationship(child_id)
    child_id == from_case_id ? relationship_type : RELATIONSHIP_MAP.key(relationship_type)
  end

  def case_id(child_id)
    child_id == from_case_id ? to_case_id : from_case_id
  end

  def related_case(child_id)
    child_id == from_case_id ? to_case : from_case
  end

  def validate_not_linked_to_self
    return true if from_case_id != to_case_id

    errors.add(:to_case_id, I18n.t('errors.models.case_relationship.not_linked_to_self'))
  end
end
