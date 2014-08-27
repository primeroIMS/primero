class PrimeroProgram < CouchRest::Model::Base

  use_database :primero_program

  include RapidFTR::Model
  include Namable #delivers "name" and "description" fields


end