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
    view :by_user_id,
      :map => "function(doc) {
        if (doc['couchrest-type'] == 'SavedSearch') {
          if (!doc.hasOwnProperty('duplicate') || !doc['duplicate']) {
            emit(doc['user_id'], null);
          }
        }
      }"

    view :by_unique_id,
      :map => "function(doc) {
        if (doc['couchrest-type'] == 'SavedSearch') {
          if (!doc.hasOwnProperty('duplicate') || !doc['duplicate']) {
            emit(doc['unique_id'], null);
          }
        }
      }"
  end

  def initialize *args
    super

    self.unique_id ||= UUIDTools::UUID.random_create.to_s
  end

  def self.by_user(user_id)
    self.by_user_id(:user_id => user_id).all
  end

  def self.by_id(id)
    self.by_unique_id(:unique_id => id).all
  end

  def add_filter(name, filter)
    filter = SearchValue.new(name: name, value: filter)
    self.filters << filter
  end
end