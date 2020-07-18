# frozen_string_literal: true

# Describes records that can be used to do matches agains each other
# for duplicate detection and family tracing and reunification
module Matchable
  extend ActiveSupport::Concern

  def find_matches
    MatchingService.matches_for(self)
  end
end
