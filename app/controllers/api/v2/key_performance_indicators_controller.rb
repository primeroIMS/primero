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
          params[:stats] = true
          params[:'stats.field'] = "{!func}termfreq(#{action_plan_referral_statuses}, #{referred})"
        end
      end

      @average_referrals = search.stats_response.first.last['mean']
    end

    def referrals_per_service
    end

    def average_followup_meetings_per_case
      search = Child.search do
        with :status, Record::STATUS_OPEN
        with :created_at, from..to

        stats :number_of_meetings
      end

      @average_meetings = search.stats(:number_of_meetings).mean || 0
    end

    def goal_progress_per_need
      search = Child.search do
        with :status, Record::STATUS_OPEN
        with :created_at, from..to

        stats :safety_goals_progress,
          :health_goals_progress,
          :psychosocial_goals_progress,
          :justice_goals_progress,
          :other_goals_progress
      end

      # TODO: Translate these needs / goals
      @data = [
        {
          need: I18n.t('key_performance_indicators.goal_progress_per_need.safety'),
          percentage: search.stats(:safety_goals_progress).mean || 0
        },
        {
          need: I18n.t('key_performance_indicators.goal_progress_per_need.health'),
          percentage: search.stats(:health_goals_progress).mean || 0
        },
        {
          need: I18n.t('key_performance_indicators.goal_progress_per_need.psychosocial'),
          percentage: search.stats(:psychosocial_goals_progress).mean || 0
        },
        {
          need: I18n.t('key_performance_indicators.goal_progress_per_need.justice'),
          percentage: search.stats(:justice_goals_progress).mean || 0
        },
        {
          need: I18n.t('key_performance_indicators.goal_progress_per_need.other'),
          percentage: search.stats(:other_goals_progress).mean || 0
        }
      ]
    end

    def time_from_case_open_to_close
      created_at = SolrUtils.indexed_field_name(Child, :created_at)
      date_closure = SolrUtils.indexed_field_name(Child, :date_closure)

      month = 2_628_000_000

      search = Child.search do
        with :created_at, from..to
        without :duplicate, true

        adjust_solr_params do |params|
          params[:facet] = true
          params[:'facet.query'] = [
            "{!key=1-month frange u=#{month}} ms(#{date_closure},#{created_at})",
            "{!key=1-3months frange l=#{month + 1} u=#{month * 3}} ms(#{date_closure},#{created_at})",
            "{!key=3-6months frange l=#{(month * 3) + 1} u=#{month * 6}} ms(#{date_closure},#{created_at})",
            "{!key=7-months frange l=#{(month * 6) + 1}} ms(#{date_closure},#{created_at})"
          ]
        end
      end

      @total = search.total
      @results = search.facet_response['facet_queries']
    end

    def case_closure_rate
      search = Child.search do
        facet :date_closure,
          tag: :per_month,
          range: from..to,
          range_interval: '+1MONTH',
          minimum_count: -1

        pivot :owned_by_location,
          range: :per_month

        paginate page: 1, per_page: 0
      end

      @columns = search.facet(:date_closure).rows.
        map { |result| result.value.first.to_datetime.utc.iso8601(0) }

      @data = search.pivot(:owned_by_location).rows.
        map do |row|
          # use instance to get this?
          location = Location.
            find_by({ location_code: row.result['value'].upcase }).
            placename

          counts = row.range(:date_closure).counts

          { reporting_site: location }.merge(counts)
        end
    end

    def client_satisfaction_rate
      search = Child.search do
        with :created_at, from..to

        any_of do
          with :satisfaction_status, 'satisfied'
          with :satisfaction_status, 'unsatisfied'
        end

        facet :satisfaction_status, only: 'satisfied'
      end

      @satisfaction_rate = nan_safe_divide(
        search.facet(:satisfaction_status).rows.first&.count || 0,
        search.total
      )
    end

    def supervisor_to_caseworker_ratio
      case_worker_roles = [
        "role-gbv-mobile-caseworker",
        "role-gbv-caseworker"
      ]
      supervisor_roles = [
        'role-gbv-case-management-supervisor' 
      ]

      search = User.search do
        facet :role
      end

      supervisors = search.facet(:role).rows.
        select { |row| supervisor_roles.include?(row.value) }.
        map(&:count).
        sum

      case_workers = search.facet(:role).rows.
        select { |row| case_worker_roles.include?(row.value) }.
        map(&:count).
        sum

      ratio = (supervisors / case_workers).rationalize

      @supervisors = ratio.numerator
      @case_workers = ratio.denominator
    end

    def case_load
      search = Child.search do
        with :created_at, from..to

        facet :owned_by
      end

      owners = search.facet(:owned_by).rows

      @results = [{
        case_load: '10cases', # '<10 open cases',
        percent: nan_safe_divide(
          owners.select { |owner| owner.count < 10 }.count,
          owners.count
        )
      },{
        case_load: '20cases', # '<20 open cases',
        percent: nan_safe_divide(
          owners.select { |owner| owner.count < 20 }.count,
          owners.count
        )
      },{
        case_load: '21-30cases', # '21-30 open cases',
        percent: nan_safe_divide(
          owners.select { |owner| 21 < owner.count && owner.count <= 30 }.count,
          owners.count
        )
      },{
        case_load: '30cases', # '>30 open cases',
        percent: nan_safe_divide(
          owners.select { |owner| owner.count > 30 }.count,
          owners.count
        )
      }]
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
