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
  property :status, String, :default => 'POTENTIAL'
  property :unique_identifier
  property :short_id
  property :case_id
  property :tr_id
  property :tr_gender
  property :tr_age
  property :child_gender
  property :child_age

  validates :child_id, :uniqueness => {:scope => :tr_subform_id}

  before_create :create_identification

  ALL_FILTER = 'all'
  POTENTIAL = 'POTENTIAL'
  DELETED = 'DELETED'

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

  def self.searchable_date_fields
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

    private

    def update_potential_match(child_id, tracing_request_id, score, subform_id, tr_age, tr_sex)
      threshold = 0
      pm = find_or_build tracing_request_id, child_id, subform_id
      pm.average_rating = score
      pm.case_id = Child.get_case_id(child_id)
      pm.child_age, pm.child_gender = Child.get_case_age_and_gender(child_id)
      pm.tr_age = tr_age
      pm.tr_gender = tr_sex
      pm.tr_id = TracingRequest.get_tr_id(tracing_request_id)
      pm.module_id = PrimeroModule::CP
      valid_score = score >= threshold
      should_mark_deleted = !valid_score && !pm.new? && !pm.deleted?
      if should_mark_deleted
        pm.mark_as_deleted
        pm.save
      elsif valid_score
        pm.mark_as_potential_match
        pm.save
      end
    end

    def find_or_build(tracing_request_id, child_id, subform_id)
      potential_match = by_child_id_and_tr_subform_id.key([child_id, subform_id]).first
      return potential_match unless potential_match.nil?
      PotentialMatch.new :tracing_request_id => tracing_request_id, :child_id => child_id, :tr_subform_id => subform_id
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
