class AuditLogsController < ApplicationController

  include RecordFilteringPagination

  before_action :load_audit_logs, :only => [:index]

  def index
    authorize! :index, AuditLog
    @current_modules = nil #Hack because this is expected in templates used.
    @saved_searches = []   #Hack because this is expected in templates used.
    @filters = {}          #Hack because this is expected in templates used.
    @users = User.all.map(&:user_name)

    #The paginated result set gives the following:
    #  count:  Total count of all records for the query
    #  all:    Only the chunk of records in the range as defined by page & per_page
    @total_records = @audit_log_result.count
    @per_page = per_page
    audit_log_recs = @audit_log_result.try(:all) || []
    @audit_logs = paginated_collection(audit_log_recs, @total_records)
  end

  #Override method defined in record_filtering_pagination
  def per_page
    @per_page ||= params[:per] ? params[:per].to_i : 100
  end

  private

  def load_audit_logs
    @timestamp_name_params = timestamp_params
    @audit_log_result = AuditLog.where(timestamp: @timestamp_name_params[:from]..@timestamp_name_params[:to])
                                .order(timestamp: :desc)
    @audit_log_result = @audit_log_result.where(user_name: user_name_params) if user_name_params.present?
    @audit_log_result = @audit_log_result.try(:paginate, page: page, per_page: per_page) || []
  end

  def user_name_params
    @user_name_params = params[:scope][:user_name].split('||').last if params[:scope].present? && params[:scope].try(:[], :user_name).present?
  end

  def timestamp_params
    return {from: Time.at(0).to_datetime, to: DateTime.now.end_of_day} if params[:scope].try(:[], :timestamp).blank?
    date_range = params[:scope][:timestamp].split('||').last.split('.')
    {from: DateTime.parse(date_range.first), to: DateTime.parse(date_range.last)}
  end

end