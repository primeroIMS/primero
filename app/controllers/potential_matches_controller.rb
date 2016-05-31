class PotentialMatchesController < ApplicationController
  @model_class = PotentialMatch

  def index
    @potential_matches = PotentialMatch.get_all.all
  end

end
