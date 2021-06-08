# frozen_string_literal: true

# This describes all models that may be owned by a particular user
module Ownable
  extend ActiveSupport::Concern

  included do
    store_accessor :data, :owned_by, :owned_by_full_name, :owned_by_agency_id, :owned_by_groups, :owned_by_location,
                   :owned_by_user_code, :owned_by_agency_office, :previously_owned_by, :previously_owned_by_full_name,
                   :previously_owned_by_agency, :previously_owned_by_location, :previously_owned_by_agency_office,
                   :assigned_user_names, :module_id, :associated_user_groups, :associated_user_agencies,
                   :associated_user_names

    searchable do
      %i[
        associated_user_names associated_user_groups associated_user_agencies owned_by_groups assigned_user_names
      ].each { |field| string(field, multiple: true) }
      %i[
        owned_by_agency_id owned_by_location owned_by_agency_office module_id owned_by
      ].each { |field| string(field, as: "#{field}_sci") }
      boolean :not_edited_by_owner
    end

    scope :owned_by, ->(username) { where('data @> ?', { owned_by: username }.to_json) }
    scope :associated_with, (lambda do |username|
      where(
        "(data -> 'assigned_user_names' ? :username) OR (data -> 'owned_by' ? :username)",
        username: username
      )
    end)

    before_save :update_associated
    before_save :update_owned_by
    before_update :update_previously_owned_by
  end

  def owner_fields_for(user)
    self.owned_by ||= user&.user_name
    self.owned_by_full_name = user&.full_name
    # TODO: Why are we storing this?
    self.associated_user_names = ([owned_by] + (assigned_user_names || [])).compact.uniq
  end

  def associated_users(reload = false)
    return @associated_users unless reload || @associated_users.nil?

    @associated_users = User.where(user_name: associated_user_names)
  end

  def owner(reload = false)
    return @owner unless reload || @owner.nil?

    @owner = associated_users(reload).find { |u| u.user_name == owned_by }
  end

  def module
    @record_module ||= PrimeroModule.find_by(unique_id: module_id) if module_id
  end

  def owned_by_agency
    @record_agency ||= Agency.find_by(unique_id: owned_by_agency_id)&.agency_code if owned_by_agency_id
  end

  def not_edited_by_owner
    (data['last_updated_by'] != data['owned_by']) && data['last_updated_by'].present?
  end
  alias not_edited_by_owner? not_edited_by_owner

  # rubocop:disable Metrics/AbcSize
  def update_owned_by
    return unless owned_by.present?
    return unless new_record? || changes_to_save_for_record['owned_by'].present?

    new_owner = owner(true)
    return revert_owned_by unless new_owner

    self.owned_by_full_name = new_owner&.full_name
    self.owned_by_agency_id = new_owner&.organization&.unique_id
    self.owned_by_groups = new_owner&.user_group_unique_ids
    self.owned_by_location = new_owner&.location
    self.owned_by_user_code = new_owner&.code
    self.owned_by_agency_office = new_owner&.agency_office
  end

  def revert_owned_by
    self.owned_by = changes_to_save_for_record['owned_by'][0]
  end

  def update_previously_owned_by
    return if changes_to_save_for_record['owned_by'].blank?

    self.previously_owned_by = attributes_in_database['data']['owned_by']
    self.previously_owned_by_full_name = attributes_in_database['data']['owned_by_full_name']
    self.previously_owned_by_agency = attributes_in_database['data']['owned_by_agency_id']
    self.previously_owned_by_location = attributes_in_database['data']['owned_by_location']
    self.previously_owned_by_agency_office = attributes_in_database['data']['owned_by_agency_office']
  end
  # rubocop:enable Metrics/AbcSize

  def update_associated
    return unless changes_to_save_for_record['assigned_user_names'].present? ||
                  changes_to_save_for_record['owned_by'].present? ||
                  new_record?

    self.associated_user_names = ([owned_by] + (assigned_user_names || [])).compact.uniq
    update_associated_user_groups
    update_associated_user_agencies
  end

  def update_associated_user_groups
    self.associated_user_groups = UserGroup.joins(:users).where(
      users: { user_name: associated_user_names }
    ).pluck(:unique_id).uniq
  end

  def update_associated_user_agencies
    self.associated_user_agencies = Agency.joins(:users).where(
      users: { user_name: associated_user_names }
    ).pluck(:unique_id).uniq
  end

  # TODO: Move to Historical
  def update_last_updated_by(current_user)
    self.last_updated_by = current_user.user_name
    self.last_updated_by_full_name = current_user.full_name
    self.last_updated_organization = current_user.agency&.unique_id
    self.last_updated_at = DateTime.now
  end

  def owner?(user)
    owned_by == user&.user_name
  end
end
