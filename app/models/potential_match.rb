#TODO: For now leaving CouchRest::Model::Base
#TODO: Inheriting from ApplicationRecord breaks created_at in the Historical Concern for some reason
class PotentialMatch < CouchRest::Model::Base
  use_database :potential_match

  def self.parent_form
    'potential_match'
  end


  include PrimeroModel
  include Record
  include Historical
  include Syncable
  include SyncableMobile
  include Importable
  include Ownable

  property :tr_subform_id
  property :average_rating, Float
  property :aggregate_average_score, Float
  property :likelihood
  property :status, String, :default => 'POTENTIAL'
  property :unique_identifier
  property :child_id
  property :tracing_request_id

  attr_accessor :visible
  attr_accessor :child
  attr_accessor :tracing_request

  # TODO - this is failing as we are upgrading ruby & rails.
  # TODO - need to add back after couchrest version is upgraded
  # validates :child_id, :uniqueness => {:scope => :tr_subform_id}

  before_create :create_identification

  ALL_FILTER = 'all'
  POTENTIAL = 'POTENTIAL'
  DELETED = 'DELETED'
  FIELD_MASK = '***'

  LIKELY = 'likely'
  POSSIBLE = 'possible'

  NORMALIZED_THRESHOLD = 0.1
  LIKELIHOOD_THRESHOLD = 0.7

  VALUE_MATCH = 'match'
  VALUE_MISMATCH = 'mismatch'

  design do
    view :by_tracing_request_id
    view :by_child_id
    view :by_tracing_request_id_and_child_id
    view :by_child_id_and_tr_subform_id
    view :by_tracing_request_id_and_tr_subform_id
    view :by_tracing_request_id_and_status
    view :by_tracing_request_id_and_marked_invalid
    view :by_child_id_and_status
    view :by_average_rating
    view :all_valid_tracing_request_ids,
         :map => "function(doc) {
                    if(doc['couchrest-type'] == 'PotentialMatch' && doc['status'] == '#{PotentialMatch::POTENTIAL}') {
                        emit(doc['tracing_request_id'], null);
                      }
                   }",
         :reduce => "function(key, values) {
                       return null;
                     }"
    view :by_unique_identifier,
         :map => "function(doc) {
                  if (doc.hasOwnProperty('unique_identifier'))
                 {
                    emit(doc['unique_identifier'], null);
                 }
              }"
  end

  def self.quicksearch_fields
    ['child_id', 'tracing_request_id', 'tr_subform_id', 'average_rating']
  end

  def self.searchable_string_fields
    ['child_id', 'tracing_request_id', 'tr_subform_id', 'average_rating']
  end

  def self.searchable_date_time_fields
    ["created_at", "last_updated_at"]
  end

  include Searchable

  searchable do
    string :status
    integer :child_age
    string :child_sex
    integer :tracing_request_age
    string :tr_gender
    string :module_id
    double :average_rating
  end

  def mark_as_deleted
    mark_as_status(PotentialMatch::DELETED)
  end

  def deleted?
    marked_as?(PotentialMatch::DELETED)
  end

  def mark_as_potential_match
    mark_as_status(PotentialMatch::POTENTIAL)
  end

  def mark_as_status(status)
    self.status = status
  end

  def marked_as?(status)
    self.status == status
  end

  def create_identification
    self.unique_identifier ||= UUIDTools::UUID.random_create.to_s
  end

  def short_id
    self.unique_identifier.last(7)
  end

  #Overriding method in searchable concern
  #TODO MATCHING: This is being taken away. Also an unnecessary db call
  def pagination(pagination_parms=nil)
    {page:1, per_page:PotentialMatch.count}
  end

  #Overriding method in searchable concern
  def filter_associated_users?(match=nil, associated_user_names=nil)
    false
  end

  #Overriding method in searchable concern
  def search_multi_fields?
    false
  end

  #Overriding method in searchable concern
  def search_numeric_fields?
    false
  end

  def set_visible(associated_user_names, type = 'tracing_request')
    self.visible = (associated_user_names.first == 'all' || associated_user_names.include?(self.send("#{type}_owned_by")))
  end

  def set_likelihood(score, aggregate_average_score)
    self.aggregate_average_score = aggregate_average_score
    if (score - aggregate_average_score) > 0.7
      self.likelihood = LIKELY
    else
      self.likelihood = POSSIBLE
    end
  end

  def case_id_display
    self.child.try(:case_id_display)
  end

  def child_age
    self.child.try(:age)
  end

  def child_date_of_birth
    self.child.try(:date_of_birth)
  end

  def child_sex
    self.child.try(:sex)
  end

  def child
    @child ||= Child.get(self.child_id)
  end

  def tracing_request
    @tracing_request ||= TracingRequest.get(self.tracing_request_id)
  end

  def inquirer_id
    @inquirer_id ||= self.tracing_request.try(:inquirer_id)
  end

  def trace
    unless @trace.present?
      traces = self.tracing_request.try(:tracing_request_subform_section)
      if traces.present?
        @trace = traces.select{|t| t.unique_id == self.tr_subform_id}.first
      end
    end
    return @trace
  end

  def tracing_request_age
    @tracing_request_age ||= self.trace.try(:age)
  end

  def tracing_request_sex
    @tracing_request_sex ||= self.trace.try(:sex)
  end

  def case_name
    @case_name ||= self.child.try(:name)
  end

  def case_registration_date
    @case_registration_date ||= self.child.try(:registration_date)
  end

  def case_owned_by
    @case_owned_by ||= self.child.try(:owned_by)
  end

  def tracing_request_inquiry_date
    @tracing_request_inquiry_date ||= self.tracing_request.try(:inquiry_date)
  end

  def tracing_request_relation_name
    @relation_name ||= self.tracing_request.try(:relation_name)
  end

  def tracing_request_name
    @tracing_request_name ||= self.trace.try(:name)
  end

  def tracing_request_owned_by
    @tracing_request_owned_by ||= self.tracing_request.try(:owned_by)
  end

  def tracing_request_date_of_birth
    self.trace.try(:date_of_birth)
  end

  def compare_case_to_trace
    case_fields = PotentialMatch.case_fields_for_comparison
    case_field_values = case_fields.map do |field|
      case_value = self.child.try(field.name)
      trace_value = self.trace.try(Child.map_match_field(field.name)) ||
        self.tracing_request.try(Child.map_match_field(field.name))
      matches = compare_values(case_value, trace_value)
      {case_field: field, matches: matches, case_value: case_value, trace_value: trace_value}
    end
    family_field_values = []
    #TODO: Commenting out the lines below because they are not being displayed for now
    # family_fields = PotentialMatch.family_fields_for_comparison
    # family = self.child.family(self.trace.relation)
    # family.each do |member|
    #   member_values = family_fields.map do |field|
    #     case_value = member.try(field.name)
    #     trace_value = self.tracing_request.try(Child.map_match_field(field.name)) ||
    #       self.trace.try(Child.map_match_field(field.name))
    #     matches = compare_values(case_value, trace_value)
    #     {case_field: field, matches: matches, case_value: case_value, trace_value: trace_value}
    #   end
    #   family_field_values << member_values
    # end
    {case: case_field_values, family: family_field_values}
  end

    def compare_values(value1, value2)
      result = nil
      if value1 && value2 && (value1 == value2)
        result = VALUE_MATCH
      elsif value1 != value2
        result = VALUE_MISMATCH
      end
      return result
    end

  class << self
    alias :old_all :all
    alias :get_all :all

    def all(*args)
      old_all(*args)
    end

    #TODO MATCHING: This method is not being used and will likely be rewritten or deleted when potential matches are persisted
    def update_matches_for_tracing_request(tracing_request_id, subform_id, tr_age, tr_sex, results, child_id=nil)
      if child_id.nil?
        by_tracing_request_id_and_tr_subform_id.key([tracing_request_id, subform_id]).all.each do |pm|
          unless results.include? pm.child_id
            pm.mark_as_deleted
            pm.save
          end
        end
      end

      unless results.empty?
        results.each { |child_id, score| update_potential_match(child_id, tracing_request_id, score.to_f, subform_id, tr_age, tr_sex) }
      end
    end

    #TODO MATCHING: This method is not being used and will likely be rewritten or deleted when potential matches are persisted
    def update_matches_for_child(child_id, results)
      tr_subform_ids = results.map { |result| result[:tr_subform_id] }.uniq
      by_child_id.key(child_id).all.each do |pm|
        unless tr_subform_ids.include? pm.tr_subform_id
          pm.mark_as_deleted
          pm.save
        end
      end

      unless results.empty?
        results.each {
            |result| update_potential_match(child_id, result[:tracing_request_id], result[:score].to_f, result[:tr_subform_id], result[:tr_age], result[:tr_gender],)
        }
      end
    end

    def group_match_records(match_records=[], type)
      grouped_records = []
      if type == 'case'
        grouped_records = match_records.group_by(&:child_id).to_a
      elsif type == 'tracing_request'
        grouped_records = match_records.group_by{|r| [r.tracing_request_id, r.tr_subform_id]}.to_a
      end
      grouped_records = self.sort_list(grouped_records) if grouped_records.present?
      grouped_records
    end

    def sort_list(potential_matches)
      sorted_list = potential_matches.sort_by { |pm| -find_max_score_element(pm.last).try(:average_rating) }
    end

    # This is a bit of a hack to format the list of potential_matches to look the same as the old match_results
    # hash that was used before the refactor.
    def format_list_for_json(potential_matches, type)
      if type == 'case'
        format_case_list_for_json(potential_matches)
      else
        format_tr_list_for_json(potential_matches)
      end
    end

    #TODO MATCHING: Consider thresholding and normalizing in separate testable methods
    #               Consider taking out the PM generation methods from matchable concern, case and TRs and putting them all here
    def matches_from_search(search_result)
      matches = []
      if search_result.present?
        scores = search_result.values
        max_score = scores.max
        average_score = scores.reduce(0){|sum,x|sum+(x/max_score.to_f)} / scores.count.to_f
        normalized_search_result = search_result.map{|k,v| [k,v/max_score.to_f]}
        thresholded_search_result = normalized_search_result.select{|k,v| v > NORMALIZED_THRESHOLD}
        thresholded_search_result.each do |id, score|
          matches << yield(id, score, average_score)
        end
      end
      matches = link_cases_and_tracing_requests(matches)
      return matches
    end

    def build_potential_match(child_id, tracing_request_id, score, aggregate_average_score, subform_id)
      #TODO: In the old way of doing this, this was invoking find_or_build. But I think we always want to generate a fresh new potential match.
      pm = PotentialMatch.new :tracing_request_id => tracing_request_id, :child_id => child_id, :tr_subform_id => subform_id
      pm.average_rating = score
      pm.set_likelihood(score, aggregate_average_score)
      pm.module_id = PrimeroModule::CP #TODO: should just inherit from TR or Case parent
      pm.mark_as_potential_match
      #TODO: When we are persisting potential matches revisit this logic
      # should_mark_deleted = !pm.new? && !pm.deleted?
      # if should_mark_deleted
      #   pm.mark_as_deleted
      # end
      return pm
    end

    def case_fields_for_comparison
      FormSection.get_matchable_fields_by_parent_form('case', false)
        .select {|f| !['text_field', 'textarea'].include?(f.type) && f.visible?}
        .uniq{|f| f.name}
    end

    def family_fields_for_comparison
      FormSection.get_matchable_fields_by_parent_form('case', true)
        .select{|f| !['text_field', 'textarea'].include?(f.type) && f.visible?}
        .uniq{|f| f.name}
    end

    private

    #TODO MATCHING: This method may no longer be used and will eventually be deleted
    def update_potential_match(child_id, tracing_request_id, score, subform_id, tr_age, tr_sex)
      potantial_match = build_potential_match(child_id, tracing_request_id, score, subform_id, tr_age, tr_sex)
      potential_match.save
    end

    def link_cases_and_tracing_requests(potential_matches)
      child_ids = potential_matches.map(&:child_id).uniq
      tracing_request_ids = potential_matches.map(&:tracing_request_id).uniq
      case_hash = Child.all(keys: child_ids).map{|c| [c.child_id, c]}.to_h
      tracing_request_hash = TracingRequest
        .all(keys: tracing_request_ids)
        .map{|tr| [tr.tracing_request_id, tr]}.to_h
      potential_matches.map do |potential_match|
        potential_match.child = case_hash[potential_match.child_id]
        potential_match.tracing_request = tracing_request_hash[potential_match.tr_id]
        potential_match
      end
    end

    #TODO MATCHING: This method is longer used,
    #               but may be revamped when we turn persistence back on in the future
    def find_or_build(tracing_request_id, child_id, subform_id)
      potential_match = by_child_id_and_tr_subform_id.key([child_id, subform_id]).first
      return potential_match unless potential_match.nil?
      PotentialMatch.new :tracing_request_id => tracing_request_id, :child_id => child_id, :tr_subform_id => subform_id
    end

    def find_max_score_element(potential_match_detail_list)
      max_element = potential_match_detail_list.max_by(&:average_rating)
    end

    def format_case_list_for_json(potential_matches)
      match_list = []
      potential_matches.each do |record|
        # record.first is the key [child_id]
        # record.last is the list of potential_match records
        # use the first potential_match record to build the header
        match_1 = record.last.first
        match_hash = {'case_id' => match_1.case_id,
                      'child_id' => match_1.child_id,
                      'age' => match_1.child_age,
                      'sex' => match_1.case_sex,
                      'registration_date' => match_1.case_registration_date,
                      'match_details' => format_case_match_details(record.last)
        }
        match_list << match_hash
      end
      match_list
    end

    def format_case_match_details(potential_match_list)
      match_details = []
      potential_match_list.each do |potential_match|
        match_detail = {'tracing_request_id' => potential_match.tr_id,
                        'tr_uuid' => potential_match.tracing_request_id,
                        'subform_tracing_request_name' => potential_match.tracing_request_name,
                        'inquiry_date' => potential_match.tracing_request_inquiry_date,
                        'relation_name' => potential_match.tracing_request_relation_name,
                        'visible' => potential_match.visible,
                        'average_rating' => potential_match.average_rating,
                        'owned_by' => potential_match.case_owned_by
        }
        match_details << match_detail
      end
      match_details
    end

    def format_tr_list_for_json(potential_matches)
      match_list = []
      potential_matches.each do |record|
        # record.first is the key [tracing_request_id, tr_subform_id]
        # record.last is the list of potential_match records
        # use the first potential_match record to build the header
        match_1 = record.last.first
        match_hash = {'tracing_request_id' => match_1.tr_id,
                      'tr_uuid' => match_1.tracing_request_id,
                      'relation_name' => match_1.tracing_request_relation_name,
                      'inquiry_date' => match_1.tracing_request_inquiry_date,
                      'subform_tracing_request_id' => match_1.tr_subform_id,
                      'subform_tracing_request_name' => match_1.tracing_request_name,
                      'match_details' => format_tr_match_details(record.last)
        }
        match_list << match_hash
      end
      match_list
    end

    def format_tr_match_details(potential_match_list)
      match_details = []
      potential_match_list.each do |potential_match|
        match_detail = {'child_id' => potential_match.child_id,
                        'case_id' => potential_match.case_id,
                        'age' => potential_match.case_age,
                        'sex' => potential_match.case_sex,
                        'registration_date' => potential_match.case_registration_date,
                        'owned_by' => potential_match.case_owned_by,
                        'visible' => potential_match.visible,
                        'average_rating' => potential_match.average_rating
        }
        match_details << match_detail
      end
      match_details
    end

  end

  def self.get_matches_for_tracing_request(param_match)
    tracing_request_id = param_match.split("::").first
    subform_id = param_match.split("::").last
    all_potential_matches = by_tracing_request_id_and_tr_subform_id.key([tracing_request_id, subform_id]).all
    filter_deleted_matches(all_potential_matches)
  end

  def self.filter_deleted_matches(matches)
    matches.select { |m| !m.deleted? }
  end

end
