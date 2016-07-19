parent_forms = ['case', 'incident', 'tracing_request']

parent_forms.each do |parent_form|
  form_sections = FormSection.find_by_parent_form(parent_form)

  form_sections.each do |form_section|
    form_section_modified = false

    form_section.fields.each do |field|

      field_needs_update = field.disabled.nil?

      if field_needs_update
        form_section_modified = true
        if !field.editable.nil?
          field.disabled = !field.editable
        else # assign default values
          field.editable = true
          field.disabled = false
        end
      end
    end

    if form_section_modified
      puts "Updating #{form_section.name.capitalize}"
      form_section.save!
    else
      puts "Skipping #{form_section.name.capitalize}, already updated!"
    end

  end
end
