class AgeRangeGroup
  include CouchRest::Model::CastedModel

  property :ranges, [AgeRange], :default => []

  def self.createDefaultSet
    ranges = [ AgeRange.new(0, 5),
      AgeRange.new(6, 11),
      AgeRange.new(12, 17),
      AgeRange.new(18, AgeRange::MAX)
    ]
  end

  def self.createUnhcrSet
    ranges = [ AgeRange.new(0, 4),
      AgeRange.new(5, 11),
      AgeRange.new(12, 17),
      AgeRange.new(18, 59),
      AgeRange.new(60, AgeRange::MAX)
    ]
  end

end
