# frozen_string_literal: true

# CaseClosureRate Search
#
# Looks at how many cases were closed in a given range of months for
# each location in which a case was closed within that range of months.
class Kpi::CaseClosureRate < Kpi::PivotedRangeSearch
  search_model Child
  pivot_field :owned_by_location
  range_field :date_closure

  def search
    super do |search|
      search.with :owned_by_agency_id, owned_by_agency_id
      search.with :date_closure, from..to
    end
  end

  def to_json(*_args)
    {
      dates: columns,
      data: data
    }
  end
end
