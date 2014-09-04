class Agency < CouchRest::Model::Base
  use_database :agency

  include RapidFTR::Model
  include RapidFTR::CouchRestRailsBackward

  include Namable


  property :telephone
  #TODO: What are some other agency fields?

  #TODO: Add functionality for storing and fetching the agency logo from the database
  property :logo_key


end