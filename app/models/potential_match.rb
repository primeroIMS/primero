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
  property :average_rating, Float
  property :status, String, :default => 'POTENTIAL'
  property :unique_identifier
  property :short_id
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

  include Sunspot::Rails::Searchable

  searchable do
    string :status
    double :average_rating

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

  def create_identification
    self.unique_identifier ||= UUIDTools::UUID.random_create.to_s
    self.short_id ||= self.unique_identifier.last 7
  end

  class << self
    alias :old_all :all
    alias :get_all :all

    def all(*args)
      old_all(*args)
    end

    def update_matches_for_tracing_request(tracing_request_id, subform_id, results, child_id=nil)
      if child_id.nil?
        by_tracing_request_id_and_tr_subform_id.key([tracing_request_id, subform_id]).all.each do |pm|
          unless results.include? pm.child_id
            pm.mark_as_deleted
            pm.save
          end
        end
      end

      unless results.empty?
        results.each { |child_id, score| update_potential_match(child_id, tracing_request_id, score.to_f, subform_id) }
      end
    end

    def update_matches_for_child(child_id, results)
      tr_subform_ids = results.map{ |result| result[:tr_subform_id] }.uniq
      by_child_id.key(child_id).all.each do |pm|
        unless tr_subform_ids.include? pm.tr_subform_id
          pm.mark_as_deleted
          pm.save
        end
      end

      unless results.empty?
        results.each { |result| update_potential_match(child_id, result[:tracing_request_id], result[:score].to_f, result[:tr_subform_id]) }
      end
    end

    private

    def update_potential_match(child_id, tracing_request_id, score, subform_id)
      threshold = 0
      pm = find_or_build tracing_request_id, child_id, subform_id
      pm.average_rating = score
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

  def self.list_records(filters={}, sort={:created_at => :desc}, pagination={}, associated_user_names=[], query=nil, match={})
    self.search do
      if filters.present?
        PotentialMatch.build_filters(self, filters)
      end
      if match.blank? && associated_user_names.present? && associated_user_names.first != ALL_FILTER
        any_of do
          associated_user_names.each do |user_name|
            with(:associated_user_names, user_name)
          end
        end
      end
      if query.present?
        fulltext(query.strip) do
          minimum_match(1)
          fields(*self.quicksearch_fields)
        end
      end
      sort.each{|sort_field,order| order_by(sort_field, order)}
      paginate pagination
    end
  end

  def self.build_filters(sunspot, filters)
    sunspot.instance_eval do
      filters.each do |filter, filter_value|
        values = filter_value[:value]
        type = filter_value[:type]
        any_of do
          case type
            when 'list'
              with(filter).any_of(values)
            when 'neg'
              without(filter, values)
            else
              with(filter, values) unless values == 'all'
          end
        end
      end
    end
  end

end
