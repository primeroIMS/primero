class TracingRequest < CouchRest::Model::Base
  use_database :tracing_request

  include PrimeroModel
  include Primero::CouchRestRailsBackward

  include Record
  include Ownable
  include PhotoUploader
  include AudioUploader
  include Flaggable

  after_save :find_matching_children

  property :tracing_request_id
  property :relation_name
  property :reunited, TrueClass

  FORM_NAME = 'tracing_request'


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

  def match_criteria(match_request)
    match_criteria = {}

    if match_request.present?
      match_request.each { |key, value| match_criteria[key] = value }
    end

    fields = Array.new(FormSection.all_visible_form_fields(TracingRequest::FORM_NAME, false)).keep_if { |field| is_filled_in?(field) && field.type != 'subform'}
    fields.each { |field| match_criteria[field.name] = self[field.name] }
    match_criteria.select do |key, value|
      if value.is_a?(Array)
        !value.empty?
      else
        !value.nil?
      end
    end
  end
end
