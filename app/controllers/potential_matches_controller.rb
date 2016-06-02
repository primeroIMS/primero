class PotentialMatchesController < ApplicationController
  @model_class = PotentialMatch

  include TracingActions

  def index
    if params[:match].present?
      match_class = Child
      results = match_class.find_match_records(@match_criteria, match_class)
      PotentialMatch.update_matches_for_tracing_request(@tracing_request.id, @subform_id, results)
      @potential_matches = PotentialMatch.get_all.all.select{|match| match.tracing_request_id == @tracing_request.id && match.status != PotentialMatch::DELETED}
    else
      @potential_matches = PotentialMatch.get_all.all.select{|match| match.status != PotentialMatch::DELETED}
    end
  end

end
