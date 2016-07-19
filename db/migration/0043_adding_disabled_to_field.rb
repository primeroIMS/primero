parent_forms = ['case', 'incident', 'tracing_request']

parent_forms.each do |parent_form|
  form_sections = FormSection.find_by_parent_form(parent_form)

  form_sections.each do |form_section|
    form_section_modified = false

    form_section.fields.each do |field|

      field_needs_update = field.disabled.nil?

      if field_needs_update
        if !field.editable.nil?
          field.disabled = !field.editable
          form_section_modified = true
        else # assign default values
          field.editable = true
          field.disabled = false
          form_section_modified = true
        end
      end
    end

    if form_section_modified
      form_section.save!
      puts "Updating #{form_section.name.capitalize}"
    else
      puts "Skipping #{form_section.name.capitalize}, already updated!"
    end

  end
end
