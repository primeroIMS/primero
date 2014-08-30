#This describes all models that may be owned by a particular user
module Ownable
  extend ActiveSupport::Concern

  included do

    property :owned_by
    property :assigned_user_names, :type => [String]
    property :module_id

    validates_presence_of :associated_user_names, message: I18n.t("errors.models.ownership.associated_user_names_present")
    validates_presence_of :module_id,  message: I18n.t("errors.models.ownership.module_id_present")

    def owner
      User.get(self.owned_by)  if self.owned_by
    end

    def associated_user_names
      ([self.owned_by] + assigned_user_names).compact
    end

    #Nothe this returns all associated usres, including the owner
    def associated_users
      user_ids = associated_user_names
      if user_ids.present?
        User.by_user_name(keys: user_ids).all
      else
        []
      end
    end

    def module
      @record_module ||= PrimeroModule.get(self.module_id) if self.module_id
    end


  end

end