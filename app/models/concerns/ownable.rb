#This describes all models that may be owned by a particular user
module Ownable
  extend ActiveSupport::Concern

  included do

    property :owned_by_id
    property :assigned_user_ids, :type => [String]
    property :module_id

    def owner
      User.get(self.owned_by_id)  if self.owned_by_id
    end

    #Nothe this returns all associated usres, including the owner
    def associated_users
      user_ids = ([self.owned_by_id] + assigned_user_ids).compact
      if user_ids.present?
        User.all(keys: user_ids).all
      else
        []
      end
    end

    def module
      PrimeroModule.get(self.module_id) if self.module_id
    end

  end

end