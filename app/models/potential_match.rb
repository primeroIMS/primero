class PotentialMatch < CouchRest::Model::Base
  use_database :potential_match

  def self.parent_form
    'potential_match'
  end

  include PrimeroModel
  include Historical
  include Syncable
  include SyncableMobile
  include Importable

  belongs_to :tracing_request
  belongs_to :child
  property :tr_subform_id
  property :score, String
  property :status, String, :default => 'POTENTIAL'
  property :unique_identifier
  property :short_id
  validates :child_id, :uniqueness => {:scope => :tr_subform_id}

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
    ['child_id', 'tracing_request_id', 'tr_subform_id']
  end

  def self.searchable_date_fields
    ["created_at", "last_updated_at"]
  end

  include Sunspot::Rails::Searchable

  searchable do
    string :status
    quicksearch_fields.each {|f| text f}
    searchable_date_fields.each {|f| date f}

    Sunspot::Adapters::InstanceAdapter.register DocumentInstanceAccessor, self
    Sunspot::Adapters::DataAccessor.register DocumentDataAccessor, self
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

  class << self
    alias :old_all :all
    alias :get_all :all

    def all(*args)
      old_all(*args)
    end

    def update_matches_for_tracing_request(tracing_request_id, subform_id, results)
      by_tracing_request_id_and_tr_subform_id.key([tracing_request_id, subform_id]).all.each do |pm|
        unless results.include? pm.child_id
          pm.mark_as_deleted
          pm.save
        end
      end

      unless results.empty?
        results.each { |child_id, score| update_potential_match(child_id, tracing_request_id, score.to_f, subform_id) }
      end
    end

    def update_matches_for_child(child_id, results)
      by_child_id.key(child_id).all.each do |pm|
        unless results.include? pm.tracing_request_id
          pm.mark_as_deleted
          pm.save
        end
      end

      unless results.empty?
        results.each { |tracing_request_id, score| update_potential_match(child_id, tracing_request_id, score.to_f)}
      end
    end

    private
    def update_potential_match(child_id, tracing_request_id, score, subform_id=nil)
      threshold = 0
      pm = find_or_build tracing_request_id, child_id, subform_id
      pm.tr_subform_id = subform_id if pm.tr_subform_id.nil?
      pm.score = score
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

    def find_or_build(tracing_request_id, child_id, subform_id=nil)
      potential_match = {}
      potential_match = by_child_id_and_tr_subform_id.key([child_id, subform_id]).first unless subform_id.nil?
      if potential_match.nil? || potential_match.empty?
        potential_match = by_tracing_request_id_and_child_id.key([tracing_request_id, child_id]).first
      else
        subform_id = potential_match.tr_subform_id
      end
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
