json.data do
  json.merge! complete_locales_for(['welcome_email_text_i18n'], @system_setting.attributes.except('id'))
  if @agencies.present?
    json.agencies do
      json.array! @agencies do |agency|
        json.unique_id agency.unique_id
        json.name agency.name
        if agency.logo_enabled && (agency.logo_small.attachment.present? || agency.logo_large.attachment.present?)
          json.logo do
            json.small rails_blob_path(agency.logo_small, only_path: true) if agency.logo_small.attachment.present?
            json.large rails_blob_path(agency.logo_large, only_path: true) if agency.logo_large.attachment.present?
          end.compact!
        end
      end
    end
  end
  if @primero_modules.present?
    json.modules do
      json.array! @primero_modules do |primero_module|
        json.id primero_module.id
        json.unique_id primero_module.unique_id
        json.name primero_module.name
        json.associated_record_types primero_module.associated_record_types
        json.options primero_module.module_options
        #For now only CP case is supported, but the structure can be extended
        if primero_module.unique_id == PrimeroModule::CP
          json.workflows do
            if primero_module.workflow_status_indicator
              ['case'].each do |record_type|
                record_class = Record::model_from_name(record_type)
                json.set! record_type do
                  json.merge! record_class.workflow_statuses([primero_module] )
                end
              end
            end
          end
        end
      end
    end
  end
end.compact!
