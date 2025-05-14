class SearchFilters::TransitionValue < SearchFilters::Value
  def query(record_class)
    ActiveRecord::Base.sanitize_sql_for_conditions(
      [
        # %(EXISTS (SELECT 1 = 1)),
        %(
        EXISTS (
          SELECT 1
          FROM transitions as transitions
          WHERE transitions.type = :transition_type
          AND #{record_class.table_name}.id::varchar = transitions.record_id
          AND transitions.transitioned_to = :value
        )
        ),
        { transition_type: field_name, record_class:, value: }
      ]
    )
  end
end

# AND id = transitions.record_id
