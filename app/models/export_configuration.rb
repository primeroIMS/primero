class ExportConfiguration < CouchRest::Model::Base
  use_database :export_configuration

  include PrimeroModel
  include Memoizable
  include LocalizableProperty

  localize_properties [:name]
  property :export_id
  property :property_keys, :type => [String]

  design do
    view :all
  end
end