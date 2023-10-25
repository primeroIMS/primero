# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Generates a case from the family
class FamilyLinkageService
  LOCAL_FAMILY_MEMBER_FIELDS = %w[
    family_relationship family_relation_is_caregiver family_relationship_notes family_relationship_notes_additional
  ].freeze
  LOCAL_FAMILY_DETAIL_FIELDS = %w[
    relation
    relation_is_caregiver
    relation_lives_with_child
    relation_child_lived_with_pre_separation
    relation_child_is_in_contact
    relation_child_is_separated_from
    relation_other_family
    child_consent_relation_contact
    no_consent_provide_details
  ].freeze
  LOCAL_FAMILY_FIELDS = %w[family_notes_additional].freeze
  GLOBAL_FAMILY_FIELDS = %w[family_number family_size family_notes].freeze
  FAMILY_DETAIL_MAPPING = [
    { source: 'relation', target: 'family_relationship' },
    { source: 'relation_is_caregiver', target: 'family_relation_is_caregiver' }
  ].map(&:with_indifferent_access).freeze
  DEFAULT_MAPPING = [
    { source: 'relation_name', target: %w[name_first name_middle name_last] },
    { source: 'relation_nickname', target: 'name_nickname' },
    { source: 'relation_sex', target: 'sex' },
    { source: 'relation_age', target: 'age' },
    { source: 'relation_date_of_birth', target: 'date_of_birth' },
    { source: 'relation_age_estimated', target: 'estimated' },
    { source: 'relation_national_id', target: 'national_id_no' },
    { source: 'relation_other_id', target: 'other_id_no' },
    { source: 'relation_ethnicity', target: 'ethnicity' },
    { source: 'relation_sub_ethnicity1', target: 'sub_ethnicity_1' },
    { source: 'relation_sub_ethnicity2', target: 'sub_ethnicity_2' },
    { source: 'relation_language', target: 'language' },
    { source: 'relation_religion', target: 'religion' },
    { source: 'relation_address_current', target: 'address_current' },
    { source: 'relation_landmark_current', target: 'landmark_current' },
    { source: 'relation_location_current', target: 'location_current' },
    { source: 'relation_address_is_permanent', target: 'address_is_permanent' },
    { source: 'relation_telephone', target: 'telephone_current' }
  ].map(&:with_indifferent_access).freeze

  class << self
    def new_family_linked_child(user, source_case, family_detail_id)
      link_child_to_new_family(user, source_case) if source_case.family.blank?
      source_case.family.new_child_from_family_member(user, family_detail_id)
    end

    def link_child_to_new_family(user, child)
      family = Family.new_with_user(user, child_to_family(child))
      family.module_id = child.module_id
      child.family = family
      child.push_family_details_to_family_members
      child.push_to_family_members
    end

    def family_member_to_child(user, family_member)
      child_data = DEFAULT_MAPPING.each_with_object({}) do |elem, memo|
        if elem['source'] == 'relation_name'
          child_names = relation_name_to_child_names(family_member)
          elem['target'].each { |target| memo[target] = child_names[target] }
        else
          memo[elem['target']] = family_member[elem['source']]
        end
      end

      Child.new_with_user(user, child_data.merge('family_member_id' => family_member['unique_id']))
    end

    def child_to_family_member(child)
      DEFAULT_MAPPING.each_with_object({ 'unique_id' => SecureRandom.uuid }) do |elem, memo|
        target = elem['target']
        if elem['source'] == 'relation_name'
          memo[elem['source']] = generate_relation_name(child, target)
          next
        end

        memo[elem['source']] = child.data[target] if child.data.key?(target)
      end
    end

    def generate_relation_name(child, field_names)
      child.data['name'].presence || field_names.map { |field_name| child.data[field_name] }.compact.join(' ')
    end

    def relation_name_to_child_names(family_member)
      relation_name = family_member['relation_name']
      return {} unless relation_name.present?

      names = relation_name.split
      {
        'name_first' => names.first,
        'name_middle' => names.slice(1..-2).join(' ').presence,
        'name_last' => names.size > 1 ? names.last : nil
      }
    end

    def child_to_family(child)
      GLOBAL_FAMILY_FIELDS.each_with_object({}) { |field, memo| memo[field] = child.data[field] }
    end

    def global_family_member_data(family_member)
      family_member.except(*LOCAL_FAMILY_MEMBER_FIELDS)
    end

    def global_family_detail_data(family_detail)
      family_detail.except(*LOCAL_FAMILY_DETAIL_FIELDS)
    end

    def local_family_detail_data(family_detail)
      family_detail.slice('unique_id', *LOCAL_FAMILY_DETAIL_FIELDS)
    end

    def build_family_members_for_details(old_family_details, new_family_details)
      existing_unique_ids = old_family_details&.map { |detail| detail['unique_id'] }
      new_family_details.map do |family_detail|
        if existing_unique_ids&.any? { |id| id == family_detail['unique_id'] }
          global_family_detail_data(family_detail)
        else
          family_detail_to_family_member(family_detail)
        end
      end
    end

    def family_details_local_changes(family_details)
      family_details.each_with_object([]) do |family_detail, memo|
        next unless (family_detail.keys & LOCAL_FAMILY_DETAIL_FIELDS).present?

        memo << local_family_detail_data(family_detail)
      end
    end

    def family_detail_to_family_member(family_detail)
      FAMILY_DETAIL_MAPPING.each_with_object(global_family_detail_data(family_detail)) do |elem, memo|
        next unless family_detail.key?(elem['source'])

        memo[elem['target']] = family_detail[elem['source']]
      end
    end
  end
end
