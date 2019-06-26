json.data do
  json.array! @permitted_forms do |form|
    json.partial! 'api/v2/form_sections/form_section', form: form
  end
end
