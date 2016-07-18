parent_forms = ['case', 'incident', 'tracing_request']

parent_forms.each do |parent_form|
  form_sections = FormSection.find_by_parent_form(parent_form)

    form_sections.each do |fs|
    puts "Analyzing #{fs.name.capitalize}"
      fs.fields.each do |field|
      if !field.editable.nil?
        field.disabled = !field.editable
      end
    end
  end
end
