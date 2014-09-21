class HomeController < ApplicationController

  def index
    @page_name = t("home.label")
    @user = User.find_by_user_name(current_user_name)

    flags = Child.all.map {|c| c.flags}.flatten
    get_scheduled_activities(flags)
    get_recent_flags(flags)
    get_new_cases_assigned

    @notifications = PasswordRecoveryRequest.to_display
    @suspect_record_count = Child.flagged.count
  end

  def get_scheduled_activities(flags)
    @scheduled_activities = flags.select { |d| !d.date.blank? && !d.removed && !d.date.nil? && d.date >= 1.week.ago.utc }
                                 .sort_by { |s| s.date }.reverse
  end

  def get_recent_flags(flags)
    @recently_flagged = flags.select { |d| !d.removed && !d.created_at.nil? && d.created_at >= 1.week.ago.utc }
                                 .sort_by { |s| s.created_at }.reverse
  end

  def get_new_cases_assigned
    @cases = Child.list_records(filters={}, sort={:created_at => :desc}, 
      pagination={ per_page: 5 }, [current_user.user_name]).results
  end
end
