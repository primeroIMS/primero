# frozen_string_literal: true

# A shared concern for all Records that can be linked to a Family Record
module FamilyLinkable
  extend ActiveSupport::Concern

  included do
    belongs_to :family, foreign_key: :family_id, optional: true

    before_save :stamp_family_fields
    after_save :associate_family_member
    after_save :save_family
  end

  def stamp_family_fields
    return unless changes_to_save.key?('family_id')

    self.family_id_display = family&.family_id_display
    self.family_number = family&.family_number
  end

  def associate_family_member
    return unless saved_changes_to_record.keys.include?('family_member_id')

    family.family_members = family.family_members.map do |member|
      next(member) unless member['unique_id'] == family_member_id

      member.merge('case_id' => id, 'case_id_display' => case_id_display)
    end
  end

  def family_members_details
    family_details = family_details_section || []
    return family_details unless family&.family_members.present?

    family_members.map do |family_member|
      family_detail = family_details.find { |detail| detail['unique_id'] == family_member['unique_id'] }
      next(FamilyLinkageService.global_family_member_data(family_member)) unless family_detail.present?

      family_detail.merge(FamilyLinkageService.global_family_member_data(family_member))
    end
  end

  def find_family_detail(family_detail_id)
    family_detail = family_details_section.find { |member| member['unique_id'] == family_detail_id }
    return family_detail if family_detail.present?

    raise(ActiveRecord::RecordNotFound, "Couldn't find Family Detail with 'id'=#{family_detail_id}")
  end

  def family_members
    (family&.family_members || []).reject { |member| member['unique_id'] == family_member_id }
  end
end
