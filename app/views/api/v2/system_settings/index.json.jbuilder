json.data do
  json.merge! @system_setting.as_json
  if @agencies.present?
    json.agencies do
      json.array! @agencies do |agency|
        json.unique_id agency.id
        json.name agency.name
        if agency.logo_small.attachment.present? || agency.logo_large.attachment.present?
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
        json.unique_id primero_module.unique_id
        json.name primero_module.name
        json.associated_record_types primero_module.associated_record_types
        json.options primero_module.module_options
      end
    end
  end
end.compact!
 