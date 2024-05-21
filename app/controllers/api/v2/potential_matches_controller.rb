# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# API endpoint for listing potential matches for either cases or tracing requests
class Api::V2::PotentialMatchesController < Api::V2::RecordResourceController
  def index
    authorize! :read, @record
    authorize! :read, PotentialMatch
    @potential_matches = MatchingService.matches_for(@record)
  end
end
