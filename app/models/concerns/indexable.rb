module Indexable
  extend ActiveSupport::Concern

  included do
    include Sunspot::Rails::Searchable
    Sunspot::Adapters::InstanceAdapter.register Sunspot::Rails::Adapters::ActiveRecordInstanceAdapter, self
  end

end