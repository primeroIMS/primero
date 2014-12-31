module TransferActions
  extend ActiveSupport::Concern

  def transfer
    # TODO transfer magic happens here
    flash[:notice] = "Testing...7...8...9"
    
    #TODO make path generic
    redirect_to cases_path
  end
  
end