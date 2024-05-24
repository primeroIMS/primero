# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# NumberOfIncidents Search
#
# Looks for the number of incidents reported in a given location over
# a range of months.
class Kpi::NumberOfIncidents < Kpi::PivotedRangeSearch
  search_model Incident
  range_field :date_of_first_report
  pivot_field :owned_by_location

  def to_json(*_args)
    { dates: columns, data: }
  end
end
