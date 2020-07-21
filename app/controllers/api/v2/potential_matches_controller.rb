# frozen_string_literal: true

# API endpoint for listing potential matches for either cases or tracing requests
class Api::V2::PotentialMatchesController < Api::V2::RecordResourceController
  def index
    authorize! :read, @record
    authorize! :read, PotentialMatch
    @potential_matches = MatchingService.matches_for(@record)
  end
end
