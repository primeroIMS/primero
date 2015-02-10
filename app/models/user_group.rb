class UserGroup < CouchRest::Model::Base

  use_database :user_group

  include PrimeroModel
  include Namable #delivers "name" and "description" fields

  property :core_resource, TrueClass, :default => true

  def self.new_custom user_group
    user_group[:core_resource] = false  #Indicates user-added user group

    ug = UserGroup.new(user_group)

    return ug
  end
end
