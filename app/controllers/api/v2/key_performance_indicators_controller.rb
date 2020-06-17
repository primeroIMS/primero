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
      date_of_first_report = SolrUtils.indexed_field_name(Incident, :date_of_first_report)
      incident_date_derived = SolrUtils.indexed_field_name(Incident, :incident_date_derived)

      days3 = 3 * 24 * 60 * 60 * 1000
      days5 = 5 * 24 * 60 * 60 * 1000
      days14 = 14 * 24 * 60 * 60 * 1000
      days30 = 30 * 24 * 60 * 60 * 1000
      months3 = 30.4167 * 24 * 60 * 60 * 1000

      # For the purposes of this query 1 month is 30.4167 days or
      # 30.4167 * 24 * 60 * 60 * 1000 milliseconds
      search = Incident.search do
        with :date_of_first_report, from..to

        adjust_solr_params do |params|
          params[:'facet'] = true
          params[:'facet.query'] = [
            "{!key=0-3days frange u=#{days3}} ms(#{date_of_first_report},#{incident_date_derived})",
            "{!key=4-5days frange l=#{days3 + 1} u=#{days5}} ms(#{date_of_first_report},#{incident_date_derived})",
            "{!key=6-14days frange l=#{days5 + 1} u=#{days14}} ms(#{date_of_first_report},#{incident_date_derived})",
            "{!key=15-30days frange l=#{days14 + 1} u=#{days30}} ms(#{date_of_first_report},#{incident_date_derived})",
            "{!key=1-3months frange l=#{days30 + 1} u=#{months3}} ms(#{date_of_first_report},#{incident_date_derived})",
            "{!key=4months frange l=#{months3 + 1}} ms(#{date_of_first_report},#{incident_date_derived})"
          ]
        end
      end

      @total = search.total
      @results = search.facet_response['facet_queries']
    end

    def service_access_delay
      # On hold until new forms UI / system is complete
    end

    def assessment_status
      search = Child.search do
        with :status, Record::STATUS_OPEN
        with :created_at, from..to

        facet :completed_survivor_assessment, only: true
      end

      number_of_cases = search.total
      number_of_cases_with_completed_assessments = search.
        facet(:completed_survivor_assessment).rows.count

      @completed_percentage = nan_safe_divide(
        number_of_cases_with_completed_assessments,
        number_of_cases
      )
    end
    
    def completed_case_safety_plans
      search = Child.search do
        with :status, Record::STATUS_OPEN
        with :created_at, from..to
        with :safety_plan_required, true

        facet :completed_safety_plan, only: true
      end

      requiring_safety_plan = search.total
      with_completed_safety_plans = search.
        facet(:completed_safety_plan).rows.count

      @completed_percentage = nan_safe_divide(
        with_completed_safety_plans,
        requiring_safety_plan
      )
    end

    def completed_case_action_plans
      search = Child.search do
        with :status, Record::STATUS_OPEN
        with :created_at, from..to

        facet :completed_action_plan, only: true
      end

      active_cases = search.total
      with_completed_action_plans = search.
        facet(:completed_action_plan).rows.first.count

      @completed_percentage = nan_safe_divide(
        with_completed_action_plans,
        active_cases
      )
    end

    def completed_supervisor_approved_case_action_plans
      completed_action_plan = SolrUtils.indexed_field_name(Child, :completed_action_plan)
      case_plan_approved = SolrUtils.indexed_field_name(Child, :case_plan_approved)

      search = Child.search do
        with :status, Record::STATUS_OPEN
        with :created_at, from..to

        # This seems like an obtuse way to use an in a facet query
        adjust_solr_params do |params|
          params[:facet] = true
          params[:'facet.query'] = "{! key=completed_and_approved } #{completed_action_plan}:true AND #{case_plan_approved}:true"
        end
      end

      active_cases = search.total
      completed_and_approved = search.
        facet_response['facet_queries']['completed_and_approved']

      @completed_and_approved_percentage = nan_safe_divide(
        completed_and_approved,
        active_cases
      )
    end

    def services_provided
      search = Child.search do
        with :created_at, from..to

        facet :services_provided
      end

      @services = search.facet(:services_provided).
        rows.
        map  do |row| 
          {
            service: Lookup.display_value('lookup-service-type', row.value),
            count: row.count
          }
        end
    end
    
    def average_referrals
      action_plan_referral_statuses = SolrUtils.indexed_field_name(Child, :action_plan_referral_statuses)
      referred = 'Referred'

      search = Child.search do
        with :created_at, from..to

        adjust_solr_params do |params|
          params[:'fl'] = "referrals:termfreq(#{action_plan_referral_statuses}, #{referred})"
        end
      end

      all_cases = search.total
      # Sunspot doesn't handle custom named fields in field lists so I have
      # to do some monkey patching.
      all_referrals = search.
        instance_variable_get(:@solr_result)['response']['docs'].
        map { |doc| doc['referrals'] }.
        reduce(&:+)

      @average_referrals = nan_safe_divide(
        all_referrals,
        all_cases
      )
    end

    private

    # TODO: Add these to permitted params
    def from
      params[:from]
    end

    def to
      params[:to]
    end

    # This handles cases where 0% of something exists as in normal
    # ruby floating point math that is 0 / total which is Float::NaN
    # where we are looking for 0.
    def nan_safe_divide(numerator, denominator)
      return 0 if numerator == 0
      numerator / denominator.to_f
    end
  end
end
