class TracingRequest < CouchRest::Model::Base
  use_database :tracing_request

  include RapidFTR::Model
  include RapidFTR::CouchRestRailsBackward

  include Record
  include Searchable
  include Ownable

  property :tracing_request_id
  property :relation_name

  def initialize *args
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
                    emit(doc['relation_name'], doc);
                  }
               }
            }"
  end

  def self.find_by_tracing_request_id(tracing_request_id)
    by_tracing_request_id(:key => tracing_request_id).first
  end

  def self.search_field
    "relation_name"
  end

  def self.view_by_field_list
    ['created_at', 'relation_name']
  end

  def create_class_specific_fields(fields)
    self['tracing_request_id'] = self.tracing_request_id
    self['inquiry_date'] ||= DateTime.now.strftime("%d-%b-%Y")
    self['inquiry_status'] ||= "Open"
  end

  def tracing_request_id
    self['unique_identifier']
  end
end
