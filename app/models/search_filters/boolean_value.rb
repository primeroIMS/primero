# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Transform a boolean query parameter field_name=false into a sql query
class SearchFilters::BooleanValue < SearchFilters::Value
  def json_path_query
    return super if value

    "(#{super} OR #{ActiveRecord::Base.sanitize_sql_for_conditions(['(data->>? IS NULL)', field_name])})"
  end

  def json_path_predicate
    ActiveRecord::Base.sanitize_sql_for_conditions(['@ == %s || @ == "%s"', value, value])
  end
end
