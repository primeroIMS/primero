class AutoPopulateInformation
  include CouchRest::Model::CastedModel

  property :populate_field
  property :populate_format, [String], :default => []
  property :separator, String
  property :autoPopulated, TrueClass, :default => false

end
