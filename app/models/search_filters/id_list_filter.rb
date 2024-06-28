# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform API query parameter id=value1,value1 into a sql query
class SearchFilters::IdListFilter < SearchFilters::ValueList
  def query
    ActiveRecord::Base.sanitize_sql_for_conditions(['id IN (:values)', { values: }])
  end
end
