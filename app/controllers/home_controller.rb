class HomeController < ApplicationController

  def index
    @page_name = t("home.label")
    @user = User.find_by_user_name(current_user_name)
    @notifications = PasswordRecoveryRequest.to_display
    load_associated_types
    load_modules_id

    load_cases_information if display_cases_dashboard?
    load_incidents_information if display_incidents_dashboard?
  end

  private

  def load_associated_types
    @record_types = @current_user.modules.map{|m| m.associated_record_types}.flatten.uniq
  end

  def load_modules_id
    @modules = @current_user.module_ids
  end

  def display_cases_dashboard?
    @display_cases_dashboard ||= @record_types.include?("case")
  end

  def display_incidents_dashboard?
    @display_incidents_dashboard ||= @record_types.include?("incident") and @modules.include?(PrimeroModule::MRM)
  end

  def load_cases_information
    #TODO should filter by module as for Incidents? Keep current behavior for the moment.
    @scheduled_activities = get_scheduled_activities(get_flags_by_date(Child))
    #TODO should filter by module as for Incidents? Keep current behavior for the moment.
    @recently_flagged = get_recent_flags(get_recent_record_flagged(Child, @modules))
    @recently_flagged_count = get_recent_record_flagged_count(Child, @modules)
    @cases = get_new_records_assigned(Child)
  end

  def load_incidents_information
    #Retrieve only MRM incidents.
    modules = [PrimeroModule::MRM]
    @incidents_recently_flagged = get_recent_flags(get_recent_record_flagged(Incident, modules))
    @incidents_recently_flagged_count = get_recent_record_flagged_count(Incident, modules)
    @incidents = get_new_records_assigned(Incident)
    @open_incidents = get_open_incidents
  end

  def get_open_incidents
    filters = {"record_state" => "single||true",
              "module_id" => "single||#{PrimeroModule::MRM}",
              "status" => "single||#{t('dashboard.incident_status_open')}"}
    Incident.list_records(filters=filters, sort={:created_at => :desc}, pagination={ per_page: 20 }).results
  end

  def get_flags_by_date(model)
    #If remove the "descending" parameter, must use startkey instead endkey.
    model.by_flag_with_date(:endkey => 1.week.ago.utc, :descending => true).all.uniq(&:id).map {|c| c.flags}.flatten
  end

  def get_recent_record_flagged(model, modules)
    records = []
    modules.each do |primero_module|
      #If remove the "descending" parameter, must swap startkey and endkey value.
      records.concat(model.by_flag_created_at_latest(:startkey => [primero_module, {}],
                                              :endkey => [primero_module, 1.week.ago.utc],
                                              :limit => 5, :descending => true).all)
    end
    records
  end

  def get_recent_record_flagged_count(model, modules)
    records = 0
    modules.each do |primero_module|
       row = model.by_flag_created_at_latest(:startkey => [primero_module, 1.week.ago.utc],
                                      :endkey => [primero_module, {}], 
                                      :reduce => true).rows.first
       records += row["value"].to_i if row.present?
    end
    records
  end

  def get_scheduled_activities(flags)
    flags.select { |flag| !flag.removed && flag.date.present? && flag.date >= 1.week.ago.utc }
         .sort_by { |flag| flag.date }.reverse
  end

  def get_recent_flags(records)
    flags = []
    records.each do |record|
      flag = record.flags.select { |flag| !flag.removed && flag.created_at.present? && flag.created_at >= 1.week.ago.utc }
              .sort_by { |flag| flag.created_at }.last
      flags << flag if flag.present?
    end
    flags
  end

  def get_new_records_assigned(model)
    model.list_records(filters={}, sort={:created_at => :desc}, pagination={ per_page: 5 }, 
        [current_user.user_name]).results
  end
end
