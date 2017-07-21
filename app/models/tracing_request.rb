class TracingRequest < CouchRest::Model::Base
  use_database :tracing_request

  include PrimeroModel
  include Primero::CouchRestRailsBackward

  include Record
  include Ownable
  include PhotoUploader
  include AudioUploader
  include Flaggable

  property :tracing_request_id
  property :relation_name
  property :reunited, TrueClass


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
  end

  def self.quicksearch_fields
    [
      'tracing_request_id', 'short_id', 'relation_name', 'relation_nickname', 'tracing_names', 'tracing_nicknames',
      'monitor_number', 'survivor_code'
    ]
  end
  include Searchable #Needs to be after ownable

  searchable do
    string :status do
      self.tracing_request_status
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
      'multistring' => ['associated_user_names', 'owned_by_groups'],
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

  def match_request(subform_id)
    self.tracing_request_subform_section.select{|tr| tr.unique_id == subform_id}.first
  end

  def match_criteria(subform_id)
    match_request = self.match_request(subform_id)
    match_criteria = {}

    if match_request.present?
      match_criteria[:name] = match_request.try(:name)
      match_criteria[:name_nickname] = match_request.try(:name_nickname)
      match_criteria[:sex] = match_request.try(:sex)
      match_criteria[:date_of_birth] = match_request.try(:date_of_birth)

      match_criteria[:language] = self.try(:relation_language)
      match_criteria[:religion] = self.try(:relation_religion)
      match_criteria[:nationality] = self.try(:relation_nationality)
      match_criteria[:relation] = self.try(:relation)

      match_criteria[:ethnicity] = []
      match_criteria[:ethnicity].push(self.try(:relation_ethnicity), self.try(:relation_sub_ethnicity1), self.try(:relation_sub_ethnicity2))
      match_criteria[:ethnicity].uniq!
      match_criteria[:ethnicity].compact!
    end

    return match_criteria
  end
end
