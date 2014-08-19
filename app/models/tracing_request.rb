class TracingRequest < CouchRest::Model::Base
  use_database :tracing_request

  include RapidFTR::Model
  include RapidFTR::CouchRestRailsBackward
  
  property :tracing_request_id
  property :enquirer_name

  def initialize *args 
    self['histories'] = []
    super *args
  end

  #TODO views probably will be replaced by Solr query.
  design do
    view :by_tracing_request_id
    view :by_enquirer_name,
            :map => "function(doc) {
                if (doc['couchrest-type'] == 'TracingRequest')
               {
                  if (!doc.hasOwnProperty('duplicate') || !doc['duplicate']) {
                    emit(doc['enquirer_name'], doc);
                  }
               }
            }"

    #TODO current index page needs these views to work, but this will change per Solr changes.
    ['created_at', 'enquirer_name'].each do |field|
      view "by_all_view_with_created_by_#{field}",
              :map => "function(doc) {
                  var fDate = doc['#{field}'];
                  if (doc['couchrest-type'] == 'TracingRequest')
                  {
                    emit(['all', doc['created_by'], fDate], doc);
                    if (doc.hasOwnProperty('flag') && (doc['flag'] == 'true' || doc['flag'] == true)) {
                      emit(['flag', doc['created_by'], fDate], doc);
                    }
                    if (doc.hasOwnProperty('reunited')) {
                      if (doc['reunited'] == 'true' || doc['reunited'] == true) {
                        emit(['reunited', doc['created_by'], fDate], doc);
                      } else {
                        emit(['active', doc['created_by'], fDate], doc);
                      }
                    } else {
                      emit(['active', doc['created_by'], fDate], doc);
                    }
                 }
              }"

      view "by_all_view_#{field}",
              :map => "function(doc) {
                  var fDate = doc['#{field}'];
                  if (doc['couchrest-type'] == 'TracingRequest')
                  {
                    emit(['all', fDate], doc);
                    if (doc.hasOwnProperty('flag') && (doc['flag'] == 'true' || doc['flag'] == true)) {
                      emit(['flag', fDate], doc);
                    }

                    if (doc.hasOwnProperty('reunited')) {
                      if (doc['reunited'] == 'true' || doc['reunited'] == true) {
                        emit(['reunited', fDate], doc);
                      } else {
                       if (!doc.hasOwnProperty('duplicate') && !doc['duplicate']) {
                        emit(['active', fDate], doc);
                      }
                      }
                    } else {
                       if (!doc.hasOwnProperty('duplicate') && !doc['duplicate']) {
                                      emit(['active', fDate], doc);
                    }
                    }
                 }
              }"

      view "by_all_view_#{field}_count",
              :map => "function(doc) {
                  if (doc['couchrest-type'] == 'TracingRequest')
                 {
                    emit(['all', doc['created_by']], 1);
                    if (doc.hasOwnProperty('flag') && (doc['flag'] == 'true' || doc['flag'] == true)) {
                      emit(['flag', doc['created_by']], 1);
                    }
                    if (doc.hasOwnProperty('reunited')) {
                      if (doc['reunited'] == 'true' || doc['reunited'] == true) {
                        emit(['reunited', doc['created_by']], 1);
                      } else {
                        emit(['active', doc['created_by']], 1);
                      }
                    } else {
                      emit(['active', doc['created_by']], 1);
                    }
                 }
              }"

      view "by_all_view_with_created_by_#{field}_count",
              :map => "function(doc) {
                  if (doc['couchrest-type'] == 'TracingRequest')
                 {
                    emit(['all', doc['created_by']], 1);
                    if (doc.hasOwnProperty('flag') && (doc['flag'] == 'true' || doc['flag'] == true)) {
                      emit(['flag', doc['created_by']], 1);
                    }
                    if (doc.hasOwnProperty('reunited')) {
                      if (doc['reunited'] == 'true' || doc['reunited'] == true) {
                        emit(['reunited', doc['created_by']], 1);
                      } else {
                        emit(['active', doc['created_by']], 1);
                      }
                    } else {
                      emit(['active', doc['created_by']], 1);
                    }
                 }
              }"
      view "by_valid_record_view_#{field}",
              :map => "function(doc) {
                  var fDate = doc['#{field}'];
                  if (doc['couchrest-type'] == 'TracingRequest' && doc['record_state'] == 'Valid record')
                  {
                    emit(['all', fDate], doc);
                    if (doc.hasOwnProperty('flag') && (doc['flag'] == 'true' || doc['flag'] == true)) {
                      emit(['flag', fDate], doc);
                    }

                    if (doc.hasOwnProperty('reunited')) {
                      if (doc['reunited'] == 'true' || doc['reunited'] == true) {
                        emit(['reunited', fDate], doc);
                      } else {
                       if (!doc.hasOwnProperty('duplicate') && !doc['duplicate']) {
                        emit(['active', fDate], doc);
                      }
                      }
                    } else {
                       if (!doc.hasOwnProperty('duplicate') && !doc['duplicate']) {
                                      emit(['active', fDate], doc);
                    }
                    }
                 }
              }"

      view "by_invalid_record_view_#{field}",
              :map => "function(doc) {
                  var fDate = doc['#{field}'];
                  if (doc['couchrest-type'] == 'TracingRequest' && doc['record_state'] == 'Invalid record')
                  {
                    emit(['all', fDate], doc);
                    if (doc.hasOwnProperty('flag') && (doc['flag'] == 'true' || doc['flag'] == true)) {
                      emit(['flag', fDate], doc);
                    }

                    if (doc.hasOwnProperty('reunited')) {
                      if (doc['reunited'] == 'true' || doc['reunited'] == true) {
                        emit(['reunited', fDate], doc);
                      } else {
                       if (!doc.hasOwnProperty('duplicate') && !doc['duplicate']) {
                        emit(['active', fDate], doc);
                      }
                      }
                    } else {
                       if (!doc.hasOwnProperty('duplicate') && !doc['duplicate']) {
                                      emit(['active', fDate], doc);
                    }
                    }
                 }
              }"

      view "by_valid_record_view_#{field}_count",
              :map => "function(doc) {
                  if (doc['couchrest-type'] == 'TracingRequest' && doc['record_state'] == 'Valid record')
                 {
                    emit(['all', doc['created_by']], 1);
                    if (doc.hasOwnProperty('flag') && (doc['flag'] == 'true' || doc['flag'] == true)) {
                      emit(['flag', doc['created_by']], 1);
                    }
                    if (doc.hasOwnProperty('reunited')) {
                      if (doc['reunited'] == 'true' || doc['reunited'] == true) {
                        emit(['reunited', doc['created_by']], 1);
                      } else {
                        emit(['active', doc['created_by']], 1);
                      }
                    } else {
                      emit(['active', doc['created_by']], 1);
                    }
                 }
              }"

      view "by_invalid_record_view_#{field}_count",
              :map => "function(doc) {
                  if (doc['couchrest-type'] == 'TracingRequest' && doc['record_state'] == 'Invalid record')
                 {
                    emit(['all', doc['created_by']], 1);
                    if (doc.hasOwnProperty('flag') && (doc['flag'] == 'true' || doc['flag'] == true)) {
                      emit(['flag', doc['created_by']], 1);
                    }
                    if (doc.hasOwnProperty('reunited')) {
                      if (doc['reunited'] == 'true' || doc['reunited'] == true) {
                        emit(['reunited', doc['created_by']], 1);
                      } else {
                        emit(['active', doc['created_by']], 1);
                      }
                    } else {
                      emit(['active', doc['created_by']], 1);
                    }
                 }
              }"

    view "by_valid_record_view_with_created_by_#{field}_count",
              :map => "function(doc) {
                  if (doc['couchrest-type'] == 'TracingRequest' && doc['record_state'] == 'Valid record')
                 {
                    emit(['all', doc['created_by']], 1);
                    if (doc.hasOwnProperty('flag') && (doc['flag'] == 'true' || doc['flag'] == true)) {
                      emit(['flag', doc['created_by']], 1);
                    }
                    if (doc.hasOwnProperty('reunited')) {
                      if (doc['reunited'] == 'true' || doc['reunited'] == true) {
                        emit(['reunited', doc['created_by']], 1);
                      } else {
                        emit(['active', doc['created_by']], 1);
                      }
                    } else {
                      emit(['active', doc['created_by']], 1);
                    }
                 }
              }"
      view "by_invalid_record_view_with_created_by_#{field}_count",
              :map => "function(doc) {
                  if (doc['couchrest-type'] == 'TracingRequest' && doc['record_state'] == 'Invalid record')
                 {
                    emit(['all', doc['created_by']], 1);
                    if (doc.hasOwnProperty('flag') && (doc['flag'] == 'true' || doc['flag'] == true)) {
                      emit(['flag', doc['created_by']], 1);
                    }
                    if (doc.hasOwnProperty('reunited')) {
                      if (doc['reunited'] == 'true' || doc['reunited'] == true) {
                        emit(['reunited', doc['created_by']], 1);
                      } else {
                        emit(['active', doc['created_by']], 1);
                      }
                    } else {
                      emit(['active', doc['created_by']], 1);
                    }
                 }
              }"
    end
  end

  def self.find_by_tracing_request_id(tracing_request_id)
    by_tracing_request_id(:key => tracing_request_id).first
  end

  #TODO will this be refactored by Solr changes ?
  def self.all 
    view('by_enquirer_name', {})  
  end 

  #TODO will this be refactored by Solr changes ?
  def self.search_field
    "enquirer_name"
  end

  #TODO will this be refactored by Solr changes ?
  def self.view_by_field_list
    ['created_at', 'enquirer_name']
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
