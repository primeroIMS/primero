class SavedSearch < CouchRest::Model::Base
  use_database :saved_search
  include PrimeroModel

  property :name
  property :module_id
  property :record_type
  property :filters, [SearchValue]
  property :user_id
  property :unique_id

  design do
    view :by_user_id
    view :by_unique_id
  end

  def initialize *args
    super

    self.unique_id ||= UUIDTools::UUID.random_create.to_s
  end

  def add_filter(name, filter)
    filter = SearchValue.new(name: name, value: filter)
    self.filters << filter
  end

  class << self
    def by_user(user_id)
      self.by_user_id(key: user_id).all
    end

    def by_id(id)
      self.by_unique_id(key: id).all
    end
  end
end