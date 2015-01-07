class UserGroup < CouchRest::Model::Base

  use_database :user_group

  include PrimeroModel
  include Namable #delivers "name" and "description" fields
  include Importable

end
