parent_forms = ['case', 'incident', 'tracing_request']

parent_forms.each do |parent_form|
  form_sections = FormSection.find_by_parent_form(parent_form)

  form_sections.each do |form_section|
    form_section_modified = false

    form_section.fields.select { |f| f.disabled.nil? }.each do |field|

      form_section_modified = true
      if !field.editable.nil?
        field.disabled = !field.editable
      else # assign default values
        field.editable = true
        field.disabled = false
      end
    end

    if form_section_modified
      puts "Updating #{form_section.name.capitalize}"
      form_section.save!
    end

  end
end
