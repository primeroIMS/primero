class AuditLogsController < ApplicationController

  include RecordFilteringPagination

  before_action :load_audit_logs, :only => [:index]

  def index
    authorize! :index, AuditLog

    @audit_logs = @audit_logs.paginate
    @current_modules = nil #Hack because this is expected in templates used.
    @saved_searches = []   #Hack because this is expected in templates used.
    @filters = {}          #Hack because this is expected in templates used.
    @users = User.all.map(&:user_name)
    @total_records = @audit_logs.size
    @per_page = per_page
  end

  def per_page
    params[:per] ? params[:per].to_i : 100
  end

  private

  def load_audit_logs
    #TODO handle begin_time & end_time
    if params[:user_name].present?
      @audit_logs = AuditLog.find_by_action_name_and_timestamp(params[:user_name])
    elsif params[:action_name].present?
      @audit_logs =AuditLog.find_by_action_name_and_timestamp(params[:action_name])
    else
      @audit_logs = AuditLog.find_by_timestamp
    end
  end

end