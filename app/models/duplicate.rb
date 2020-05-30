# frozen_string_literal: true

# Describes a case that may duplicate another case
# TODO: This is specific to cases.  Will we need to in the future handle duplicate Incidents or TracingRequests?
# TODO: Create rspec tests
class Duplicate
  attr_accessor :id, :child, :likelihood

  def initialize(child, score, average_score)
    self.child ||= child
    self.likelihood = Matchable::Utils.calculate_likelihood(score, average_score)
  end

  class << self
    # TODO: refactor this. Why are we pretending this is a record?
    # Emulate 'find' since this isn't persisted in a DB
    def find(match_fields = {}, search_parameters = {})
      return [] if search_parameters.blank?

      search_case = new_case_from_search_params(match_fields, search_parameters)
      matching_criteria = search_case.match_criteria(search_case.data, match_fields) # TODO: search_case.data?
      search_result = Child.find_match_records(matching_criteria, Child, nil, false)
      cases_hash = Child.where(id: search_result.keys).map { |c| [c.id, c] }.to_h
      duplicates_from_search(search_result) do |duplicate_case_id, score, average_score|
        Duplicate.new(cases_hash[duplicate_case_id], score, average_score)
      end
    end

    private

    def new_case_from_search_params(match_fields = {}, search_parameters = {})
      child_params = search_parameters.select { |k, _| match_fields.values.flatten.include?(k) }

      # TODO: total hack to patch filters
      # TODO: fix the filters
      # TODO: does this work for other checkboxes?   Need a more perm fix....
      child_params['sex'] = child_params['sex'].first if child_params['sex'].present?

      Child.new(data: child_params)
    end

    def duplicates_from_search(search_result)
      Matchable::Utils.normalize_search_result(search_result) do |duplicate_case_id, score, average_score|
        yield(duplicate_case_id, score, average_score)
      end
    end
  end

  def case_id
    self.child.id
  end

  def display_id
    self.child.display_id
  end

  def name
    self.child.name
  end

  def age
    self.child.age
  end

  def sex
    self.child.sex
  end

  def owned_by
    self.child.owned_by
  end

  def display_field(field_or_name, lookups = nil)
    self.child.display_field(field_or_name, lookups)
  end
end
