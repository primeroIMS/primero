# frozen_string_literal: true

# Instantiates incidents based on a case and some mapping rules
class IncidentCreationService < ValueObject
  DEFAULT_MAPPING = [
    { source: 'survivor_code_no', target: 'survivor_code' },
    { source: 'age', 'target' => 'age' },
    { source: 'date_of_birth', target: 'date_of_birth' },
    { source: 'sex', target: 'sex' },
    { source: 'gbv_ethnicity', target: 'ethnicity' },
    { source: 'country_of_origin', target: 'country_of_origin' },
    { source: 'gbv_nationality', target: 'nationality' },
    { source: 'gbv_religion', target: 'religion' },
    { source: 'maritial_status', target: 'maritial_status' }, # TODO: Spelling, was this fixed?
    { source: 'gbv_displacement_status', target: 'displacement_status' },
    { source: 'gbv_disability_type', target: 'disability_type' },
    { source: 'unaccompanied_separated_status', target: 'unaccompanied_separated_status' }
  ].map(&:with_indifferent_access).freeze

  attr_writer :primero_module

  def self.incident_from_case(case_record, incident_data = {}, module_id = nil, user = nil)
    IncidentCreationService.new.incident_from_case(case_record, incident_data, module_id, user)
  end

  def self.copy_from_case(incident, case_record, module_id = nil)
    return unless incident && case_record

    IncidentCreationService.new.copy_from_case(incident, case_record, module_id)
  end

  def incident_from_case(case_record, incident_data, module_id, user)
    module_id ||= case_record.module_id
    incident_data['id'] = incident_data.delete('unique_id')
    incident = Incident.new_with_user(user, incident_data)
    copy_from_case(incident, case_record, module_id)
    incident.incident_case_id ||= case_record.id
    incident
  end

  def copy_from_case(incident, case_record, module_id)
    field_mapping(module_id).each do |map|
      incident.data[map['target']] ||= case_record.data[map['source']]
    end
    incident.module_id = map_to_module_id(module_id)
    incident.owned_by = case_record&.owned_by
  end

  def field_mapping(module_id = nil)
    field_map_for_module(module_id)&.[]('fields') || DEFAULT_MAPPING
  end

  def map_to_module_id(module_id = nil)
    field_map_for_module(module_id)&.[]('map_to') || module_id || primero_module&.unique_id
  end

  def field_map_for_module(module_id)
    return @field_map_for_module if @field_map_for_module

    @field_map_for_module ||= primero_module(module_id)&.field_map
  end

  def field_map
    {
      'fields' => field_mapping,
      'map_to' => map_to_module_id
    }
  end

  def primero_module(module_id = nil)
    return @primero_module if @primero_module
    return unless module_id

    @primero_module ||= PrimeroModule.find_by(unique_id: module_id)
  end
end
