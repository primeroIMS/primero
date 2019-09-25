#This describes all models that may be owned by a particular user
module Ownable
  extend ActiveSupport::Concern

  included do

    before_save :update_ownership

    property :owned_by, String
    property :owned_by_full_name, String
    property :owned_by_agency, String
    property :owned_by_groups, [String]
    property :owned_by_location, String
    property :owned_by_user_code, String

    #TODO - this field is deprecated
    #TODO - remove this in a future refactor
    property :owned_by_location_district, String

    property :previously_owned_by, String
    property :previously_owned_by_full_name, String
    property :previously_owned_by_agency, String
    property :previously_owned_by_location, String
    property :assigned_user_names, :type => [String]
    property :associated_user_groups, :type => [String]
    property :database_operator_user_name, String
    property :module_id

    #TODO: Does it make sense to have these validations? We cannot guarantee that module and owner will be set all the time, can we?
    #validates_presence_of :associated_user_names, message: I18n.t("errors.models.ownership.associated_user_names_present")
    #validates_presence_of :module_id,  message: I18n.t("errors.models.ownership.module_id_present")

    def owner
      users_by_association[:owner]
    end

    def database_operator
      users_by_association[:database_operator]
    end

    def associated_user_names
      ([self.owned_by, self.database_operator_user_name] + assigned_user_names).compact
    end

    #Note this returns all associated users, including the owner
    def associated_users
      user_ids = associated_user_names
      @associated_users ||= if user_ids.present?
        User.by_user_name(keys: user_ids).all
      else
        []
      end
    end

    def module
      @record_module ||= PrimeroModule.get(self.module_id) if self.module_id
    end

    def users_by_association
      @users_by_association ||= associated_users.reduce({assigned_users: []}) do |hash, user|
        hash[:owner] = user if (user.user_name == owned_by)
        hash[:database_operator] = user if (user.user_name == database_operator_user_name)
        #TODO: Put this in only if we need to get user info about the other assigned users (probably transfers)
        #hash[:assigned_users] << user if assigned_user_names && assigned_user_names.include? user.user_name
        hash
      end
    end

    def refresh_users_by_association
      @users_by_association = nil
    end
  end

  def update_ownership
    refresh_users_by_association

    unless self.owner.present?
      self.owned_by = nil
    end

    self.previously_owned_by = self.changes['owned_by'].try(:fetch, 0) || owned_by
    self.previously_owned_by_full_name = self.changes['owned_by_full_name'].try(:fetch, 0) || owned_by_full_name

    if (self.changes['owned_by'].present? || self.new?) && self.owned_by.present?
      self.owned_by_agency = self.owner.try(:organization)
      self.owned_by_groups = self.owner.try(:user_group_ids)
      self.owned_by_location = self.owner.try(:location)
      self.owned_by_user_code = self.owner.try(:code)
      self.previously_owned_by_agency = self.changes['owned_by_agency'].try(:fetch, 0) || owned_by_agency
      self.previously_owned_by_location = self.changes['owned_by_location'].try(:fetch, 0) || owned_by_location
    end

    if (self.changes['assigned_user_names'].present? || self.new?)
      self.update_associated_user_groups
    end
  end

  def update_associated_user_groups
    self.associated_user_groups = (self.assigned_user_names || []).map do |user_name|
      User.find_by_user_name(user_name).user_group_ids
    end.flatten.compact
  end

  def update_last_updated_by(current_user)
    self.last_updated_by = current_user.user_name
    self.last_updated_by_full_name = current_user.full_name
    self.last_updated_organization = current_user.agency
    self.last_updated_at = DateTime.now
  end
end
