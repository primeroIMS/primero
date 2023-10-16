# frozen_string_literal: true

# Describes the family linkages
class Family < ApplicationRecord
  include Record
  include Searchable
  include Historical
  include Ownable
  include Flaggable
  include Alertable
  include Attachable
  include EagerLoadable
  include LocationCacheable

  store_accessor(
    :data,
    :status, :family_id, :family_name, :family_number, :family_size, :family_notes,
    :family_registration_date, :family_id_display, :family_location_current,
    :family_members
  )

  has_many :cases, class_name: 'Child', foreign_key: :family_id

  alias family_details_section family_members

  class << self
    def filterable_id_fields
      %w[family_id short_id family_number]
    end

    def quicksearch_fields
      filterable_id_fields + %w[family_name]
    end

    def sortable_text_fields
      %w[short_id]
    end

    def summary_field_names
      common_summary_fields + %w[
        family_registration_date family_id_display family_name family_number module_id family_location_current
      ]
    end
  end

  searchable do
    date :family_registration_date
    %w[id status].each { |f| string(f, as: "#{f}_sci") }
    filterable_id_fields.each { |f| string("#{f}_filterable", as: "#{f}_filterable_sci") { data[f] } }
    quicksearch_fields.each { |f| text_index(f) }
    sortable_text_fields.each { |f| string("#{f}_sortable", as: "#{f}_sortable_sci") { data[f] } }
    string :family_name, multiple: true
  end

  alias super_defaults defaults
  def defaults
    super_defaults
    self.family_registration_date ||= Date.today
    self.family_members ||= []
  end

  def set_instance_id
    self.family_id ||= unique_identifier
    self.family_id_display ||= short_id
  end

  def new_child_from_family_member(user, family_member_id)
    family_member = find_family_member(family_member_id)
    child = FamilyLinkageService.family_member_to_child(user, family_member)
    child.family = self
    child.module_id = module_id
    child
  end

  def find_family_member(family_member_id)
    family_member = family_members.find { |member| member['unique_id'] == family_member_id }
    return family_member if family_member.present?

    raise(ActiveRecord::RecordNotFound, "Couldn't find Family Member with 'id'=#{family_member_id}")
  end

  def family_members_changed?
    saved_changes_to_record.keys.include?('family_members')
  end

  def cases_grouped_by_id
    cases&.group_by(&:id) || {}
  end
end
