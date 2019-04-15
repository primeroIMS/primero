class BulkExportsController < ApplicationController

  include RecordFilteringPagination

  def index
    authorize! :index, BulkExport
    search = BulkExport.search do
      with(:status, [BulkExport::COMPLETE, BulkExport::PROCESSING])
      with(:owned_by, current_user.user_name)
      order_by(:started_on, :desc) #TODO: or should I just use the order helper?
      paginate(pagination)
    end
    @current_modules = nil #TODO: Hack because this is expected in templates used.

    @total_records = search.total
    @per = per_page
    @bulk_exports = search.results
  end

  def show
    @bulk_export = BulkExport.find_by(id: params[:id])
    authorize! :show, @bulk_export

    if @bulk_export.status == BulkExport::COMPLETE
      cookies[:download_status_finished] = true
      begin
        send_file(
          @bulk_export.encrypted_file_name,
          filename: "#{@bulk_export.file_name}.zip",
          :disposition => "inline",
          :type => 'application/zip'
        )
      rescue
        @bulk_export.status = BulkExport::TERMINATED
        @bulk_export.save
        flash[:error] = "#{t('bulk_export.retry')}"
        redirect_to(:back)
      end
    end
  end

  private

  def action_class
    BulkExport
  end

end
