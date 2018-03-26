class AuditLogsController < ApplicationController

  include RecordFilteringPagination

  def index
    authorize! :index, AuditLog

    @audit_logs = AuditLog.by_timestamp(descending: true).all
    @audit_logs = @audit_logs.paginate
    @current_modules = nil #Hack because this is expected in templates used.
    @total_records = @audit_logs.size
    @per_page = per_page
  end

  def per_page
    params[:per] ? params[:per].to_i : 100
  end

end