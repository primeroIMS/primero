class AgeRangeGroup
  include CouchRest::Model::CastedModel

  property :ranges, [AgeRange], :default => []
end
