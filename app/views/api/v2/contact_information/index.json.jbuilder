json.data do
  json.merge! @contact_information.attributes.except('id')
  json.system_version @system_settings.primero_version
end.compact!