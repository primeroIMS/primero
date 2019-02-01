#TODO: For now leaving CouchRest::Model::Base
#TODO: Inheriting from ApplicationRecord breaks created_at in the Historical Concern for some reason
class TracingRequest < CouchRest::Model::Base
  use_database :tracing_request

  include PrimeroModel
  include Primero::CouchRestRailsBackward

  include Record
  include Ownable
  include PhotoUploader
  include AudioUploader
  include Flaggable
  include Matchable

  property :tracing_request_id
  property :relation_name
  property :reunited, TrueClass
  property :inquiry_date

  def initialize *args
    self['photo_keys'] ||= []
    self['histories'] = []
    super *args
  end

  design

  design :by_tracing_request_id do
    view :by_tracing_request_id
  end

  def self.quicksearch_fields
    [
        'tracing_request_id', 'short_id', 'relation_name', 'relation_nickname', 'tracing_names', 'tracing_nicknames',
        'monitor_number', 'survivor_code'
    ]
  end

  include Searchable #Needs to be after ownable

  searchable auto_index: self.auto_index? do
    form_matchable_fields.each do |field|
      text field, :boost => TracingRequest.get_field_boost(field)
      if phonetic_fields_exist?(field)
        text field, :as => "#{field}_ph"
      end
    end

    subform_matchable_fields.each do |field|
      text field, :boost => TracingRequest.get_field_boost(field) do |record|
        record.tracing_request_subform_details(field)
      end
      if phonetic_fields_exist?(field)
        text field, :as => "#{field}_ph" do |record|
          record.tracing_request_subform_details(field)
        end
      end
    end
  end

  def tracing_request_subform_details(field)
    self.tracing_request_subform_section.map { |fds| fds[:"#{field}"] }.compact.uniq.join(' ') if self.try(:tracing_request_subform_section)
  end

  def self.find_by_tracing_request_id(tracing_request_id)
    by_tracing_request_id(:key => tracing_request_id).first
  end

  #TODO: Keep this?
  def self.search_field
    "relation_name"
  end

  def self.view_by_field_list
    ['created_at', 'relation_name']
  end

  def self.minimum_reportable_fields
    {
      'boolean' => ['record_state'],
      'string' => ['inquiry_status', 'owned_by'],
      'multistring' => ['associated_user_names', 'owned_by_groups'],
      'date' => ['inquiry_date']
    }
  end

  def inquirer_id
    self.tracing_request_id
  end

  def traces(trace_id=nil)
    @traces ||= (self.tracing_request_subform_section || [])
    if trace_id.present?
      @traces = @traces.select{|trace| trace.unique_id == trace_id}
    end
    return @traces
  end

  def trace_by_id(trace_id)
    self.traces.select{|trace| trace.unique_id == trace_id}.first
  end

  def tracing_names
    names = []
    if self.tracing_request_subform_section.present?
      names = self.tracing_request_subform_section.map(&:name).compact
    end
    return names
  end

  def tracing_nicknames
    names = []
    if self.tracing_request_subform_section.present?
      names = self.tracing_request_subform_section.map(&:name_nickname).compact
    end
    return names
  end

  def fathers_name
    self.relation_name if self.relation_name.present? && self.relation.present? && self.relation.downcase == 'father'
  end

  def mothers_name
    self.relation_name if self.relation_name.present? && self.relation.present? && self.relation.downcase == 'mother'
  end

  def set_instance_id
    self.tracing_request_id ||= self.unique_identifier
  end

  def create_class_specific_fields(fields)
    self['inquiry_date'] ||= DateTime.now.strftime("%d-%b-%Y")
    self['inquiry_status'] ||= STATUS_OPEN
  end

  #TODO MATCHING: Bad code. This method is no longer being used
  #               and will either be refactored into a nightly job or deleted in a future release.
  def find_match_cases(child_id=nil)
    #TODO v1.3 Bad code smell. This method is doing two things at once
    all_results = []
    if self.tracing_request_subform_section.present?
      self.tracing_request_subform_section.each do |tr|
        match_criteria = match_criteria(tr)
        results = TracingRequest.find_match_records(match_criteria, Child, child_id)
        if child_id.nil?
          PotentialMatch.update_matches_for_tracing_request(self.id, tr.unique_id, tr.age, tr.sex, results, child_id)
        else
          results.each do |key, value|
            all_results.push({:tracing_request_id => self.id, :tr_subform_id => tr.unique_id,:tr_age => tr.age, :tr_gender => tr.sex, :score => value})
          end
        end
      end
    end
    all_results
  end

  #TODO MATCHING: This is are-implementation of the method above
  def matching_cases(trace_id=nil, trace_fields={})
    matches = []
    traces(trace_id).each do |tr|
      matching_criteria = match_criteria(tr, trace_fields)
      match_result = TracingRequest.find_match_records(matching_criteria, Child, child_id)
      tr_matches = PotentialMatch.matches_from_search(match_result) do |child_id, score, average_score|
        PotentialMatch.build_potential_match(child_id, self.id, score, average_score, tr.unique_id)
      end
      matches += tr_matches
    end
    return matches
  end

  alias :inherited_match_criteria :match_criteria
  def match_criteria(match_request=nil, trace_fields=nil)
    match_criteria = inherited_match_criteria(match_request, trace_fields)
    if match_request.present?
      TracingRequest.subform_matchable_fields(trace_fields).each do |field|
        match_field, match_value = TracingRequest.match_multi_criteria(field, match_request)
        match_criteria[:"#{match_field}"] = match_value if match_value.present?
      end
    end
    match_criteria.compact
  end

  #TODO MATCHING: This method is no longer being used
  #               and will either be refactored into a nightly job or deleted in a future release.
  def self.match_tracing_requests_for_case(case_id, tracing_request_ids)
    results = []
    TracingRequest.all(:keys => tracing_request_ids).all.each { |tr| results.concat(tr.find_match_cases(case_id)) }
    results
  end

end
