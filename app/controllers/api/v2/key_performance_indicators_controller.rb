module Api::V2
  class KeyPerformanceIndicatorsController < ApplicationApiController
    # This is only temporary to avoid double render errors while developing.
    # I looks like this method wouldn't make sense for the audit log to
    # write given that 'write_audit_log' required a record type, id etc.
    # This response doesn't utilize any type of record yet and so cannot
    # provide this information.
    skip_after_action :write_audit_log

    def number_of_cases
      search = Child.search do
        facet :created_at,
          tag: :per_month,
          range: from..to,
          range_interval: '+1MONTH',
          minimum_count: -1

        pivot :owned_by_location,
          range: :per_month,
          minimum_count: -1

        paginate page: 1, per_page: 0
      end

      @columns = search.facet(:created_at).rows.
        map { |result| result.value.first.iso8601(0) }

      @data = search.pivot(:owned_by_location).rows.
        map do |row|
          # use instance to get this?
          location = Location.
            find_by({ location_code: row.result['value'].upcase }).
            placename

          counts = row.range(:created_at).counts

          { reporting_site: location }.merge(counts)
        end
    end

    def number_of_incidents
      search = Incident.search do
        facet :created_at,
          tag: :per_month,
          range: from..to,
          range_interval: '+1MONTH',
          minimum_count: -1

        pivot :owned_by_location,
          range: :per_month

        paginate page: 1, per_page: 0
      end

      @columns = search.facet(:created_at).rows.
        map { |result| result.value.first.iso8601(0) }

      @data = search.pivot(:owned_by_location).rows.
        map do |row|
          # use instance to get this?
          location = Location.
            find_by({ location_code: row.result['value'].upcase }).
            placename

          counts = row.range(:created_at).counts

          { reporting_site: location }.merge(counts)
        end
    end

    def reporting_delay
    end

    def service_access_delay
    end

    def assessment_status
    end
    
    def completed_case_safety_plans
    end

    def completed_case_action_plans
    end

    def completed_supervisor_approved_case_action_plans
    end

    def services_provided
    end

    private

    # TODO: Add these to permitted params
    def from
      params[:from]
    end

    def to
      params[:to]
    end
  end
end
