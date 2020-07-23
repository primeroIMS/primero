# frozen_string_literal: true

# Describes a case that may duplicate another case.
# TODO: This class represents the v1.x approach for detecting duplicates for individual matchable records
#       using Solr fuzzy searching. If we decide to continue this business logic, we will likely
#       need to start persisting potential duplicate and create an API or export around them.
class Duplicate < ValueObject
  attr_accessor :record, :duplicated_by, :likelihood

  def self.find_for(record)
    matching_service = MatchingService.new
    match_result = matching_service.find_match_records(record.match_criteria, record.class)
    matching_service.normalize_search_results(match_result).map do |id, normalized|
      duplicated_by = record.class.find_by(id: id)
      Duplicate.new(record: record, duplicated_by: duplicated_by, likelihood: normalized[:likelihood])
    end
  end
end
