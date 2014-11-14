def get_form_section(form)
  FormSection.find_by_parent_form(form).map { |fs|
                fs.fields.select { |f|
                  f.multi_select == true && f.option_strings_text_en.is_a?(Array)
                }
              }.flatten
end

models = [
 [Child, 'case'],
 [Incident, 'incident'],
 [TracingRequest, 'tracing_request']
]

models.each do |model, parent_form|
  puts "Checking #{parent_form.capitalize.pluralize}"
  form_section = get_form_section(parent_form)
  model.all.all.each do |record|
    record_modified = false
    form_section.each do |form|
      if !record[form.name].nil? && record[form.name].is_a?(Array) && !record[form.name].empty?
        selected_options = []
        record[form.name].each{|c| selected_options << form['option_strings_text_en'].select{ |o| o['display_text'] == c }}
        record.send("#{form.name}=", selected_options.flatten.collect{ |option| option['id']}) unless selected_options.empty?
        record_modified = true
      end
    end

    if record_modified
      if record.valid?
        record.save!
        puts "#{parent_form.capitalize} #{record.id}: saved"
      else
        puts "#{parent_form.capitalize} #{record.id}: is invalid"
      end
    end
  end
end