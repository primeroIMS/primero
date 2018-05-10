#TODO: For now leaving CouchRest::Model::Base
#TODO: Inheriting from ApplicationRecord breaks created_at in the Historical Concern for some reason
class PotentialMatch < CouchRest::Model::Base
  use_database :potential_match

  def self.parent_form
    'potential_match'
  end


  include PrimeroModel

  #TODO v1.3: including Record only to fix issues with solr reindex.  Is there a better way?
  #HACK
  include Record

  include Historical
  include Syncable
  include SyncableMobile
  include Importable
  include Ownable


  belongs_to :tracing_request
  belongs_to :child
  property :tr_subform_id
  property :average_rating, Float
  property :aggregate_average_score, Float
  property :likelihood
  property :status, String, :default => 'POTENTIAL'
  property :unique_identifier
  property :short_id
  property :case_id
  property :tr_id
  property :tr_gender
  property :tr_age
  property :child_gender
  property :child_age

  attr_accessor :visible

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
    view :by_short_id,
         :map => "function(doc) {
                  if (doc.hasOwnProperty('short_id'))
                 {
                    emit(doc['short_id'], null);
                 }
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
    string :child_gender
    integer :tr_age
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
    self.short_id ||= self.unique_identifier.last 7
  end

  #Overriding method in searchable concern
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

  def case_age
    if self.child.present?
      self.visible ? self.child.age : FIELD_MASK
    else
      ""
    end
  end

  def case_sex
    sex = self.visible ? self.child.try(:display_field, 'sex') : FIELD_MASK
  end

  def case_registration_date
    registration_date = self.visible ? self.child.try(:registration_date) : FIELD_MASK
  end

  def case_owned_by
    self.child.try(:owned_by)
  end

  def tracing_request_uuid
    self.tracing_request_id
  end

  def tracing_request_inquiry_date
    if self.tracing_request.present?
      self.visible ? self.tracing_request.inquiry_date : FIELD_MASK
    else
      ""
    end
  end

  def tracing_request_relation_name
    relation_name = self.visible ? self.tracing_request.try(:relation_name) : FIELD_MASK
  end

  def tracing_request_name
    name = self.visible ? self.tracing_request.try(:tracing_request_subform_section).try(:select){|tr| tr.unique_id == self.tr_subform_id}.try(:first).try(:name)
                        : FIELD_MASK
  end

  def tracing_request_owned_by
    self.tracing_request.try(:owned_by)
  end

  class << self
    alias :old_all :all
    alias :get_all :all

    def all(*args)
      old_all(*args)
    end

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

    #TODO MATCHING: consider thresholding and normalizing in separate testable methods
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
      return matches
    end

    #TODO MATCHING: Consider passing
    def build_potential_match(child_id, tracing_request_id, score, aggregate_average_score, subform_id, tr_age, tr_sex)
      #TODO: In the old way of doing this, this was invoking find_or_build. But I think we always want to generate a fresh new potential match.
      pm = PotentialMatch.new :tracing_request_id => tracing_request_id, :child_id => child_id, :tr_subform_id => subform_id
      pm.average_rating = score
      pm.set_likelihood(score, aggregate_average_score)
      #TODO MATCHING: This is inefficient - why are we making an extra db call?
      pm.case_id = Child.get_case_id(child_id)
      #TODO MATCHING: This is inefficient - why are we making an extra db call?
      pm.child_age, pm.child_gender = Child.get_case_age_and_gender(child_id)
      pm.tr_age = tr_age
      pm.tr_gender = tr_sex
      #TODO MATCHING: This is inefficient - why are we making an extra db call?
      pm.tr_id = TracingRequest.get_tr_id(tracing_request_id)
      pm.module_id = PrimeroModule::CP
      pm.mark_as_potential_match
      should_mark_deleted = !pm.new? && !pm.deleted?
      if should_mark_deleted
        pm.mark_as_deleted
      end
      return pm
    end

    private

    #TODO MATCHING: This method may no longer be used and will eventually be deleted
    def update_potential_match(child_id, tracing_request_id, score, subform_id, tr_age, tr_sex)
      potantial_match = build_potential_match(child_id, tracing_request_id, score, subform_id, tr_age, tr_sex)
      potential_match.save
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
                        'tr_uuid' => potential_match.tracing_request_uuid,
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
                      'tr_uuid' => match_1.tracing_request_uuid,
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
