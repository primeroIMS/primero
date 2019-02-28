module Indexable
  extend ActiveSupport::Concern

  included do
    include Sunspot::Rails::Searchable
  end

  module ClassMethods
    # Do not index objects in production
    # In production, objects are indexed by the CouchWatcher
    def auto_index?
      Rails.env != 'production'
    end

    #Sunspot expects this to be an active record object. So we are tricking it.
    def before_save(_) ; end
    def after_save(_,__) ; end
    def after_destroy(_,__) ; end
  end

end