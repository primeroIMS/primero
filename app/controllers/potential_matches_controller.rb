class PotentialMatchesController < ApplicationController
  @model_class = PotentialMatch

  def index
    if params[:match].present?
      @potential_matches = PotentialMatch.get_matches_for_tracing_request(params[:match])
    else
      @potential_matches = PotentialMatch.filter_deleted_matches(PotentialMatch.get_all.all)
    end
  end

end
