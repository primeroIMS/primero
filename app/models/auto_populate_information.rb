class AutoPopulateInformation
  include CouchRest::Model::CastedModel

  property :field_key
  property :populate_format, [String], :default => []
  property :separator, String, :defaul => ''
  property :autoPopulated, TrueClass, :default => false

end
