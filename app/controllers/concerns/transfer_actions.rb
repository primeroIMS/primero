module TransferActions
  extend ActiveSupport::Concern

  def transfer
    get_selected_records

    # TODO transfer magic happens here
    flash[:notice] = "Testing...7...8...9"

    #TODO make path generic
    redirect_to :back
  end

  private

  def get_selected_records
    @selected_records = []
    if params[:id].present?
      @selected_records << params[:id]
    elsif params[:selected_transfer_records].present?
      @selected_records = params[:selected_transfer_records].split(',')
    end
    return @selected_records
  end
  
end