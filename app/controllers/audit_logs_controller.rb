class AuditLogsController < ApplicationController

  include RecordFilteringPagination

  def index
    authorize! :index, AuditLog

    #TODO should this fetch from solr instead to enable filtering
    @audit_logs = AuditLog.find_by_timestamp
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

end