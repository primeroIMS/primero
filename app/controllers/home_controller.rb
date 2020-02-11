class HomeController < ApplicationController
  ALL_FILTER = "all"

  skip_before_action :authenticate_user!, only: %w{v2}, raise: false

  before_action :load_default_settings, :only => [:index]
  before_action :can_access_approvals, :only => [:index]
  before_action :load_risk_levels, :only => [:index]

  # TODO: This is temp action for v2 home page
  def v2
  end

  def index
    @page_name = t("home.label")
    @associated_users = current_user.managed_user_names

    load_user_module_data

    if !display_admin_only?
      #TODO - Refactor to reduce number of solr queries
      load_cases_information if display_cases_dashboard?

      @service_response_types = Lookup.values_for_select('lookup-service-response-type')
      @service_stats_near = load_case_service_information('near') if display_cases_dashboard?
      @service_stats_overdue = load_case_service_information('overdue') if display_cases_dashboard?
      @service_stats_totals = load_case_service_information if display_cases_dashboard?

      load_incidents_information if display_incidents_dashboard?
      load_manager_information if display_manager_dashboard?
      load_gbv_incidents_information if display_gbv_incidents_dashboard?
      load_match_result if display_matching_results_dashboard?
      load_admin_information if display_admin_dashboard? | display_reporting_location? | display_protection_concerns?
      #TODO: All this needs to be heavily refactored


      display_case_worker_dashboard?
      display_approvals?
      display_response?
      display_assessment?
      display_service_provisions?
      display_cases_to_assign?
      display_cases_by_workflow?
      display_cases_by_task_overdue?
      display_referrals_by_socal_worker?
      display_cases_by_socal_worker?
      display_transfers_by_socal_worker?
    end
  end

  private

  def load_risk_levels
    if !display_admin_only?
      @risk_levels = Lookup.values_for_select('lookup-risk-level').map{|h,v| v}
      @risk_levels << Child::RISK_LEVEL_NONE if can?(:dash_show_none_values, Dashboard)
      @risk_levels
    end
  end

  # TODO: This will be later configurable
  def time_to_assign_for_risk_level(risk_level)
    case risk_level
    when Child::RISK_LEVEL_HIGH
      1.hour.from_now.to_time
    else
      3.hour.from_now.to_time
    end
  end

  def search_flags(options={})
    managed_users = options[:is_manager] ? current_user.managed_user_names : current_user.user_name
    map_flags(Flag.search{
      with(options[:field]).between(options[:criteria]) if options[:field].present? && options[:criteria].present?
      with(:flag_flagged_by, options[:flagged_by]) if options[:flagged_by].present?
      without(:flag_flagged_by, options[:without_flagged_by]) if options[:without_flagged_by].present?
      with(:flag_record_type, options[:type])
      with(:flag_record_owner, managed_users)
      with(:flag_flagged_by_module, options[:modules]) if options[:is_manager].present?
      with(:flag_is_removed, false)
      order_by(:flag_created_at, :desc)
    }.hits)
  end

  def map_flags(flags)
    flags.map{ |flag|
      {
        record_id: flag.stored(:flag_record_id),
        message: flag.stored(:flag_message),
        flagged_by: flag.stored(:flag_flagged_by),
        record_owner: flag.stored(:flag_owner),
        date: flag.stored(:flag_date),
        created_at: flag.stored(:flag_created_at),
        system_generated_follow_up: flag.stored(:flag_system_generated_follow_up),
        short_id: flag.stored(:flag_record_short_id),
        record_type: flag.stored(:flag_record_type),
        name: flag.stored(:flag_child_name),
        hidden_name: flag.stored(:flag_hidden_name),
        date_of_first_report: flag.stored(:flag_date_of_first_report),
      }
    }
  end

  def build_manager_stats(queries)
    @aggregated_case_manager_stats = {
      worker_totals: {},
      manager_totals: {},
      referred_totals: {},
      approval_types: {},
      manager_transfers: {},
      workflow_totals: {}
    }

    @workflow_order = [
      {id: Workflow::WORKFLOW_NEW, display: t("case.workflow.#{Workflow::WORKFLOW_NEW}")},
      {id: Workflow::WORKFLOW_REOPENED, display: t("case.workflow.#{Workflow::WORKFLOW_REOPENED}")}
    ]
    if @modules.present?
      if @modules.first.use_workflow_assessment
        @workflow_order << {id: Workflow::WORKFLOW_ASSESSMENT, display: t("case.workflow.#{Workflow::WORKFLOW_ASSESSMENT}")}
      end

      if @modules.first.use_workflow_case_plan
        @workflow_order << {id: Workflow::WORKFLOW_CASE_PLAN, display: t("case.workflow.#{Workflow::WORKFLOW_CASE_PLAN}")}
      end
    end
    @workflow_order << @service_response_types.map{|h,v| {id: v, display: h}}
    @workflow_order.flatten!
    managed_users = current_user.managed_user_names

    @aggregated_case_manager_stats[:cases_to_assign] = queries[:cases_to_assign]
    @aggregated_case_manager_stats[:cases_to_assign_overdue] = queries[:cases_to_assign_overdue]

    queries[:totals_by_case_worker].facet(:associated_user_names).rows.each do |c|
      if managed_users.include? c.value
        @aggregated_case_manager_stats[:worker_totals][c.value] = {}
        @aggregated_case_manager_stats[:worker_totals][c.value][:total_cases] = c.count
      end
    end

    queries[:new_by_case_worker].facet(:associated_user_names).rows.each do |c|
      if managed_users.include? c.value
        @aggregated_case_manager_stats[:worker_totals][c.value][:new_cases] = c.count
      end
    end

    queries[:manager_totals].facet(:status).rows.each do |c|
      @aggregated_case_manager_stats[:manager_totals][c.value] = c.count
    end

    queries[:referred_total].facet(:assigned_user_names).rows.each do |c|
      if managed_users.include? c.value
        @aggregated_case_manager_stats[:referred_totals][c.value] = {}
        @aggregated_case_manager_stats[:referred_totals][c.value][:total_cases] = c.count
      end
    end

    queries[:referred_new].facet(:assigned_user_names).rows.each do |c|
      if managed_users.include? c.value
        @aggregated_case_manager_stats[:referred_totals][c.value][:new_cases] = c.count
      end
    end

    queries[:transferred_by_status].facet(:transfer_status).rows.each do |c|
      statuses = [Transition::STATUS_INPROGRESS, Transition::STATUS_REJECTED]
      if statuses.include? c.value
        @aggregated_case_manager_stats[:manager_transfers][c.value] = {}
        @aggregated_case_manager_stats[:manager_transfers][c.value][:total_cases] = c.count
      end
    end

    workflow_query = queries[:case_by_workflow].facet_response['facet_pivot'].values.first

    if workflow_query.present?
      workflow_query.each do |stat|
        key = stat['value']
        if key.present? && @associated_users.include?(key)
          @aggregated_case_manager_stats[:workflow_totals][key] = {}

          if stat['pivot'].present?
            stat['pivot'].each do |p|
              pivot_key = p['value']

              if pivot_key.present? && @aggregated_case_manager_stats[:worker_totals][key].present?
                @aggregated_case_manager_stats[:workflow_totals][key]['open'] = @aggregated_case_manager_stats[:worker_totals].present? ? @aggregated_case_manager_stats[:worker_totals][key][:total_cases] : 0
                @aggregated_case_manager_stats[:workflow_totals][key][pivot_key] = p['count']
              end
            end
          end
        end
      end
    end

    @aggregated_case_manager_stats[:risk_levels] = queries[:risk_level]

    @aggregated_case_manager_stats[:approval_types] = queries[:approval_type]

    @aggregated_case_manager_stats[:transfer_awaiting] = queries[:transfer_awaiting]
    @aggregated_case_manager_stats[:transfer_status] = queries[:transfer_status]

    queries[:task_overdue].each do |stat, query|
      facet = query.facet(:associated_user_names).rows

      unless @aggregated_case_manager_stats[:task_overdue].present?
        @aggregated_case_manager_stats[:task_overdue] = {}
      end

      facet.each do |c|
        if c.count > 0
          unless @aggregated_case_manager_stats[:task_overdue][c.value].present?
            @aggregated_case_manager_stats[:task_overdue][c.value] = {}
          end

          @aggregated_case_manager_stats[:task_overdue][c.value][stat] = c.count
        end
      end
    end

    # flags.select{|d| (Date.today..1.week.from_now.utc).cover?(d[:date])}
    #      .group_by{|g| g[:flagged_by]}
    #      .each do |g, fz|
    #         if @aggregated_case_worker_stats[g].present?
    #           @aggregated_case_worker_stats[g][:cases_this_week] = fz.count
    #         # else
    #         #   @aggregated_case_worker_stats[g] = {cases_this_week: f.count}
    #         end
    #       end
    #
    # flags.select{|d| (1.week.ago.utc..Date.today).cover?(d[:date])}
    #      .group_by{|g| g[:flagged_by]}
    #      .each do |g, fz|
    #         if @aggregated_case_worker_stats[g].present?
    #           @aggregated_case_worker_stats[g][:cases_overdue] = fz.count
    #         # else
    #         #   @aggregated_case_worker_stats[g] = {cases_overdue: f.count}}
    #         end
    #       end
    @aggregated_case_manager_stats
  end

  def display_admin_only?
    @display_admin_only ||= current_user.group_permission?(Permission::ADMIN_ONLY)
  end

  def display_cases_dashboard?
    @display_cases_dashboard ||= @record_types.include?("case")
  end

  def display_matching_results_dashboard?
    @display_matching_results_dashboard ||= (can?(:dash_matching_results, Dashboard) && @record_types.include?("tracing_request"))
  end

  def display_case_worker_dashboard?
    @display_case_worker_dashboard ||= !(current_user.is_manager? || current_user.admin?)
  end

  def display_manager_dashboard?
    @display_manager_dashboard ||= (current_user.is_manager? && !current_user.admin?)
  end

  def display_incidents_dashboard?
    @display_incidents_dashboard ||= @record_types.include?("incident") && @module_ids.include?(PrimeroModule::MRM)
  end

  #TODO: CP Incidents - either remove the conditional check for GBV here or create a new display_CP_incidents_dashboard
  def display_gbv_incidents_dashboard?
    @display_gbv_incidents_dashboard ||= @record_types.include?("incident") && @module_ids.include?(PrimeroModule::GBV)
  end

  def display_admin_dashboard?
    @display_admin_dashboard ||= current_user.admin?
  end

  def display_approvals?
    @display_approvals ||= can?(:view_approvals, Dashboard)
  end

  def display_response?
    @display_response ||= can?(:view_response, Dashboard)
  end

  def display_assessment?
    @display_assessment ||= can?(:view_assessment, Dashboard)
  end

  def display_reporting_location?
    @display_reporting_location ||= (can?(:dash_reporting_location, Dashboard) || current_user.admin?)
  end

  def display_protection_concerns?
    @display_protection_concerns ||= (can?(:dash_protection_concerns, Dashboard) || current_user.admin?)
  end

  def display_service_provisions?
    @display_service_provisions ||= can?(:dash_service_provisions, Dashboard)
  end

  def display_cases_to_assign?
    @display_cases_to_assign ||= can?(:dash_cases_to_assign, Dashboard)
  end

  def display_cases_by_workflow?
    @display_cases_by_workflow ||= can?(:dash_cases_by_workflow, Dashboard)
  end

  def display_cases_by_task_overdue?
    @display_cases_by_task_overdue ||= can?(:dash_cases_by_task_overdue, Dashboard)
  end

  def display_referrals_by_socal_worker?
    @display_referrals_by_socal_worker ||= can?(:dash_referrals_by_socal_worker, Dashboard)
  end

  def display_cases_by_socal_worker?
    @display_cases_by_socal_worker ||= can?(:dash_cases_by_social_worker, Dashboard)
  end

  def display_transfers_by_socal_worker?
    @display_transfers_by_socal_worker ||= can?(:dash_transfers_by_socal_worker, Dashboard)
  end

  def display_services_implemented?
    @display_services_implemented ||= PrimeroModule.cp.use_workflow_service_implemented
  end

  def display_shared_with_others?
    @display_shared_with_others ||= (can?(:dash_shared_with_others, Dashboard) || current_user.admin?)
  end

  def display_shared_with_me?
    @display_shared_with_me ||= (can?(:dash_shared_with_me, Dashboard) || current_user.admin?)
  end

  def display_group_overview
    @display_group_overview ||= (can?(:dash_group_overview, Dashboard) || current_user.admin?)
  end

  def manager_case_query(query = {})
    module_ids = @module_ids
    risk_levels = @risk_levels

    results = Child.search do
      with(:record_state, true)
      with(:associated_user_names, current_user.managed_user_names) unless query[:cases_to_assign].present?
      with(:status, query[:status]) if query[:status].present?
      with(:not_edited_by_owner, true) if query[:new_records].present?

      facet(:assigned_user_names, zeros: true) if query[:referred].present?
      with(:owned_by, current_user.user_name) if query[:cases_to_assign].present?

      with(:service_due_dates).less_than(Time.now) if query[:services_overdue].present?
      with(:assessment_due_dates).less_than(Time.now) if query[:assessment_overdue].present?
      with(:case_plan_due_dates).less_than(Time.now) if query[:case_plan_overdue].present?
      with(:followup_due_dates).less_than(Time.now) if query[:followup_overdue].present?

      if module_ids.present?
        any_of do
          module_ids.each do |m|
            with(:module_id, m)
          end
        end
      end

      if query[:cases_to_assign].present?
        facet(:cases_to_assign, zeros: true) do
          risk_levels.each do |risk_level|
            timeline = time_to_assign_for_risk_level(risk_level)

            row(risk_level.to_sym) do
              with(:risk_level, risk_level)
              with(:reassigned_tranferred_on).less_than(timeline) if query[:overdue].present?
            end
          end
        end
      end

      if query[:by_owner].present?
        facet :associated_user_names, limit: -1, zeros: true
        adjust_solr_params do |params|
          params['f.owned_by_s.facet.mincount'] = 0
        end
      end

      if query[:by_workflow].present?
        pivots = [
          'associated_user_names',
          'workflow_status'
        ]
        adjust_solr_params do |params|
          params['facet'] = 'true'
          params['facet.missing'] = 'true'
          params['facet.pivot'] = pivots.map{|p| SolrUtils.indexed_field_name('case', p)}.join(',')
          params['facet.pivot.mincount'] = '-1'
          params['facet.pivot.limit'] = '-1'
        end
      end

      facet(:status, zeros: true) if query[:by_case_status].present?

      if query[:by_risk_level].present?
        facet(:risk_level, zeros: true) do
          risk_levels.each do |risk_level|
            row(risk_level.to_sym) do
              with(:risk_level, risk_level)
              with(:not_edited_by_owner, true)
            end
            row("#{risk_level}_total".to_sym) do
              with(:risk_level, risk_level)
            end
          end
        end
      end

      if query[:by_approval_type].present?
        facet(:approval_type, zeros: true) do
          row(:bia) do
            with(:approval_status_bia, Approval::APPROVAL_STATUS_PENDING)
          end
          row(:case_plan) do
            with(:approval_status_case_plan, Approval::APPROVAL_STATUS_PENDING)
          end
          row(:closure) do
            with(:approval_status_closure, Approval::APPROVAL_STATUS_PENDING)
          end
        end
      end

      if query[:transfer_status].present?
        referred = with(:assigned_user_names, current_user.user_name)

        facet(:transfer_status, zeros: true, exclude: [referred]) do
          row(:pending) do
            with(:transfer_status, Transition::STATUS_INPROGRESS)
            with(:owned_by, current_user.user_name)
          end
          row(:rejected) do
            with(:transfer_status, Transition::STATUS_REJECTED)
            with(:owned_by, current_user.user_name)
          end
        end
      end

      if query[:transfer_awaiting].present?
        facet(:in_progress_transfers, zeros: true) do
          row(:in_progress) do
            with(:transfer_status, Transition::STATUS_INPROGRESS)
            with(:transferred_to_users, current_user.user_name)
          end
        end
      end

      facet(:transfer_status, zeros: true) if query[:transferred].present?

      paginate page: 1, per_page: 0
    end
  end

  def load_manager_information
    # module_ids = @module_ids
    # flags = search_flags({
    #   field: :flag_date,
    #   criteria: 1.week.ago.utc...1.week.from_now.utc,
    #   type: 'child',
    #   is_manager: true,
    #   modules: @module_ids
    # })
    queries = {
      totals_by_case_worker: manager_case_query({ by_owner: true, status: Record::STATUS_OPEN }),
      new_by_case_worker: manager_case_query({ by_owner: true, status: Record::STATUS_OPEN, new_records: true }),
      risk_level: manager_case_query({ by_risk_level: true, status: Record::STATUS_OPEN }),
      manager_totals: manager_case_query({ by_case_status: true}),
      referred_total: manager_case_query({ referred: true, status: Record::STATUS_OPEN }),
      referred_new: manager_case_query({ referred: true, status: Record::STATUS_OPEN, new_records: true }),
      approval_type: manager_case_query({ by_approval_type: true, status: Record::STATUS_OPEN}),
      transferred_by_status: manager_case_query({ transferred: true, by_owner: true, status: Record::STATUS_OPEN}),
      case_by_workflow: manager_case_query({ by_workflow: true, status: Record::STATUS_OPEN}),
      cases_to_assign: manager_case_query({ cases_to_assign: true, assigned: true }),
      cases_to_assign_overdue: manager_case_query({ cases_to_assign: true, assigned: true, overdue: true }),
      transfer_status: manager_case_query({ transfer_status: true }),
      transfer_awaiting: manager_case_query({ transfer_awaiting: true }),
      task_overdue: {
        assessment: manager_case_query({ by_owner: true, assessment_overdue: true}),
        case_plan: manager_case_query({ by_owner: true, case_plan_overdue: true}),
        follow_up: manager_case_query({ by_owner: true, followup_overdue: true}),
        services: manager_case_query({ by_owner: true, services_overdue: true})
      }
    }

    build_manager_stats(queries)
  end

  def load_user_module_data
    @modules = @current_user.modules
    @module_ids = @modules.map{|m| m.unique_id}
    @record_types = @modules.map{|m| m.associated_record_types}.flatten.uniq
  end

  def load_default_settings
    if @system_settings.present? && @system_settings.reporting_location_config.present?
      @admin_level ||= @system_settings.reporting_location_config.admin_level || ReportingLocation::DEFAULT_ADMIN_LEVEL
      @reporting_location ||= @system_settings.reporting_location_config.field_key || ReportingLocation::DEFAULT_FIELD_KEY
      @reporting_location_label ||= @system_settings.reporting_location_config.label_key || ReportingLocation::DEFAULT_LABEL_KEY
    else
      @admin_level ||= ReportingLocation::DEFAULT_ADMIN_LEVEL
      @reporting_location ||= ReportingLocation::DEFAULT_FIELD_KEY
      @reporting_location_label ||= ReportingLocation::DEFAULT_LABEL_KEY
    end
  end

  def can_access_approvals
    @can_approval_bia = can?(:approve_bia, Child) || can?(:request_approval_bia, Child)
    @can_approval_case_plan = can?(:approve_case_plan, Child) || can?(:request_approval_case_plan, Child)
    @can_approval_closure = can?(:approve_closure, Child) || can?(:request_approval_closure, Child)
    @can_approvals = @can_approval_bia || @can_approval_case_plan || @can_approval_closure
  end

  def load_recent_activities
    Child.list_records({}, {:last_updated_at => :desc}, {page: 1, per_page: 20}, current_user.managed_user_names)
  end

  def load_case_service_information(timeframe=nil)
    pivots = [
      'workflow_status',
      'risk_level'
    ]

    Child.search do
      with(:status, Record::STATUS_OPEN)
      with(:record_state, true)
      with(:associated_user_names, current_user.user_name)

      case timeframe
      when 'near'
        with(:service_due_dates).between(Time.now..24.hours.from_now.to_time)
      when 'overdue'
        with(:service_due_dates).less_than(Time.now)
      end

      adjust_solr_params do |params|
        params['facet'] = 'true'
        params['facet.missing'] = 'true'
        params['facet.pivot'] = pivots.map{|p| SolrUtils.indexed_field_name('case', p)}.join(',')
        params['facet.pivot.mincount'] = '-1'
        params['facet.pivot.limit'] = '-1'
      end
    end
  end

  def load_cases_information
    module_ids = @module_ids
    risk_levels = @risk_levels

    @stats = Child.search do
      # TODO: Check for valid
      with(:status, Record::STATUS_OPEN)
      with(:record_state, true)
      associated_users = with(:associated_user_names, current_user.user_name)
      referred = with(:assigned_user_names, current_user.user_name)
      if module_ids.present?
        any_of do
          module_ids.each do |m|
            with(:module_id, m)
          end
        end
      end

      if display_assessment?
        facet(:risk_level, zeros: true, exclude: [referred]) do
          risk_levels.each do |risk_level|
            row(risk_level.to_sym) do
              with(:risk_level, risk_level)
              with(:not_edited_by_owner, true)
            end
            row("#{risk_level}_total".to_sym) do
              with(:risk_level, risk_level)
            end
          end
        end
      end

      facet(:records, zeros: true, exclude: [referred]) do
        row(:new) do
          with(:not_edited_by_owner, true)
        end
        row(:total) do
          with(:status, Record::STATUS_OPEN)
        end
      end

      facet(:referred, zeros: true) do
        row(:new) do
          without(:last_updated_by, current_user.user_name)
        end
        row(:total) do
          with(:status, Record::STATUS_OPEN)
        end
      end

      facet(:approval_status_bia, zeros: true, exclude: [referred]) do
        row(:pending) do
          with(:approval_status_bia, Approval::APPROVAL_STATUS_PENDING)
        end
        row(:rejected) do
          with(:approval_status_bia, Approval::APPROVAL_STATUS_REJECTED)
        end
        row(:new) do
          bod = Time.zone.now - 10.days
          with(:approval_status_bia, Approval::APPROVAL_STATUS_APPROVED)
          with(:bia_approved_date, bod..Time.zone.now)
        end
      end

      facet(:approval_status_case_plan, zeros: true, exclude: [referred]) do
        row(:pending) do
          with(:approval_status_case_plan, Approval::APPROVAL_STATUS_PENDING)
        end
        row(:rejected) do
          with(:approval_status_case_plan, Approval::APPROVAL_STATUS_REJECTED)
        end
        row(:new) do
          bod = Time.zone.now - 10.days
          with(:approval_status_case_plan, Approval::APPROVAL_STATUS_APPROVED)
          with(:case_plan_approved_date, bod..Time.zone.now)
        end
      end

      facet(:approval_status_closure, zeros: true, exclude: [referred]) do
        row(:pending) do
          with(:approval_status_closure, Approval::APPROVAL_STATUS_PENDING)
        end
        row(:rejected) do
          with(:approval_status_closure, Approval::APPROVAL_STATUS_REJECTED)
        end
        row(:new) do
          bod = Time.zone.now - 10.days
          with(:approval_status_closure, Approval::APPROVAL_STATUS_APPROVED)
          with(:closure_approved_date, bod..Time.zone.now)
        end
      end

      facet(:transfer_status, zeros: true, exclude: [referred]) do
        row(:pending) do
          with(:transfer_status, Transition::STATUS_INPROGRESS)
          with(:owned_by, current_user.user_name)
        end
        row(:rejected) do
          with(:transfer_status, Transition::STATUS_REJECTED)
          with(:owned_by, current_user.user_name)
        end
      end

      facet(:in_progress_transfers, zeros: true) do
        row(:in_progress) do
          with(:transfer_status, Transition::STATUS_INPROGRESS)
          with(:transferred_to_users, current_user.user_name)
        end
      end

      # TODO: Just checking cp module for now. Need to refactor to handle other modules
      if display_services_implemented?
        facet(:services_implemented, zeros: true, exclude: [referred]) do
          row(:total) do
            with(:workflow, Child::WORKFLOW_SERVICE_IMPLEMENTED)
          end
        end
      end

      facet(:alerts, zeros: true, exclude: [referred]) do
        row(:new_incidents) do
          with(:current_alert_types, Child::ALERT_INCIDENT)
        end

        row(:new_services) do
          with(:current_alert_types, Child::ALERT_SERVICE)
        end
      end
    end
    show_flagged_by
  end

  def load_match_result
    @match_stats = {}
    associated_users = current_user.managed_user_names
    search = TracingRequest.search do
      if associated_users.first != ALL_FILTER
        any_of do
          associated_users.each do |user_name|
            with(:associated_user_names, user_name)
          end
        end
      end
    end
    tr_ids = search.results.map { |m| m.id }

    search = Child.search do
      if associated_users.first != ALL_FILTER
        any_of do
          associated_users.each do |user_name|
            with(:associated_user_names, user_name)
          end
        end
      end
    end
    case_ids = search.results.map { |m| m.id }


    search = PotentialMatch.search do
      any_of do
        tr_ids.each do |tr_id|
          with(:tracing_request_id, tr_id)
        end
      end
      facet(:average_rating) do
        row(:range_tr_1) do
          with(:average_rating, 0.0..4.0)
        end
        row(:range_tr_2) do
          with(:average_rating, 4.0..8.0)
        end
        row(:range_tr_3) do
          with(:average_rating, 8.0..12.0)
        end
        row(:range_tr_4) do
          with(:average_rating).greater_than(12.0)
        end
      end
    end
    search.facet(:average_rating).rows.each do |facet|
      @match_stats[facet.value] = facet.count
    end
    search = PotentialMatch.search do
      any_of do
        case_ids.each do |case_id|
          with(:child_id, case_id)
        end
      end
      facet(:average_rating) do
        row(:range_case_1) do
          with(:average_rating, 0.0..4.0)
        end
        row(:range_case_2) do
          with(:average_rating, 4.0..8.0)
        end
        row(:range_case_3) do
          with(:average_rating, 8.0..12.0)
        end
        row(:range_case_4) do
          with(:average_rating).greater_than(12.0)
        end
      end
    end
    search.facet(:average_rating).rows.each do |facet|
      @match_stats[facet.value] = facet.count
    end
    @match_stats
  end


  def show_flagged_by
    flag_criteria = {
        field: :flag_created_at,
        type: 'child',
        is_manager: current_user.is_manager?,
        modules: @module_ids
    }

    @flagged_by_me = search_flags(flag_criteria.merge({flagged_by: current_user.user_name}))
    @flagged_by_me = @flagged_by_me[0..9]

    if current_user.is_manager?
      # @recent_activities = load_recent_activities.results
      # @scheduled_activities = search_flags({field: :flag_date, criteria: Date.today..1.week.from_now.utc, type: 'child'})
    elsif @flagged_by_others = search_flags(flag_criteria.merge({without_flagged_by: current_user.user_name}))
      @flagged_by_others = @flagged_by_others[0..9]
    end
  end

  def load_incidents_information
    #Retrieve only MRM incidents.
    flag_criteria = {
        field: :flag_created_at,
        criteria: 1.week.ago.utc..Date.tomorrow,
        type: 'incident'
    }
    modules = [PrimeroModule::MRM]
    @incidents_recently_flagged = search_flags(flag_criteria)
    @incidents_recently_flagged = @incidents_recently_flagged[0..4]
    @open_incidents = Incident.open_incidents(@current_user)
  end

  def load_gbv_incidents_information
    @gbv_incidents_recently_flagged = search_flags({field: :flag_created_at, criteria: 1.week.ago.utc..Date.tomorrow,
                                                    type: 'incident'})
    @gbv_incidents_recently_flagged = @gbv_incidents_recently_flagged[0..4]
    @open_gbv_incidents = Incident.open_gbv_incidents(@current_user)
  end

  def load_admin_information
    last_week = 1.week.ago.beginning_of_week .. 1.week.ago.end_of_week
    this_week = DateTime.now.beginning_of_week .. DateTime.now.end_of_week
    locations = current_user.managed_users.map { |u| u.location }.compact.reject(&:empty?)

    if locations.present?
      @reporting_location_stats = build_admin_stats({
        totals: get_admin_stat({ status: Record::STATUS_OPEN, locations: locations, by_reporting_location: true }),
        new_last_week: get_admin_stat({ status: Record::STATUS_OPEN, new: true, date_range: last_week, locations: locations, by_reporting_location: true }),
        new_this_week: get_admin_stat({ status: Record::STATUS_OPEN, new: true, date_range: this_week, locations: locations, by_reporting_location: true }),
        closed_last_week: get_admin_stat({ status: Record::STATUS_CLOSED, closed: true, date_range: last_week, locations: locations, by_reporting_location: true }),
        closed_this_week: get_admin_stat({ status: Record::STATUS_CLOSED, closed: true, date_range: this_week, locations: locations, by_reporting_location: true })
      })
    end

    @protection_concern_stats = build_admin_stats({
        totals: get_admin_stat({by_protection_concern: true}),
        open: get_admin_stat({status: Record::STATUS_OPEN, by_protection_concern: true}),
        new_this_week: get_admin_stat({status: Record::STATUS_OPEN, by_protection_concern: true, new: true, date_range: this_week}),
        closed_this_week: get_admin_stat({status: Record::STATUS_CLOSED, by_protection_concern: true, closed: true, date_range: this_week})
    })
  end


  def build_admin_stats(stats)
    admin_stats = {}
    protection_concerns = Lookup.values('lookup-protection-concerns', @lookups, locale: I18n.locale)
    stats.each do |k, v|
      stat_facet = v.facet("#{@reporting_location}#{@admin_level}".to_sym) || v.facet(:protection_concerns)
      stat_facet.rows.each do |l|
        admin_stats[l.value] = {} unless admin_stats[l.value].present?
        protection_concern = protection_concerns.select{|pc| pc['id'] == l.value}
        admin_stats[l.value][k] = l.count ||= 0
        admin_stats[l.value][:display_text] = protection_concern.first['display_text'] if protection_concern.present?
        if v.facet(:protection_concerns).present? && !protection_concern.present?
          admin_stats.delete(l.value)
        end
      end
    end

    admin_stats
  end

  def get_admin_stat(query)
    #This is necessary because the instance variables can't be seen within the search block below
    admin_level = @admin_level
    reporting_location = @reporting_location

    module_ids = @module_ids
    return Child.search do
      if module_ids.present?
        any_of do
          module_ids.each do |m|
            with(:module_id, m)
          end
        end
      end
      with(:associated_user_names, current_user.managed_user_names)
      with(:record_state, true)
      with(:status, query[:status]) if query[:status].present?
      with(:created_at, query[:date_range]) if query[:new].present?
      with(:date_closure, query[:date_range]) if query[:closed].present?
      facet("#{reporting_location}#{admin_level}".to_sym, zeros: true) if query[:by_reporting_location].present?
      facet(:protection_concerns, zeros: true) if query[:by_protection_concern].present?
    end
  end
end
