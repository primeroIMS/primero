# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Abstract superclass of all Postgres-persisted records
class ApplicationRecord < ActiveRecord::Base
  self.abstract_class = true

  def self.api_path
    "/api/v2/#{name.pluralize.underscore}"
  end

  def api_path
    "#{self.class.api_path}/#{id}"
  end
end
