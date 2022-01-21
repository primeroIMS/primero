# frozen_string_literal: true

# Describes Killing subreport in Primero.
class ManagedReports::Violations::Killing < ValueObject
  def id
    'killing'
  end

  def search
    ActiveRecord::Base.connection.execute(
      ActiveRecord::Base.sanitize_sql_array([])
    )
  end

  def to_json(*_args)
    { id => search.to_a&.first }
  end

  def data
    to_json(filters)
  end
end
