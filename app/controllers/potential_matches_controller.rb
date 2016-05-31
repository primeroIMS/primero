class PotentialMatchesController < ApplicationController
  @model_class = PotentialMatch

  include TracingActions

  def index
    if params[:match].present?
      match_class = Child
      results = match_class.find_match_records(@match_criteria, match_class)
      model_class.update_matches_for_tracing_request(@tracing_request.id, results) unless results.empty?
      @potential_matches = PotentialMatch.get_all.all.select{|match| match.tracing_request_id == @tracing_request.id}
    else
      @potential_matches = PotentialMatch.get_all.all
    end
  end

end
