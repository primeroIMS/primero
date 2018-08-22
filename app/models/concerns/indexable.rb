module Indexable
  extend ActiveSupport::Concern

  included do
    include Sunspot::Rails::Searchable

    Sunspot::Adapters::InstanceAdapter.register DocumentInstanceAccessor, self
    Sunspot::Adapters::DataAccessor.register DocumentDataAccessor, self
  end

  module ClassMethods
    # Do not index objects in production
    # In production, objects are indexed by the CouchWatcher
    def auto_index?
      Rails.env != 'production'
    end
  end

end