# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

json.id primero_module.id
json.unique_id primero_module.unique_id
json.name primero_module.name
json.description primero_module.description
json.associated_record_types primero_module.associated_record_types
json.form_section_unique_ids primero_module.form_section_unique_ids
json.field_map IncidentCreationService.new(primero_module:).field_map
json.module_options primero_module.module_options
json.options primero_module.module_options # TODO: Change the front end to use the 'module_options' key above
unless [PrimeroModule::MRM, PrimeroModule::GBV].include?(primero_module.unique_id)
  json.workflows do
    if primero_module.workflow_status_indicator
      ['case'].each do |record_type|
        record_class = Record.model_from_name(record_type)
        json.set! record_type do
          json.merge! FieldI18nService.convert_options(record_class.workflow_statuses([primero_module]))
        end
      end
    end
  end
end
