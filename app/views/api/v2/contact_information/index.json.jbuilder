# frozen_string_literal: true

json.data do
  json.merge! @contact_information.attributes.except('id')
  json.system_version @system_settings.primero_version
  json.agencies do
    json.array!(@agencies_with_logos) do |agency|
      json.unique_id agency.unique_id
      json.name agency.name
      json.logo_full = rails_blob_path(agency.logo_full, only_path: true)
      json.logo_icon = rails_blob_path(agency.logo_icon, only_path: true)
    end
  end
end.compact!