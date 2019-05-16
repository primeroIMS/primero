class TracingRequest < ApplicationRecord

  include Record
  include Searchable
  include Ownable
  include Historical
  include Flaggable
  include Matchable
  include Attachable
  #include Importable #TODO: Refactor with Imports and Exports

  store_accessor :data,
    :tracing_request_id, :inquiry_date, :relation_name, :relation_age, :relation_nickname, :relation_other_family, :relation,
    :relation_nationality, :relation_language, :relation_religion,
    :relation_ethnicity, :relation_sub_ethnicity1, :relation_sub_ethnicity2,
    :monitor_number, :survivor_code, :reunited, :inquiry_date,
    :tracing_request_subform_section,
    :location_last, :created_at, :posted_at, :created_by

  alias inquirer_id tracing_request_id
  alias inquiry_status status ; alias inquiry_status= status=

  def photos ; [] ; end #TODO: delete after refactoring Documents
  def photo_keys ; [] ; end #TODO: delete after refactoring Documents
  def has_valid_audio? ; nil ; end #TODO: delete after refactoring Documents

  def self.quicksearch_fields
    %w(tracing_request_id short_id relation_name relation_nickname tracing_names
       tracing_nicknames monitor_number survivor_code
    )
  end

  searchable auto_index: self.auto_index? do
    extend Matchable::Searchable
    configure_searchable(TracingRequest)

    quicksearch_fields.each do |f|
      text(f) { self.data[f] }
    end
  end

  alias super_defaults defaults
  def defaults
    super_defaults
    self.inquiry_date ||= Date.today
    self.tracing_request_subform_section ||= []
  end

  def subform_match_values(field)
    tracing_request_subform_details(field)
  end

  def tracing_request_subform_details(field)
    self.tracing_request_subform_section.map { |fds| fds[field] }.compact.uniq.join(' ')
  end

  def self.minimum_reportable_fields
    {
      'boolean' => ['record_state'],
      'string' => ['inquiry_status', 'owned_by'],
      'multistring' => ['associated_user_names', 'owned_by_groups'],
      'date' => ['inquiry_date']
    }
  end

  def traces(trace_id=nil)
    @traces ||= (self.tracing_request_subform_section || [])
    if trace_id.present?
      @traces = @traces.select{|trace| trace['unique_id'] == trace_id}
    end
    return @traces
  end

  def trace_by_id(trace_id)
    self.traces.select{|trace| trace['unique_id'] == trace_id}.first
  end

  def tracing_names
    names = []
    if self.tracing_request_subform_section.present?
      names = self.tracing_request_subform_section.map{|t| t['name']}.compact
    end
    return names
  end

  def tracing_nicknames
    names = []
    if self.tracing_request_subform_section.present?
      names = self.tracing_request_subform_section.map{|t| t['name_nickname']}.compact
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

  def matching_cases(trace_id=nil, trace_fields={})
    matches = []
    traces(trace_id).each do |tr|
      matching_criteria = match_criteria(tr, trace_fields)
      match_result = TracingRequest.find_match_records(matching_criteria, Child, nil)
      tr_matches = PotentialMatch.matches_from_search(match_result) do |child_id, score, average_score|
        child = Child.find_by(id: child_id)
        PotentialMatch.build_potential_match(child, self, score, average_score, tr['unique_id'])
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

end
