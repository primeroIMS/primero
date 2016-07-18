models = [
 [Child, 'case'],
 [Incident, 'incident'],
 [TracingRequest, 'tracing_request']
]

models.each do |model, parent_form|
  puts "Checking #{parent_form.capitalize.pluralize}"
  form_sections = FormSection.find_by_parent_form(parent_form) # ALL the form sections!

  model.all.all.each do |record|
    record_modified = false
    form_sections.each do |fs|
    	if fs.name == 'Family Details'
    		binding.pry
    		puts fs
    	end
    	fs.fields.each do |field|
    		#if field.type == subform #no need to dive deeper, cause form_sections already has all the nested forms! AWESOME
    		#end
    		#binding.pry
    		puts field.editable
    		if field.editable.present?
    			field.disabled = !field.editable
                #record_modified = true
            end
    	end
    end
  end
end
