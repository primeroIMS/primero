class ExportableLocation
  include CouchRest::Model::CastedModel

  property :field_name
  property :display_name
  property :admin_level, Integer, :default => 0
end