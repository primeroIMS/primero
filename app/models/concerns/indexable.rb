# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Include this concern for any model that will be searchable via Sunspot/Solr
module Indexable
  extend ActiveSupport::Concern

  included do
    include Sunspot::Rails::Searchable
    Sunspot::Adapters::InstanceAdapter.register Sunspot::Rails::Adapters::ActiveRecordInstanceAdapter, self
  end
end
