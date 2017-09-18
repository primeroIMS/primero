class SearchValue
  include CouchRest::Model::CastedModel
  include PrimeroModel

  property :name
  property :value
end