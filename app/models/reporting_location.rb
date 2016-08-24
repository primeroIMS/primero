class ReportingLocation
  include CouchRest::Model::CastedModel

  property :field_key
  property :label_key
  property :admin_level, Integer, :default => 0
end