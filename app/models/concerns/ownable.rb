#This describes all models that may be owned by a particular user
module Ownable
  extend ActiveSupport::Concern

  included do
    store_accessor :data,
      :owned_by, :owned_by_full_name, :owned_by_agency, :owned_by_groups, :owned_by_location, :owned_by_user_code,
      :previously_owned_by, :previously_owned_by_full_name, :previously_owned_by_agency, :previously_owned_by_location,
      :assigned_user_names, :module_id

    searchable auto_index: self.auto_index? do
      string :associated_user_names, multiple: true
      string :owned_by
      integer :owned_by_groups, multiple: true
      string :assigned_user_names, multiple: true
      string :module_id, as: :module_id_sci
      boolean :not_edited_by_owner
    end

    scope :owned_by, ->(username) { where('data @> ?', { owned_by: username }.to_json) }

    before_save :update_ownership
  end

  def set_owner_fields_for(user)
    self.owned_by = user.user_name
    self.owned_by_full_name = user.full_name
  end

  def owner
    users_by_association[:owner]
  end

  def associated_user_names
    ([self.owned_by] + (assigned_user_names || [])).compact
  end

  #TODO: Refactor as association or AREL query after we migrated User
  #Note this returns all associated users, including the owner
  def associated_users
    user_ids = associated_user_names
    @associated_users ||= if user_ids.present?
      User.where(user_name: user_ids)
    else
      []
    end
  end

  #TODO: Refactor as association or AREL query after we migrated PrimeroModule
  def module
    @record_module ||= PrimeroModule.find_by(unique_id: self.module_id) if self.module_id
  end

  def users_by_association
    @users_by_association ||= associated_users.reduce({assigned_users: []}) do |hash, user|
      hash[:owner] = user if (user.user_name == owned_by)
      #TODO: Put this in only if we need to get user info about the other assigned users (probably transfers)
      #hash[:assigned_users] << user if assigned_user_names && assigned_user_names.include? user.user_name
      hash
    end
  end

  def refresh_users_by_association
    @users_by_association = nil
  end

  def not_edited_by_owner
    (self.data['last_updated_by'] != self.data['owned_by']) && self.data['last_updated_by'].present?
  end
  alias_method :not_edited_by_owner?, :not_edited_by_owner

  def update_ownership
    refresh_users_by_association

    unless self.owner.present?
      self.owned_by = nil
    end

    self.previously_owned_by = self.changes['owned_by'].try(:fetch, 0) || owned_by
    self.previously_owned_by_full_name = self.changes['owned_by_full_name'].try(:fetch, 0) || owned_by_full_name

    if (self.owned_by.present? && (self.new_record? || self.changes_to_save_for_record['owned_by'].present?))
      self.owned_by_agency = self.owner.try(:organization)
      self.owned_by_groups = self.owner.try(:user_group_ids)
      self.owned_by_location = self.owner.try(:location)
      self.owned_by_user_code = self.owner.try(:code)
      unless self.new_record? || !self.will_save_change_to_attribute?('data')
        self.previously_owned_by_agency = self.attributes_in_database['data']['owned_by_agency'] || self.owned_by_agency
        self.previously_owned_by_location = self.attributes_in_database['data']['owned_by_location'] || self.owned_by_location
      end
    end
  end

  def update_last_updated_by(current_user)
    self.last_updated_by = current_user.user_name
    self.last_updated_by_full_name = current_user.full_name
    self.last_updated_organization = current_user.agency
    self.last_updated_at = DateTime.now
  end

end
