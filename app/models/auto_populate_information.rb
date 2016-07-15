class AutoPopulateInformation
  include CouchRest::Model::CastedModel

  property :field_key
  property :format, [String], :default => []
  property :separator, String, :default => ''
  property :auto_populated, TrueClass, :default => false

end
