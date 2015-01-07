module ReferActions
  extend ActiveSupport::Concern

  include SelectActions

  def referral
    get_selected_ids

    @referral_records = []
    if @selected_ids.present?
      @referral_records = model_class.all(keys: @selected_ids).all
    else
      #Refer all records
      @filters = record_filter(filter)
      @referral_records, @total_records = retrieve_records_and_total(@filters)
    end

    # TODO referral magic happens here
    flash[:notice] = "Testing...1...2...3"

    redirect_to :back
  end

end