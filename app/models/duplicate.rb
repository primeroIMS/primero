#TODO - Usng CouchRest because of 'model_class.properties_by_name' in filtering
#TODO - Investigate if there is a way around this
class Duplicate < CouchRest::Model::Base
  include ActiveModel::Model

  #TODO - Create rspec tests

  attr_accessor :id

  class << self
    # Emulate 'find' since this isn't persisted in a DB
    def find(id)
      # matching_configuration = MatchingConfiguration.new(id)
      # matching_configuration.load_form_fields
      # matching_configuration
    end

    def find_duplicate_cases(match_fields={})
      search_tracing_request = TracingRequest.new({
          relation_name: 'mother',
          inquiry_date: '15-Jan-2019',
          tracing_request_subform_section: [{age: 12, name: 'Daphne', sex: 'female'}]
        }
      )

      search_case = Child.new(age: 12, name: 'Daphne', sex: 'female')
      # binding.pry
      # x=3
      # matching_criteria = search_case.match_criteria(nil, match_fields)
      # search_result = Child.find_match_records(matching_criteria, Child, nil, {}, search_conditions)

      # search_criteria, search_conditions = duplicate_search_criteria case_fields
      # search_result = Child.find_match_records(search_criteria, Child, nil, {}, search_conditions)
      # Duplicate.duplicates_from_search(search_result.except self.id) do |duplicate_case_id, score, average_score|
      #   Duplicate.new(duplicate_case_id, score, average_score).build_potential_duplicate
      # end

      []
    end
  end

  def initialize(id=nil)
    @id = id || 'administration'

    # primero_module = PrimeroModule.get(PrimeroModule::CP)
    # @form_ids = primero_module.try(:associated_form_ids)
  end



  # Patch to make nav buttons work
  def new?
    false
  end

  private


end
