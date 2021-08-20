# frozen_string_literal: true

# ServicesProvided
# A Kpi to count how many of each type of service has been provided by an
# agency.
class Kpi::ServicesProvided < Kpi::Search
  def search
    @search ||= Child.search do
      with :created_at, from..to
      with :owned_by_groups, owned_by_groups
      with :owned_by_agency_id, owned_by_agency_id

      facet :services_provided
    end
  end

  def data
    @data ||= search.facet(:services_provided).rows.map do |row|
      {
        service: Lookup.display_value('lookup-gbv-service-type', row.value),
        count: row.count
      }
    end
  end

  def to_json(*_args)
    { data: { services_provided: data } }
  end
end
