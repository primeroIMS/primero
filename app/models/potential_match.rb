class PotentialMatch < CouchRest::Model::Base
  !use_database :potential_match

  include PrimeroModel

  belongs_to :tracing_request
  belongs_to :child
  property :score, String
  property :status, String, :default => 'POTENTIAL'
  timestamps!
  validates :child_id, :uniqueness => {:scope => :tracing_request_id}

  POTENTIAL = 'POTENTIAL'
  DELETED = 'DELETED'

  design do
    view :by_tracing_request_id
    view :by_child_id
    view :by_tracing_request_id_and_child_id
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
    self[:status] = status
  end

  def marked_as?(status)
    self[:status] == status
  end

  class << self
    def update_matches_for_tracing_request(tracing_request_id, results)
      results.each { |child_id, score| update_potential_match(child_id, tracing_request_id, score.to_f) }
    end

    private

    def update_potential_match(child_id, tracing_request_id, score)
      threshold = 1
      pm = find_or_build tracing_request_id, child_id
      pm.score = score
      valid_score = score >= threshold
      should_mark_deleted = !valid_score && !pm.new? && !pm.deleted?
      if should_mark_deleted
        pm.mark_as_deleted
        pm.save
      elsif valid_score
        pm.mark_as_potential_match if pm.deleted?
        pm.save
      end
    end

    def find_or_build(tracing_request_id, child_id)
      potential_match = by_tracing_request_id_and_child_id.key([tracing_request_id, child_id]).first
      return potential_match unless potential_match.nil?
      PotentialMatch.new :tracing_request_id => tracing_request_id, :child_id => child_id
    end
  end

end
