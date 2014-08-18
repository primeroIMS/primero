class Incident < CouchRest::Model::Base
  use_database :incident

  include RapidFTR::Model
  include RapidFTR::CouchRestRailsBackward

  include SearchableRecord

  property :incident_id
  property :description

  def initialize *args 
    self['histories'] = []
    super *args
  end

  design do
    view :by_incident_id
    view :by_description,
              :map => "function(doc) {
                  if (doc['couchrest-type'] == 'Incident')
                 {
                    if (!doc.hasOwnProperty('duplicate') || !doc['duplicate']) {
                      emit(doc['description'], doc);
                    }
                 }
              }"

    #TODO - move this to record concern
      ['created_at', 'description', 'name'].each do |field|
        view "by_all_view_with_created_by_#{field}",
                :map => "function(doc) {
                    var fDate = doc['#{field}'];
                    if (doc['couchrest-type'] == 'Incident')
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
                    if (doc['couchrest-type'] == 'Incident')
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
                    if (doc['couchrest-type'] == 'Incident')
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
                    if (doc['couchrest-type'] == 'Incident')
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
                    if (doc['couchrest-type'] == 'Incident' && doc['record_state'] == 'Valid record')
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
                    if (doc['couchrest-type'] == 'Incident' && doc['record_state'] == 'Invalid record')
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
                    if (doc['couchrest-type'] == 'Incident' && doc['record_state'] == 'Valid record')
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
                    if (doc['couchrest-type'] == 'Incident' && doc['record_state'] == 'Invalid record')
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
                    if (doc['couchrest-type'] == 'Incident' && doc['record_state'] == 'Valid record')
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
                    if (doc['couchrest-type'] == 'Incident' && doc['record_state'] == 'Invalid record')
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

  def self.find_by_incident_id(incident_id)
    by_incident_id(:key => incident_id).first
  end

  def self.all 
    view('by_description', {})
  end 

  def self.search_field
    "description"
  end

  def self.view_by_field_list
    ['created_at', 'description']
  end

  def createClassSpecificFields(fields)
    self['incident_id'] = self.incident_id
    self['description'] = fields['description'] || self.description || ''
  end

  def incident_id
    self['unique_identifier']
  end

  def incident_code
    (self['unique_identifier'] || "").last 7
  end

  def violations_list
    violations_list = []

    if self['violations'].present?
      self['violations'].each do |key, value|
        value.each do |k, v|
          if v['violation_id'].present?
            violations_list << key.titleize + " " + v['violation_id'] + " " + k
          else
            violations_list << key.titleize + " " + k
          end
        end
      end
    end

    if violations_list.blank?
      violations_list << "NONE"
    end

    return violations_list
  end
end
