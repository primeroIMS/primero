class UserGroup < CouchRest::Model::Base

  use_database :user_group

  include PrimeroModel
  include Namable #delivers "name" and "description" fields

  property :core_resource, TrueClass, :default => false

  def self.ids
    self.all.rows.map(&:id).uniq
  end
end
