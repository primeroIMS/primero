#TODO : This is specific to cases.  Will we need to in the future handle duplicate Incidents or TracingRequests?
class Duplicate
  include ActiveModel::Model
  include Matchable

  #TODO - Create rspec tests

  attr_accessor :id
  attr_accessor :child_id
  attr_accessor :child
  attr_accessor :likelihood

  def initialize(child, score, average_score)
    self.child_id = child.id
    self.child ||= child
    self.likelihood = Duplicate.calculate_likelihood(score, average_score)
  end

  class << self
    # Necessary for record_filtering_pagination
    def properties_by_name
      {}
    end

    # Emulate 'find' since this isn't persisted in a DB
    def find(match_fields={}, search_parameters={})
      return [] if search_parameters.blank?
      search_case = new_case_from_search_params(match_fields, search_parameters)
      matching_criteria = search_case.match_criteria(nil, match_fields)
      search_result = Child.find_match_records(matching_criteria, Child, nil, false)
      cases_hash = {}
      Child.all(keys: search_result.keys).all.each{|c| cases_hash[c.id] = c}
      duplicates_from_search(search_result) do |duplicate_case_id, score, average_score|
        Duplicate.new(cases_hash[duplicate_case_id], score, average_score)
      end
    end

    private

    def new_case_from_search_params(match_fields={}, search_parameters={})
      child_params = search_parameters.select{|k,v| match_fields.values.flatten.include?(k)}

      #TODO - total hack to patch filters
      #TODO - fix the filters
      #TODO - does this work for other checkboxes?   Need a more perm fix....
      child_params['sex'] = child_params['sex'].first if child_params['sex'].present?

      Child.new(child_params)
    end

    def duplicates_from_search(search_result)
      Duplicate.normalize_search_result(search_result) do |duplicate_case_id, score, average_score|
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
