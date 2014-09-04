#This describes all models that may be owned by a particular user
module Ownable
  extend ActiveSupport::Concern

  included do

    property :owned_by
    property :previously_owned_by
    property :assigned_user_names, :type => [String]
    property :database_operator_user_name
    property :module_id

    #TODO: Does it make sense to have these validations? We cannot guarantee that module and owner will be set all the time, can we?
    #validates_presence_of :associated_user_names, message: I18n.t("errors.models.ownership.associated_user_names_present")
    #validates_presence_of :module_id,  message: I18n.t("errors.models.ownership.module_id_present")

    def owner
      users_by_association[:owner]
    end

    def previous_owner
      users_by_association[:previous_owner]
    end

    def database_operator
      users_by_association[:database_operator]
    end

    def associated_user_names
      ([self.owned_by, self.database_operator_user_name, self.previously_owned_by] + assigned_user_names).compact
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
        hash[:previous_owner] = user if (user.user_name == previously_owned_by)
        #TODO: Put this in only if we need to get user info about the other assigned users (probably transfers)
        #hash[:assigned_users] << user if assigned_user_names && assigned_user_names.include? user.user_name
        hash
      end
    end

  end

end