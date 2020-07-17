# frozen_string_literal: true

# Describes records that can be used to do matches agains each other
# for duplicate detection and family tracing and reunification
module Matchable
  extend ActiveSupport::Concern

  # TODO: We'll need to pick one place where we calculate likelihood, and this ain't it
  LIKELY = 'likely'
  POSSIBLE = 'possible'
  LIKELIHOOD_THRESHOLD = 0.7
  NORMALIZED_THRESHOLD = 0.1

  PHONETIC_FIELD_NAMES = %w[name name_nickname name_other relation_name relation_nickname relation_other_family].freeze

  def find_matches
    MatchingService.matches_for(self)
  end

  # Sunspot/Solr configurations for fuzzy search
  module Searchable
    def configure_for_matching(field_name, from = :itself)
      if PHONETIC_FIELD_NAMES.include?(field_name)
        text(field_name, as: "#{field_name}_ph") { send(from).data[field_name] }
      else
        text(field_name) { send(from).data[field_name] }
      end
    end

    def configure_for_matching_from_subform(subform_field_name, field_name, from = :itself)
      if PHONETIC_FIELD_NAMES.include?(field_name)
        text(field_name, as: "#{field_name}_ph") do
          send(from).values_from_subform(subform_field_name, field_name)&.join(' ')
        end
      else
        text(field_name) do
          send(from).values_from_subform(subform_field_name, field_name)&.join(' ')
        end
      end
    end
  end

  # Matching service type functionality
  # TODO: Move to a service
  class Utils
    def self.calculate_likelihood(score, aggregate_average_score)
      (score - aggregate_average_score) > LIKELIHOOD_THRESHOLD ? LIKELY : POSSIBLE
    end

    # TODO: Is this logic duplicated with PotentialMatch.matches_from_search
    def self.normalize_search_result(search_result)
      records = []
      if search_result.present?
        scores = search_result.values
        max_score = scores.max
        normalized_search_result = search_result.map { |k, v| [k, v / max_score.to_f] }
        average_score = normalized_search_result.to_h.values.sum / scores.count
        thresholded_search_result = normalized_search_result.select { |_, v| v > NORMALIZED_THRESHOLD }
        thresholded_search_result.each do |id, score|
          records << yield(id, score, average_score)
        end
      end
      records
    end
  end
end
