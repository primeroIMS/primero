# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.id primero_module.id
json.unique_id primero_module.unique_id
json.name primero_module.name
json.description primero_module.description
json.associated_record_types primero_module.associated_record_types
json.form_section_unique_ids primero_module.form_section_unique_ids
json.creation_field_map primero_module.creation_field_map
json.field_map IncidentCreationService.new(primero_module:).field_map
json.module_options primero_module.module_options
json.list_filters primero_module.record_list_filters
json.list_headers primero_module.record_list_headers
json.options primero_module.module_options # TODO: Change the front end to use the 'module_options' key above
json.approvals_labels FieldI18nService.to_localized_values(primero_module.approvals_labels_i18n)
unless [PrimeroModule::MRM, PrimeroModule::GBV].include?(primero_module.unique_id)
  json.workflows do
    if primero_module.workflow_status_indicator
      ['case'].each do |record_type|
        record_class = PrimeroModelService.to_model(record_type)
        json.set! record_type do
          json.merge! FieldI18nService.convert_options(record_class.workflow_statuses(primero_module))
        end
      end
    end
  end
end
