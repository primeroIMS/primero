class UserGroup < ApplicationRecord

  use_database :user_group

  include PrimeroModel
  include Namable #delivers "name" and "description" fields

  property :core_resource, TrueClass, :default => false
end
