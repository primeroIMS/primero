module ReferActions
  extend ActiveSupport::Concern

  def referral
    get_selected_records

    # TODO referral magic happens here
    flash[:notice] = "Testing...1...2...3"

    redirect_to :back
  end


  private

  def get_selected_records
    @selected_records = []
    if params[:id].present?
      @selected_records << params[:id]
    elsif params[:selected_referral_records].present?
      @selected_records = params[:selected_referral_records].split(',')
    end
    return @selected_records
  end
  
end