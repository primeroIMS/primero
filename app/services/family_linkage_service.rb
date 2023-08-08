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
    { source: 'relation_national_id', target: 'national_id' },
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
    def new_child_for_family_member(user, family_id, family_member_id)
      family = Family.find(family_id)
      family_member = family.find_family_member(family_member_id)
      child = Child.new_with_user(user, child_data_from_family_member(family_member))
      child.family_id = family_id
      child.family_member_id = family_member['unique_id']
      child.module_id = family.module_id
      child
    end

    def child_data_from_family_member(family_member)
      DEFAULT_MAPPING.each_with_object({}) do |elem, memo|
        if elem['target'].is_a?(Array)
          elem['target'].each { |target| memo[target] = family_member[elem['source']] }
        else
          memo[elem['target']] = family_member[elem['source']]
        end
      end
    end

    def family_details_for_child(child)
      return {} unless child.family.present?

      GLOBAL_FAMILY_FIELDS.each_with_object({}) { |field, memo| memo[field] = child.family.data[field] }
    end

    def family_details_section_for_child(child)
      return child.family_details_section unless child.family&.family_members.present?

      child.family.family_members.map do |family_member|
        family_detail = child.family_details_section&.find do |detail|
          detail['unique_id'] == family_member['unique_id']
        end
        next(global_member_data(family_member)) unless family_detail.present?

        family_detail.merge(global_member_data(family_member))
      end
    end

    def global_member_data(family_member)
      family_member.except(*LOCAL_FAMILY_MEMBER_FIELDS)
    end
  end
end
