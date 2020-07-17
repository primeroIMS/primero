# frozen_string_literal: true

# Describes a trace for an individual child
class Trace < ApplicationRecord
  include Indexable
  include Matchable

  belongs_to :tracing_request
  store_accessor :data,
                 :unique_id,
                 :relation, :name, :name_nickname, :age, :date_of_birth, :sex,
                 :religion, :nationality, :language, :ethnicity
  class << self
    def trace_matching_field_names
      MatchingConfiguration.matchable_fields('tracing_request', true).pluck(:name) |
        MatchingConfiguration::DEFAULT_CHILD_FIELDS | ['relation']
    end

    def tracing_request_matching_field_names
      MatchingConfiguration.matchable_fields('tracing_request', false).pluck(:name) |
        MatchingConfiguration::DEFAULT_INQUIRER_FIELDS
    end
  end

  searchable do
    extend Searchable::TextIndexing
    Trace.trace_matching_field_names.each { |f| text_index(f) }
    Trace.tracing_request_matching_field_names.each do |f|
      text_index(f, :tracing_request)
    end
  end

  # Returns a hash representing the potential match query for this trace
  def match_criteria
    # TODO: Are clustered fields still a thing? eg. name, nickname
    match_criteria = tracing_request.data.slice(*Trace.tracing_request_matching_field_names).compact
    match_criteria = match_criteria.merge(data.slice(*Trace.trace_matching_field_names).compact)
    match_criteria.transform_values { |v| v.is_a?(Array) ? v.join(' ') : v }
  end

  def matches_to
    Child
  end
end
