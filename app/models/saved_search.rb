class SavedSearch < CouchRest::Model::Base
  use_database :saved_search
  include PrimeroModel

  property :name
  property :module_id
  property :record_type
  property :filters, [SearchValue]
  property :user_name

  design do
    view :by_user_name
    view :by_unique_id
  end

  def add_filter(name, filter)
    filter = SearchValue.new(name: name, value: filter)
    self.filters << filter
  end
end