class SavedSearch < CouchRest::Model::Base
  use_database :saved_search
  include PrimeroModel

  property :name
  property :module_id
  property :record_type
  property :filters, [SearchValue]
  property :user_name

  design

  design :by_user_name do
    view :by_user_name
  end

  design :by_user_name_and_record_type do
    view :by_user_name_and_record_type
  end

  def add_filter(name, filter)
    filter = SearchValue.new(name: name, value: filter)
    self.filters << filter
  end
end