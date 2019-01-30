#TODO : This is specific to cases.  Will we need to in the future handle duplicate Incidents or TracingRequests?
class Duplicate
  include ActiveModel::Model
  include CouchRest::Model::CastedModel
  include Matchable

  #TODO - Create rspec tests

  attr_accessor :id
  attr_accessor :child_id
  attr_accessor :child
  attr_accessor :likelihood

  def initialize(child_id, score, average_score)
    self.child_id = child_id
    self.child ||= Child.get(child_id) if child_id.present?
    self.likelihood = Duplicate.calculate_likelihood(score, average_score)
  end

  class << self
    # Emulate 'find' since this isn't persisted in a DB
    def find(match_fields={}, search_parameters={})
      return [] if search_parameters.blank?
      search_case = new_case_from_search_params(match_fields, search_parameters)
      matching_criteria = search_case.match_criteria(nil, match_fields)
      matching_criteria = update_match_criteria(matching_criteria, search_parameters)
      search_result = Child.find_match_records(matching_criteria, Child, nil, false)
      duplicates_from_search(search_result) do |duplicate_case_id, score, average_score|
        Duplicate.new(duplicate_case_id, score, average_score)
      end
    end

    private

    def new_case_from_search_params(match_fields={}, search_parameters={})
      #Don't include age... it will be plugged in later
      #TODO: this is clunky... needs to be improved
      child_params = search_parameters.select{|k,v| match_fields.values.flatten.include?(k) && ['age' , 'date_of_birth', 'date_of_separation'].exclude?(k)}

      #TODO - total hack to patch filters
      #TODO - fix the filters
      #TODO - does this work for other checkboxes?   Need a more perm fix....
      child_params['sex'] = child_params['sex'].first if child_params['sex'].present?

      Child.new(child_params)
    end

    def duplicates_from_search(search_result)
      Duplicate.normalize_search_result search_result do |duplicate_case_id, score, average_score|
        yield(duplicate_case_id, score, average_score)
      end
    end

    #TODO Clean this up
    # Handle if incoming age param is and array of age ranges, or just an age
    # Examples:   [["12", "17"]]  or  "12"
    def update_match_criteria(matching_criteria, search_parameters={})
      age_param = search_parameters['age']
      if age_param.present?
        age_param = age_param.first if age_param.is_a?(Array)
        matching_criteria[:age] = age_param.is_a?(Array) ? ["#{age_param.first} TO #{age_param.last}"] : ["#{age_param}"]
      end
      dob_param = search_parameters['date_of_birth']
      if dob_param.present?
        matching_criteria[:date_of_birth] = age_param.is_a?(Array) ? ["#{dob_param.first} TO #{dob_param.last}"] : ["#{dob_param}"]
      end
      matching_criteria
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
