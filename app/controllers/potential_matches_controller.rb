class PotentialMatchesController < ApplicationController
  @model_class = PotentialMatch

  def index
    if params[:match].present?
      @potential_matches = model_class.get_matches_for_tracing_request(params[:match])
    else
      @potential_matches = model_class.filter_deleted_matches(model_class.get_all.all)
    end
  end

end
