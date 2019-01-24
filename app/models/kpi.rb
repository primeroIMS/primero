class Kpi < CouchRest::Model::Base
	include Record

  INTRODUCTION_AND_ENGAGEMENT_TYPE = {
		name: 'introduction_and_engagement',
    calculations: ['rate_of_report', 'elapsed_time_for_incident_and_report', 'average_delay_of_access'],
    days_ranges: [
      [0, 3],
      [4, 5],
      [6, 14],
      [15, 30],
      [31, 92]
    ]
  }

	ASSESSMENT_TYPE = {
		name: 'assessment',
		calculations: ['completed_asssessment', 'approved_assessment']
	}	
	
  CASE_ACTION_PLANNING_TYPE = {
		name: 'case_action_planning',
    calculations: ['needed_safety_plan', 'completed_case_action_plan', 'approved_case_action_plan']
  }

  IMPLEMENT_THE_CASE_ACTION_PLAN_TYPE = {
		name: 'implement_the_case_action_plan',
		calculations: ['services_provided']
	}

	CASE_FOLLOW_UP_TYPE = {
		name: 'case_follow_up',
		calculations: ['follow_up_meetings', 'average_follow_up_meetings']
	}

  CASE_CLOSURE_TYPE = {
		name: 'case_closure',
    calculations: [
      'elapsed_time_from_opening_to_closure',
      'elapsed_time_from_opening_to_closure_hight_risk',
      'reason_for_case_closure',
      'case_closure_rate'
    ],
    days_ranges: [
      [0, 30],
      [31, 92],
      [93, 185],
    ]
  }

  CLIENT_SATISFACTION_TYPE = {
		name: 'client_satisfaction',
    calculations: ['client_satisfaction']
  }

	OTHER_TYPE = {
		name: 'other_kpi',
		calculations: [
			'case_load',
			'supervisor_to_case_worker_ratio',
			'caseworkers_active_on_gbvims_plus'
		],
	}

	TYPES = [
    INTRODUCTION_AND_ENGAGEMENT_TYPE,
  	ASSESSMENT_TYPE,
  	CASE_ACTION_PLANNING_TYPE,
		IMPLEMENT_THE_CASE_ACTION_PLAN_TYPE,
		CASE_FOLLOW_UP_TYPE,
    CASE_CLOSURE_TYPE,
    CLIENT_SATISFACTION_TYPE,
    OTHER_TYPE,
	]

	NEEDED_DATE_RANGE = ['follow_up_meetings']

  def self.minimum_reportable_fields
    {
      'string' => [
				INTRODUCTION_AND_ENGAGEMENT_TYPE[:name],
				ASSESSMENT_TYPE[:name],
				CASE_ACTION_PLANNING_TYPE[:name],
				IMPLEMENT_THE_CASE_ACTION_PLAN_TYPE[:name],
				CASE_FOLLOW_UP_TYPE[:name],
				CASE_CLOSURE_TYPE[:name],
				CLIENT_SATISFACTION_TYPE[:name],
				OTHER_TYPE[:name],
      ]
    }
  end

  def self.get_default_range_from(range)
    range.each_with_object({}) do |(from, to), default|
      default["#{from}-#{to}"] = 0
    end
  end

  def self.to_percent value
    "#{(value.to_f * 100).ceil(3)}%"
  end

  def self.format_result_for_reduced_view(view_result, range = [])
    view_result.rows.each_with_object(get_default_range_from range) do |row, result|
      result[row.key] = row.value
    end
  end

  def self.format_percents_from_rows(rows)
    rows
      .map {|key, result| [key, result.to_f / rows['_count'].to_f]} 
      .to_h
      .except '_count'
  end

	def self.get_all_open_cases_count
		all_active_cases_search = Child.search do
			with :child_status, Record::STATUS_OPEN
		end
		all_active_cases_search.total || 1
	end

	def self.generate_kpi(types, date_range)
    kpi_calculation_results = Parallel.map(types, in_threads: types.length) do |kpi_type| 
      [kpi_type, send(kpi_type, date_range)]
    end
    kpi_calculation_results.each_with_object({}) do |(kpi_type, calculation_result), kpi| 
      group = TYPES.detect {|e| e[:calculations].include?(kpi_type) }
      kpi[group[:name]] ||= {};
      kpi[group[:name]][kpi_type] = calculation_result
    end
	end

  def self.rate_of_report(date_range)
    first_past_month_rate = Child.search do 
      with(:registration_date).between(
        Date.today.at_beginning_of_month.prev_month..Date.today.end_of_month.prev_month
      )
    end
    second_past_month_rate = Child.search do 
      with(:registration_date).between(
        Date.today.at_beginning_of_month.prev_month.prev_month..Date.today.end_of_month.prev_month.prev_month
      )
    end
    { 
      first_month: first_past_month_rate.total, 
      second_month: second_past_month_rate.total
    }
  end

  def self.elapsed_time_for_incident_and_report(date_range)
    format_result_for_reduced_view(
      Incident.by_days_between_incident_and_report.reduce.group_level(1),
      INTRODUCTION_AND_ENGAGEMENT_TYPE[:days_ranges]
    )
  end

  def self.average_delay_of_access(date_range)
    format_result_for_reduced_view(
      Incident.by_days_between_report_and_service.reduce.group_level(1),
      INTRODUCTION_AND_ENGAGEMENT_TYPE[:days_ranges]
    )
  end

	def self.completed_asssessment(date_range)
		active_cases_count = get_all_open_cases_count
		completed_asssessment_cases = Child.search do
			with :child_status, Record::STATUS_OPEN
			without :assessment_completion_timing, nil
		end
		completed_asssessment_cases.total.to_f / active_cases_count.to_f
	end

	def self.approved_assessment(date_range)
		active_cases_count = get_all_open_cases_count
		approved_asssessment_cases = Child.search do
			with :child_status, Record::STATUS_OPEN
			with :bia_approved, true
			without :assessment_completion_timing, nil
		end
		approved_asssessment_cases.total.to_f / active_cases_count.to_f
	end

  def self.needed_safety_plan(date_range)
		active_cases_count = get_all_open_cases_count
    cases_with_needed_and_completed_safety_plan = Child.search do
			with :child_status, Record::STATUS_OPEN
      with :safety_plan_needed, true
      without :safety_plan_completion_timing, nil
    end
    cases_with_needed_and_completed_safety_plan.total.to_f / active_cases_count.to_f
  end

  def self.completed_case_action_plan(date_range)
		active_cases_count = get_all_open_cases_count
    cases_with_filled_action_plan = Child.search do
			with :child_status, Record::STATUS_OPEN
      without :action_plan_section, nil
    end
    cases_with_filled_action_plan.total.to_f / active_cases_count.to_f
  end

  def self.approved_case_action_plan(date_range)
		active_cases_count = get_all_open_cases_count
    approved_cases_with_filled_action_plan = Child.search do
			with :child_status, Record::STATUS_OPEN
			with :case_plan_approved, true
      without :action_plan_section, nil
    end
    approved_cases_with_filled_action_plan.total.to_f / active_cases_count.to_f
  end

  def self.services_provided(date_range)
    format_result_for_reduced_view(
      Child.by_service_provided.reduce.group_level(1),
    )
  end

	def self.follow_up_meetings((from, to))
		period = Date.parse(from)..Date.parse(to)
    Child.by_followup_date(keys: period.to_a).all.count;
	end

	def self.average_follow_up_meetings(date_range)
		all_active_cases_count = get_all_open_cases_count
		all_followups = Child.by_followup_date.all;
		all_followups.count.to_f / all_active_cases_count.to_f
	end

  def self.elapsed_time_from_opening_to_closure(date_range)
   format_percents_from_rows( 
      format_result_for_reduced_view(
        Child.by_days_between_case_opening_and_closure.reduce.group_level(1),
        CASE_CLOSURE_TYPE[:days_ranges]
      )
    )
  end

  def self.elapsed_time_from_opening_to_closure_hight_risk(date_range)
    format_percents_from_rows( 
      format_result_for_reduced_view(
        Child.by_days_between_case_opening_and_closure_high_risk.reduce.group_level(1),
        CASE_CLOSURE_TYPE[:days_ranges]
      )
    )
  end

  def self.case_closure_rate(date_range)
    cases_closed_past_month = Child.search do
      with(:date_closure).between(
        Date.today.at_beginning_of_month.prev_month..Date.today.end_of_month.prev_month
      )
    end
    cases_closed_past_month.total
  end

  def self.reason_for_case_closure(date_range)
    format_percents_from_rows( 
      format_result_for_reduced_view(
        Child.by_closure_reason.reduce.group_level(1)
      )
    )
  end

  def self.client_satisfaction(date_range)
    active_cases_count = get_all_open_cases_count
    cases_with_satisfied_survivor = Child.client_statisfied.count
    cases_with_satisfied_survivor.to_f / active_cases_count.to_f
  end

	def self.case_load(date_range)
		total_active_cases_per_owner = Child.search do
			with :child_status, Record::STATUS_OPEN
			facet :owned_by
		end
    statistic = total_active_cases_per_owner.facet(:owned_by).rows.each_with_object({}) do |row, res|
      case row.count
      when 1..10
        res['10'] = res['10'].to_i + 1 
      when 11..20
        res['20'] = res['20'].to_i + 1 
      when 21..30
        res['30'] = res['30'].to_i + 1 
      else
        res['other'] = res['other'].to_i + 1 
      end
      res['_count'] = res['_count'].to_i + 1
    end
    format_percents_from_rows(statistic)
	end

	def self.supervisor_to_case_worker_ratio(date_range)
	  roles_search = User.by_enabled_user_group_and_roles.reduce.group_level(2).rows
    group_roles = roles_search.each_with_object({}) do |row, res|
      res[row.key[1]] ||= {}
      res[row.key[1]][row.key[0]] = row.value
    end
    supervisor_to_case_worker = group_roles.each_with_object({ 'lt'=>0, 'gte'=>0, '_count'=>1 }) do |(_, group), res|
      if (group['role-gbv-caseworker'] || group['role-gbv-social-worker']) && group['role-gbv-case-management-supervisor']
        caseworkers_in_group_count = group['role-gbv-caseworker'].to_i + group['role-gbv-social-worker'].to_i;
        supervisor_to_case_worker_in_group = caseworkers_in_group_count.to_f / group['role-gbv-case-management-supervisor'].to_f
        type = supervisor_to_case_worker_in_group < 5 ? 'lt' : 'gte'
        res[type] = res[type].to_i + 1
        res['_count'] = res['_count'].to_i + 1
      end
    end
    format_percents_from_rows(supervisor_to_case_worker)
	end

	def self.caseworkers_active_on_gbvims_plus(date_range)
		active_caseworkers_usernames = User.by_enabled_roles(keys: ['role-gbv-caseworker', 'role-gbv-social-worker']).all.map{|row|row['user_name']}
    LoginActivity.loggined_by_past_two_weeks(keys: active_caseworkers_usernames, group: true).reduce.rows.length
	end
end
