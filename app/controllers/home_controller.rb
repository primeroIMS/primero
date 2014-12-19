class HomeController < ApplicationController

  def index
    @page_name = t("home.label")
    @user = User.find_by_user_name(current_user_name)
    @notifications = PasswordRecoveryRequest.to_display
    load_associated_types
    load_modules_id

    load_cases_information if display_cases_dashboard?
    load_incidents_information if display_incidents_dashboard?
    load_manager_information if display_manager_dashboard?
  end

  private

  def search_flags(options={})
      map_flags(Flag.search{
        with(options[:field]).between(options[:criteria])
        with(:flag_record_type, options[:type])
        with(:flag_flagged_by, current_user.user_name) unless options[:is_manager].present?
        with(:flag_flagged_by_module, options[:modules]) if options[:is_manager].present?
        with(:flag_is_removed, false)
        order_by(:flag_date, :asc)
      }.hits)
  end

  def map_flags(flags)
    flags.map{ |flag|
      {
        record_id: flag.stored(:flag_record_id),
        message: flag.stored(:flag_message),
        flagged_by: flag.stored(:flag_flagged_by),
        date: flag.stored(:flag_date),
        created_at: flag.stored(:flag_created_at),
        system_generated_follow_up: flag.stored(:flag_system_generated_follow_up),
        short_id: flag.stored(:flag_record_short_id),
        record_type: flag.stored(:flag_record_type),
        name: flag.stored(:flag_child_name),
        date_of_first_report: flag.stored(:flag_date_of_first_report),
        incident_location: flag.stored(:flag_incident_location)
      }
    }
  end

  def build_manager_stats(cases, flags)
    @aggregated_case_worker_stats = {}

    cases.facet(:created_by).rows.each{|c| @aggregated_case_worker_stats[c.value] = {};
                                           @aggregated_case_worker_stats[c.value][:total_cases] = c.count}

    flags.select{|d| (Date.today..1.week.from_now.utc).cover?(d[:date])}
         .group_by{|g| g[:flagged_by]}
         .each{|g, f| @aggregated_case_worker_stats[g][:cases_this_week] = {};
                      @aggregated_case_worker_stats[g][:cases_this_week] = f.count }

    flags.select{|d| (1.week.ago.utc..Date.today).cover?(d[:date])}
         .group_by{|g| g[:flagged_by]}
         .each{|g, f| @aggregated_case_worker_stats[g][:cases_overdue] = {};
                      @aggregated_case_worker_stats[g][:cases_overdue] = f.count }

    @aggregated_case_worker_stats
  end

  def display_cases_dashboard?
    @display_cases_dashboard ||= @record_types.include?("case")
  end

  def display_manager_dashboard?
    @display_manager_dashboard ||= current_user[:is_manager]
  end

  def display_incidents_dashboard?
    @display_incidents_dashboard ||= @record_types.include?("incident") && @modules.include?(PrimeroModule::MRM)
  end

  def load_manager_information
    # TODO: Will Open be translated?
    cases = Child.search {
      facet :created_by, except: [with(:child_status, 'Open'), with(:module_id, current_user[:module_ids])], limit: -1
    }

    flags = search_flags({
      field: :flag_date,
      criteria: 1.week.ago.utc...1.week.from_now.utc,
      type: 'child',
      is_manager: true,
      modules: current_user[:module_ids]
    })

    build_manager_stats(cases, flags)
  end

  def load_associated_types
    @record_types = @current_user.modules.map{|m| m.associated_record_types}.flatten.uniq
  end

  def load_modules_id
    @modules = @current_user.module_ids
  end

  def load_cases_information
    @scheduled_activities = search_flags({field: :flag_date, criteria: Date.today..1.week.from_now.utc, type: 'child'})
    @overdue_activities = search_flags({field: :flag_date, criteria: 1.week.ago.utc..Date.today, type: 'child'})
    @recently_flagged = search_flags({field: :flag_created_at, criteria: 1.week.ago.utc..Date.today, type: 'child'})
    @recently_flagged_count = recent_count(@recently_flagged)
    @recently_flagged = @recently_flagged[0..4]
  end

  def load_incidents_information
    #Retrieve only MRM incidents.
    modules = [PrimeroModule::MRM]
    @incidents_recently_flagged = search_flags({field: :flag_created_at, criteria: 1.week.ago.utc..Date.today,
                                                type: 'incident'})
    @incidents_recently_flagged_count = recent_count(@incidents_recently_flagged)
    @incidents_recently_flagged = @incidents_recently_flagged[0..4]
    @open_incidents = Incident.open_incidents
  end

  def recent_count(flags)
    flags.group_by{|f| f[:record_id]}.keys.count
  end
end
