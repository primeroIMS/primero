# frozen_string_literal: true

# Describes a trace for an individual child
class Trace < ApplicationRecord
  include Indexable

  belongs_to :tracing_request
  belongs_to :matched_case, foreign_key: 'matched_case_id', class_name: 'Child', optional: true

  store_accessor :data,
                 :unique_id,
                 :relation, :name, :name_nickname, :age, :date_of_birth, :sex,
                 :religion, :nationality, :language, :ethnicity

  after_initialize :set_unique_id

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
    Trace.trace_matching_field_names.each { |f| text_index(f, suffix: 'matchable') }
    Trace.tracing_request_matching_field_names.each do |f|
      text_index(f, suffix: 'matchable', from: :tracing_request)
    end
  end

  # Returns a hash representing the potential match query for this trace
  def match_criteria
    match_criteria = tracing_request.data.slice(*Trace.tracing_request_matching_field_names).compact
    match_criteria = match_criteria.merge(data.slice(*Trace.trace_matching_field_names).compact)
    match_criteria.transform_values { |v| v.is_a?(Array) ? v.join(' ') : v }
  end

  def matches_to
    Child
  end

  # Try to fetch the value first from the trace then from the tracing request.
  # Some field names correspond, so try those fields
  def value_for(field_name)
    data[field_name] ||
      tracing_request.data[corresponding_field_name(field_name)] ||
      data[corresponding_field_name(field_name)] ||
      tracing_request.data[field_name]
  end

  def corresponding_field_name(field_name)
    FIELD_CORRESPONDANCE[field_name] || field_name
  end

  def set_unique_id
    self.unique_id = id
  end

  def matched_case_comparison
    return unless matched_case.present?

    PotentialMatch.new(child: matched_case, trace: self).comparison
  end
end
