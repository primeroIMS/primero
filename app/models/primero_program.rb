class PrimeroProgram < CouchRest::Model::Base

  use_database :primero_program

  include PrimeroModel
  include Namable #delivers "name" and "description" fields

  property :start_date, Date
  property :end_date, Date
  property :core_resource, TrueClass, :default => true

  def self.new_custom primero_program
    primero_program[:core_resource] = false  #Indicates user-added program

    pp = PrimeroProgram.new(primero_program)

    return pp
  end

end
