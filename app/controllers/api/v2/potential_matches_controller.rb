# frozen_string_literal: true

# API endpoint for listing potential matches for either cases or tracing requests
class Api::V2::PotentialMatchesController < RecordResourceController
  def index
    authorize! :read, @record
    authorize! :read, PotentialMatch
    # @potential_matches = @record.potential_matches
  end
end
