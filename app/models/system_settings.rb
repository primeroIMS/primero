class SystemSettings < CouchRest::Model::Base
  use_database :system_settings

  include PrimeroModel
  
  property :default_locale, String
  
  design do
    view :all
  end
  
end