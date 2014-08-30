#This describes all models that may be owned by a particular user
module Ownable
  extend ActiveSupport::Concern

  included do

    property :owned_by_id
    property :assigned_user_ids, :type => [String]
    property :module_id

    validates_presence_of :associated_user_ids, message: I18n.t("errors.models.ownership.associated_user_ids_present")
    validates_presence_of :module_id,  message: I18n.t("errors.models.ownership.module_id_present")

    def owner
      User.get(self.owned_by_id)  if self.owned_by_id
    end

    def associated_user_ids
      ([self.owned_by_id] + assigned_user_ids).compact
    end

    #Nothe this returns all associated usres, including the owner
    def associated_users
      user_ids = associated_user_ids
      if user_ids.present?
        User.all(keys: user_ids).all
      else
        []
      end
    end

    def module
      @record_module ||= PrimeroModule.get(self.module_id) if self.module_id
    end


  end

end