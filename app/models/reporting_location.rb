class ReportingLocation
  include CouchRest::Model::CastedModel

  property :field_key
  property :label_key
  property :admin_level, Integer, :default => 0

  DEFAULT_FIELD_KEY = 'owned_by_location'
  DEFAULT_LABEL_KEY = 'district'
  DEFAULT_ADMIN_LEVEL = 2
end