class AuditLogsController < ApplicationController

  include RecordFilteringPagination

  before_action :load_audit_logs, :only => [:index]

  def index
    authorize! :index, AuditLog
    @current_modules = nil #Hack because this is expected in templates used.
    @saved_searches = []   #Hack because this is expected in templates used.
    @filters = {}          #Hack because this is expected in templates used.
    @users = User.all.map(&:user_name)
    @per_page = per_page
    @audit_logs = @audit_logs.paginate(page: page, per_page: per_page)
    @total_records = @audit_logs.total_entries
  end

  #Override method defined in record_filtering_pagination
  def per_page
    params[:per] ? params[:per].to_i : 100
  end

  private

  def load_audit_logs
    if params[:scope].present?
      @user_name_params = user_name_params
      @timestamp_name_params = timestamp_params

      if @user_name_params
        #TODO handle user_name && action_name
        @audit_logs = AuditLog.find_by_user_name_and_timestamp(@user_name_params,
                                                               @timestamp_name_params[:from],
                                                               @timestamp_name_params[:to])
      else
        @audit_logs = AuditLog.find_by_timestamp(@timestamp_name_params[:from], @timestamp_name_params[:to])
      end
    else
      @audit_logs = AuditLog.find_by_timestamp
    end
  end

  def user_name_params
    params[:scope][:user_name].split('||').last if params[:scope][:user_name].present?
  end

  def timestamp_params
    return {from: nil, to: nil} if params[:scope][:timestamp].blank?
    date_range = params[:scope][:timestamp].split('||').last.split('.')
    {from: DateTime.parse(date_range.first), to: DateTime.parse(date_range.last)}
  end

end