class HighlightInformation
  include CouchRest::Model::CastedModel

  property :order, String, default: ''
  property :highlighted, TrueClass, :default => false

end
