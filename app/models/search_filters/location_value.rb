# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform API query parameter loc:field_name=value into a sql query
class SearchFilters::LocationValue < SearchFilters::Value
  include SearchFilters::Location
end
