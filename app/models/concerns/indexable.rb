module Indexable
  extend ActiveSupport::Concern

  included do
    include Sunspot::Rails::Searchable

    after_save :queue_for_index

    def index_for_search
      Sunspot.index!(self)
    end

    def queue_for_index
      SunspotIndexJob.perform_later(self.class.name, self.id)
    end
  end

  module ClassMethods
    # Do not index objects in production
    # In production, objects are indexed by the CouchWatcher
    def auto_index?
      Rails.env != 'production'
    end
  end


end