# frozen_string_literal: true

# Generates a case from the family
class FamilyLinkageService
  LOCAL_FAMILY_MEMBER_FIELDS = %w[
    family_relationship family_relationship_notes family_relationship_notes_additional
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
    def create_family_linked_child(user, source_case, family_detail_id)
      link_child_to_new_family(user, source_case) if source_case.family.blank?
      target_case = source_case.family.new_child_from_family_member(user, family_detail_id)
      ActiveRecord::Base.transaction do
        source_case.save! if source_case.has_changes_to_save?
        target_case.save!
      end

      target_case
    end

    def link_child_to_new_family(user, child)
      family = Family.new_with_user(user, FamilyLinkageService.child_to_family(child))
      family.module_id = child.module_id
      family.family_members = FamilyLinkageService.build_or_update_family_members(child.family_details_section, [])
      family_member = child_to_family_member(child)
      family.family_members << family_member

      child.family = family
      child.family_member_id = family_member['unique_id']
    end

    def family_member_to_child(user, family_member)
      child_data = DEFAULT_MAPPING.each_with_object({}) do |elem, memo|
        if elem['target'].is_a?(Array)
          elem['target'].each { |target| memo[target] = family_member[elem['source']] }
        else
          memo[elem['target']] = family_member[elem['source']]
        end
      end

      Child.new_with_user(user, child_data.merge('family_member_id' => family_member['unique_id']))
    end

    def child_to_family_member(child)
      DEFAULT_MAPPING.each_with_object({ 'unique_id' => SecureRandom.uuid }) do |elem, memo|
        target = elem['target'].is_a?(Array) ? elem['target'].first : elem['target']
        memo[elem['source']] = child.data[target]
      end
    end

    def child_to_family(child)
      GLOBAL_FAMILY_FIELDS.each_with_object({}) { |field, memo| memo[field] = child.data[field] }
    end

    def family_to_child(family)
      return {} unless family.present?

      GLOBAL_FAMILY_FIELDS.each_with_object({}) { |field, memo| memo[field] = family.data[field] }
    end

    def family_details_section_for_child(child)
      family_details_section = child.family_details_section || []
      return family_details_section unless child.family&.family_members.present?

      child.family.family_members.map do |family_member|
        family_detail = family_details_section.find { |detail| detail['unique_id'] == family_member['unique_id'] }
        next(global_family_member_data(family_member)) unless family_detail.present?

        family_detail.merge(global_family_member_data(family_member))
      end
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

    def build_or_update_family_members(family_details_section, family_members)
      added_family_members = build_family_members(family_details_section, family_members)
      updated_family_members = update_family_members(family_details_section, family_members)

      updated_family_members + added_family_members
    end

    def build_family_members(family_details_section, family_members)
      family_member_ids = family_members.map { |member| member['unique_id'] }

      family_details_section.each_with_object([]) do |detail, memo|
        next unless family_member_ids.exclude?(detail['unique_id'])

        memo << global_family_detail_data(detail)
      end
    end

    def update_family_members(family_details_section, family_members)
      family_members.map do |family_member|
        family_detail = family_details_section.find { |detail| family_member['unique_id'] == detail['unique_id'] }
        next(family_member) unless family_detail.present?

        family_member.merge(global_family_detail_data(family_detail))
      end
    end

    def family_details_section_local_data(family_details_section)
      family_details_section.map { |family_detail| local_family_detail_data(family_detail) }
    end
  end
end
