class HomeController < ApplicationController

  def index
    @page_name = t("home.label")
    @user = User.find_by_user_name(current_user_name)
    @notifications = PasswordRecoveryRequest.to_display
    load_user_module_data

    load_cases_information if display_cases_dashboard?
    load_incidents_information if display_incidents_dashboard?
    load_manager_information if display_manager_dashboard?
    load_gbv_incidents_information if display_gbv_incidents_dashboard?
    load_admin_information if display_admin_dashboard?
  end

  private

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
      order_by(:flag_date, :desc)
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

  def build_manager_stats(cases, flags)
    @aggregated_case_worker_stats = {}

    cases.facet(:owned_by).rows.each{|c| @aggregated_case_worker_stats[c.value] = {total_cases: c.count}}
    flags.select{|d| (Date.today..1.week.from_now.utc).cover?(d[:date])}
         .group_by{|g| g[:flagged_by]}
         .each do |g, fz|
            if @aggregated_case_worker_stats[g].present?
              @aggregated_case_worker_stats[g][:cases_this_week] = fz.count
            # else
            #   @aggregated_case_worker_stats[g] = {cases_this_week: f.count}
            end
          end

    flags.select{|d| (1.week.ago.utc..Date.today).cover?(d[:date])}
         .group_by{|g| g[:flagged_by]}
         .each do |g, fz|
            if @aggregated_case_worker_stats[g].present?
              @aggregated_case_worker_stats[g][:cases_overdue] = fz.count
            # else
            #   @aggregated_case_worker_stats[g] = {cases_overdue: f.count}}
            end
          end
    @aggregated_case_worker_stats
  end

  def display_cases_dashboard?
    @display_cases_dashboard ||= @record_types.include?("case")
  end

  def display_manager_dashboard?
    @display_manager_dashboard ||= current_user.is_manager?
  end

  def display_incidents_dashboard?
    @display_incidents_dashboard ||= @record_types.include?("incident") && @module_ids.include?(PrimeroModule::MRM)
  end

  def display_gbv_incidents_dashboard?
    @display_gbv_incidents_dashboard ||= @record_types.include?("incident") && @module_ids.include?(PrimeroModule::GBV)
  end

  def display_admin_dashboard?
    @display_admin_dashboard ||= current_user.group_permissions.include?(Permission::ALL)
  end

  def load_manager_information
    # TODO: Will Open be translated?
    module_ids = @module_ids

    cases = Child.search do
      with(:child_status, 'Open')
      if module_ids.present?
        any_of do
          module_ids.each do |m|
            with(:module_id, m)
          end
        end
      end
      facet :owned_by, limit: -1
      adjust_solr_params do |params|
        params['f.owned_by_s.facet.mincount'] = 0
      end
      paginate page: 1, per_page: 0
    end

    flags = search_flags({
      field: :flag_date,
      criteria: 1.week.ago.utc...1.week.from_now.utc,
      type: 'child',
      is_manager: true,
      modules: @module_ids
    })

    # build_manager_stats(cases, flags)
  end

  def load_user_module_data
    @modules = @current_user.modules
    @module_ids = @modules.map{|m| m.id}
    @record_types = @modules.map{|m| m.associated_record_types}.flatten.uniq
  end

  def load_recent_activities
    Child.list_records({}, {:last_updated_at => :desc}, { page: 1, per_page: 20 }, current_user.managed_user_names)
  end

  def load_cases_information
    @stats = Child.search do
      # TODO: Check for valid
      with(:child_status, 'Open')
      associated_users = with(:associated_user_names, current_user.user_name)
      referred = with(:referred_users, current_user.user_name)
      facet(:risk_level, zeros: true, exclude: [referred]) do
        row(:high) do
          with(:risk_level, 'High')
          without(:last_updated_by, current_user.user_name)
        end
        row(:high_total) do
          with(:risk_level, 'High')
        end
        row(:medium) do
          with(:risk_level, 'Medium')
          without(:last_updated_by, current_user.user_name)
        end
        row(:medium_total) do
          with(:risk_level, 'Medium')
        end
        row(:low) do
          with(:risk_level, 'Low')
          without(:last_updated_by, current_user.user_name)
        end
        row(:low_total) do
          with(:risk_level, 'Low')
        end
      end

      facet(:records, zeros: true, exclude: [referred]) do
        row(:new) do
          without(:last_updated_by, current_user.user_name)
        end
        row(:total) do
          with(:child_status, 'Open')
        end
      end

      facet(:referred, zeros: true) do
        row(:new) do
          without(:last_updated_by, current_user.user_name)
        end
        row(:total) do
          with(:child_status, 'Open')
        end
      end
    end

    show_flagged_by
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
    elsif
    @flagged_by_others = search_flags(flag_criteria.merge({without_flagged_by: current_user.user_name}))
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

    build_admin_stats({
      totals: get_district_stat({status: 'Open'}),
      new_last_week: get_district_stat({ status: 'Open', new: true, date_range: last_week }),
      new_this_week: get_district_stat({ status: 'Open', new: true, date_range: this_week }),
      closed_last_week: get_district_stat({ status: 'Closed', closed: true, date_range: last_week }),
      closed_this_week: get_district_stat({ status: 'Closed', closed: true, date_range: this_week })
    })
  end

  def build_admin_stats(stats)
    district_stats = {}
    stats.each do |k, v|
      v.facet(:location_current).rows.each do |l|
        district_stats[l.value] = {} unless district_stats[l.value].present?
        district_stats[l.value][k] = l.count ||= 0
      end
    end
    @district_stats = district_stats
  end

  def get_district_stat(query)
    return Child.search do
      with(:location_current, current_user.managed_users.map{|u| u.location}.compact)
      with(:associated_user_names, current_user.managed_user_names)
      with(:record_state, true)
      with(:child_status, query[:status])
      with(:created_at, query[:date_range]) if query[:new]
      with(:date_closure, query[:date_range]) if query[:closed]
      facet(:location_current, zeros: true)
    end
  end
end
