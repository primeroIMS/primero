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

  after_save :find_match_cases unless (Rails.env == 'production')

  def initialize *args
    self['photo_keys'] ||= []
    arguments = args.first

    if arguments.is_a?(Hash) && arguments["current_photo_key"]
      self['current_photo_key'] = arguments["current_photo_key"]
      arguments.delete("current_photo_key")
    end

    self['histories'] = []
    super *args
  end

  design do
    view :by_tracing_request_id
    view :by_relation_name,
         :map => "function(doc) {
                if (doc['couchrest-type'] == 'TracingRequest')
               {
                  if (!doc.hasOwnProperty('duplicate') || !doc['duplicate']) {
                    emit(doc['relation_name'], null);
                  }
               }
            }"
    view :by_ids_and_revs,
         :map => "function(doc) {
              if (doc['couchrest-type'] == 'TracingRequest'){
                emit(doc._id, {_id: doc._id, _rev: doc._rev});
              }
            }"
  end

  def self.quicksearch_fields
    [
        'tracing_request_id', 'short_id', 'relation_name', 'relation_nickname', 'tracing_names', 'tracing_nicknames',
        'monitor_number', 'survivor_code'
    ]
  end

  include Searchable #Needs to be after ownable

  searchable do
    form_matchable_fields.select { |field| TracingRequest.exclude_match_field(field) }.each do |field|
      text field, :boost => TracingRequest.get_field_boost(field)
    end

    subform_matchable_fields.select { |field| TracingRequest.exclude_match_field(field) }.each do |field|
      text field, :boost => TracingRequest.get_field_boost(field) do
        self.tracing_request_subform_section.map { |fds| fds[:"#{field}"] }.compact.uniq.join(' ') if self.try(:tracing_request_subform_section)
      end
    end

  end

  class << self
    def match_results(results)
      match_result=[]
      results.each do |r|
        result = r.tracing_request_subform_section.map{|s| [['tracing_request_id', (r.tracing_request_id || '')], ['tr_uuid', (r._id || '')],
                                                            ['relation_name', (r.relation_name || '')], ['inquiry_date', (r.inquiry_date || '')],
                                                            ['subform_tracing_request_id', s.unique_id], ['subform_tracing_request_name', s.name],
                                                            ['match_details', []]].to_h}
        match_result += result
      end
      match_result
    end

    #TODO v1.3: can this be refactored further?
    def all_match_details(match_results=[], potential_matches=[], associated_user_names)
      for match_result in match_results
        count = 0
        for potential_match in potential_matches
          if potential_match["tr_id"] == match_result["tracing_request_id"] && potential_match["tr_subform_id"] == match_result["subform_tracing_request_id"]
            match_detail = {}
            match_detail["child_id"] = potential_match.child_id
            child = Child.get(potential_match.child_id)
            if child.present?
              match_detail["case_id"] = potential_match.case_id
              match_detail["age"] = is_match_visible?(child.owned_by, associated_user_names) ? child.age : "***"
              match_detail["sex"] = is_match_visible?(child.owned_by, associated_user_names) ? child.sex : "***"
              match_detail["registration_date"] = is_match_visible?(child.owned_by, associated_user_names) ? child.registration_date : "***"
              match_detail["owned_by"] = child.owned_by
              match_detail["visible"] = is_match_visible?(child.owned_by, associated_user_names)
              match_detail["average_rating"] =potential_match.average_rating
              match_result["match_details"] << match_detail
              count += 1
            end
          end
        end
        match_result["match_details"] = match_result["match_details"].sort_by { |hash| -hash["average_rating"] }
                                            .first(20)
      end
      compact_result match_results
      sort_hash match_results
    end
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
        'multistring' => ['associated_user_names'],
        'date' => ['inquiry_date']
    }
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
    self['inquiry_status'] ||= "Open"
  end

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

  alias :inherited_match_criteria :match_criteria
  def match_criteria(match_request=nil)
    match_criteria = inherited_match_criteria(match_request)
    if match_request.present?
      TracingRequest.subform_matchable_fields.each do |field|
        match_criteria[:"#{field}"] = (match_request[:"#{field}"].is_a? Array) ? match_request[:"#{field}"].join(' ') : match_request[:"#{field}"]
      end
    end
    match_criteria.compact
  end

  def self.match_tracing_requests_for_case(case_id, tracing_request_ids)
    results = []
    TracingRequest.by_id(:keys => tracing_request_ids).all.each { |tr| results.concat(tr.find_match_cases(case_id)) }
    results
  end

  def self.get_tr_id(tracing_request_id)
    tr_id=""
    by_ids_and_revs.key(tracing_request_id).all.each do |tr|
      tr_id = tr.tracing_request_id
    end
    tr_id
  end

end
