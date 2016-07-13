class Mapping

  include CouchRest::Model::CastedModel
  include PrimeroModel

  property :mapping, default: {}
  property :autocalculate, TrueClass, default: false

end
