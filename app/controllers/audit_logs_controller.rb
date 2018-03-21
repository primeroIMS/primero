class AuditLogsController < ApplicationController

  include RecordFilteringPagination

  def index
    authorize! :index, AuditLog

    #TODO
    @audit_logs = []
    @audit_logs = AuditLog.get
    @audit_logs = @audit_logs.paginate


    # @current_modules = nil #Hack because this is expected in templates used.
    # @total_records = @tasks.size
    # @per_page = per_page
    #
    # if @tasks.present?
    #   @lookups = Lookup.all(keys: ['lookup-risk-level', 'lookup-service-type', 'lookup-followup-type'])
    # end
  end

  def per_page
    params[:per] ? params[:per].to_i : 100
  end

end