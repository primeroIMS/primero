# frozen_string_literal: true

# A shared concern for all Records that can be linked to a Family Record
module FamilyLinkable
  extend ActiveSupport::Concern

  included do
    belongs_to :family, foreign_key: :family_id, optional: true

    before_save :stamp_family_fields
    before_save :associate_to_family
    after_save :associate_family_member
    after_save :save_family
    after_save :disassociate_family_member
  end

  def stamp_family_fields
    return unless changes_to_save.key?('family_id')

    self.family_id_display = family&.family_id_display
    self.family_member_id = nil if family_id.nil?
  end

  def associate_to_family
    return unless changes_to_save.key?('family_id') && family_member_id.blank? && family.present?

    family_member = FamilyLinkageService.child_to_family_member(self)
    family.family_members << family_member
    self.family_member_id = family_member['unique_id']
  end

  def associate_family_member
    return unless saved_changes_to_record.keys.include?('family_member_id') && family.present?

    family.family_members = family.family_members.map do |member|
      next(member) unless member['unique_id'] == family_member_id

      member.merge('case_id' => id, 'case_id_display' => case_id_display)
    end
  end

  def disassociate_family_member
    return unless @family_to_disassociate.present?

    @family_to_disassociate.family_members = @family_to_disassociate.family_members.map do |member|
      next(member) unless member['case_id'] == id

      member.merge('case_id' => nil, 'case_id_display' => nil)
    end
    @family_to_disassociate.save!
  end

  def update_associated_family(properties)
    if properties.key?('family_id')
      # TODO: This code will need to be refactored to use Rails 7 tracking methods for belongs_to associations
      @family_to_disassociate = family if properties['family_id'].nil?
      self.family_id = properties.delete('family_id')
    end
    update_family_fields(properties)
    update_family_members(properties)
  end

  def save_family
    return unless family.present? && family.has_changes_to_save?

    family.save!
  end

  def update_family_fields(properties)
    return unless family.present?

    changed_family_fields = FamilyLinkageService::GLOBAL_FAMILY_FIELDS & properties.keys
    changed_family_fields.each { |field| family.data[field] = properties.delete(field) }
  end

  def update_family_members(properties)
    return unless family.present? && properties.key?('family_details_section')

    family_details_section_data = properties.delete('family_details_section')
    return unless family_details_section_data.present?

    family_members = FamilyLinkageService.build_or_update_family_members(
      family_details_section_data,
      family.family_members || []
    )
    family.family_members = family_members if family_members.present?
    update_local_family_details(family_details_section_data)
  end

  def update_local_family_details(family_details_section_data)
    self.family_details_section = family_details_section_data.map do |family_detail|
      existing_detail = family_details_section&.find { |existing| existing['unique_id'] == family_detail['unique_id'] }
      next(FamilyLinkageService.local_family_detail_data(family_detail)) unless existing_detail.present?

      existing_detail.merge(FamilyLinkageService.local_family_detail_data(family_detail))
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

  def family_changes(changes)
    changes ||= saved_changes_to_record.keys
    if changes.include?('family_id_display')
      return FamilyLinkageService::GLOBAL_FAMILY_FIELDS + ['family_details_section']
    end

    field_names = []
    return field_names unless family.present?

    field_names << 'family_details_section' if family.family_members_changed?
    field_names += FamilyLinkageService::GLOBAL_FAMILY_FIELDS & family.saved_changes_to_record.keys
    field_names
  end
end
