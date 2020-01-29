module Api::V2
  class KeyPerformanceIndicatorsController < ApplicationApiController
    # This is only temporary to avoid double render errors while developing.
    # I looks like this method wouldn't make sense for the audit log to
    # write given that 'write_audit_log' required a record type, id etc.
    # This response doesn't utilize any type of record yet and so cannot
    # provide this information.
    skip_after_action :write_audit_log

    def indexed_field_name(type, field_name)
      # TODO: Check if there can be duplicate field names
      Sunspot::Setup.for(type).
        all_field_factories.
        map(&:build).
        select { |field| field.name == field_name }.
        map { |field| field.indexed_name }.
        first
    end

    def number_of_cases
      # TODO: Move these to helpers (Should we use ruby dates?)
      # TODO: Add these to permitted params
      from = params[:from]
      to = params[:to]

      created_at = indexed_field_name(Child, :created_at)
      owned_by_location = indexed_field_name(Child, :owned_by_location)

      search = Child.search do
        adjust_solr_params do |params|
          params['facet'] = true

          params['facet.range'] = "{!tag=per_month}#{created_at}"
          params['facet.range.start'] = from
          params['facet.range.end'] = to
          params['facet.range.gap'] = '+1MONTH'
          params["f.#{created_at}.facet.mincount"] = -1

          params['facet.pivot'] = "{!range=per_month}#{owned_by_location}"
          params['facet.pivot.mincount'] = -1
        end
        paginate page: 1, per_page: 0
      end

      @columns = search.facet_response['facet_ranges'][created_at]['counts'].
        select { |result| result.is_a?(String) }

      @data = (search.
              facet_response['facet_pivot'][owned_by_location].
              map do |pivot|
                location = Location.
                  find_by({ location_code: pivot['value'].upcase }).
                  placename
                counts = pivot['ranges'][created_at]['counts'].
                  each_slice(2).
                  to_h

                # How to we translate this name?
                { reporting_site: location }.merge(counts)
              end.to_a)
    end

    def number_of_incidents
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
  end
end
