module Indexable
  extend ActiveSupport::Concern

  #TODO: Refactor the Flag model and the Searchable concern to use this concern

  included do
    include Sunspot::Rails::Searchable

    Sunspot::Adapters::InstanceAdapter.register DocumentInstanceAccessor, self
    Sunspot::Adapters::DataAccessor.register DocumentDataAccessor, self
  end


end