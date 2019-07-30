json.data do
  json.merge! @system_setting.as_json
  json.agencies do
    json.array! @agencies do |agency|
      json.name agency.name
      if agency.logo_small.attachment.present? || agency.logo_large.attachment.present?
        json.logo do
          json.small agency.logo_small.attachment
          json.large agency.logo_large.attachment
        end.compact!
      end
    end
  end
  json.modules do
    json.array! @primero_modules do |primero_module|
      json.unique_id primero_module.unique_id
      json.name primero_module.name
      json.associated_record_types primero_module.associated_record_types
      json.options primero_module.module_options
    end
  end
end

 