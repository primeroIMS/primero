class PrimeroProgram < CouchRest::Model::Base

  use_database :primero_program

  include PrimeroModel
  include Namable #delivers "name" and "description" fields


end
