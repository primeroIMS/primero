#TODO - Usng CouchRest because of 'model_class.properties_by_name' in filtering
#TODO - Investigate if there is a way around this
class Duplicate < CouchRest::Model::Base
  include ActiveModel::Model
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
      # search_case = Child.new(age: 12, name: 'Daphne', sex: 'female')
      matching_criteria = search_case.match_criteria(nil, match_fields)
      search_result = Child.find_match_records(matching_criteria, Child)
      duplicates_from_search(search_result) do |duplicate_case_id, score, average_score|
        Duplicate.new(duplicate_case_id, score, average_score)
      end
    end

    private

    def new_case_from_search_params(match_fields={}, search_parameters={})
      child_params = search_parameters.select{|k,v| match_fields.values.flatten.include?(k)}

      #TODO - total hack to patch filters
      #TODO - fix the filters
      child_params['age'] = child_params['age'].flatten.first if child_params['age'].present?
      child_params['sex'] = child_params['sex'].first if child_params['sex'].present?

      Child.new(child_params)
    end

    def duplicates_from_search(search_result)
      Duplicate.normalize_search_result search_result do |duplicate_case_id, score, average_score|
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

end
