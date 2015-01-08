module TransferActions
  extend ActiveSupport::Concern

  include SelectActions

  def transfer
    authorize! :transfer, model_class

    get_selected_ids

    @transfer_records = []
    if @selected_ids.present?
      @transfer_records = model_class.all(keys: @selected_ids).all
    else
      #Transfer all records
      @filters = record_filter(filter)
      @transfer_records, @total_records = retrieve_records_and_total(@filters)
    end

    if params[:is_remote].present? && params[:is_remote] == 'true'
      if params[:remote_primero].present? && params[:remote_primero] == 'true'
        #remote Primero instance transfer  JSON
      else
        #remote non-Primero instance transfer  CSV
      end
    else
      #local instance transfer
    end

    # TODO transfer magic happens here
    flash[:notice] = "Testing...7...8...9"

    redirect_to :back
  end

end