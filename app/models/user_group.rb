class UserGroup < CouchRest::Model::Base

  use_database :user_group

  include RapidFTR::Model
  include Namable #delivers "name" and "description" fields


end