def convert_multi_string(record, field, keys)
  property = record.value_for_attr_keys(keys)

  if property.present? && property.is_a?(Array)
    selected_options = []
    property.each{|c| selected_options << field['option_strings_text_en'].select{ |o| o['display_text'] == c }}
    record.set_value_for_attr_keys(keys, selected_options.flatten.collect{ |option| option['id']}) if selected_options.present?
  end
end

def get_multi_select_fields(form)
  return form.fields.select{ |f| f.multi_select == true && f.option_strings_text_en.is_a?(Array) }
end

models = [
 [Child, 'case'],
 [Incident, 'incident'],
 [TracingRequest, 'tracing_request']
]

models.each do |model, parent_form|
  puts "Checking #{parent_form.capitalize.pluralize}"
  form_section = FormSection.find_by_parent_form(parent_form)

  model.all.all.each do |record|
    record_modified = false
    form_section.each do |fs|
      if fs.form_group_name == 'Violations'
        fields = get_multi_select_fields(fs.fields.first.subform_section)
        fields.each do |field|
          violations = record.value_for_attr_keys [fs.form_group_name.downcase, fs.fields.first.name]
          if violations.present?
            violations.each_with_index do |v, i|
              keys = [fs.form_group_name.downcase, fs.fields.first.name, i, field.name]
              convert_multi_string(record, field, keys)
              record_modified = true
            end
          end
        end
      elsif fs.is_nested?
        fields = get_multi_select_fields(fs)
        if fields.present?
          fields.each do |field|
            subform_items = record.value_for_attr_keys [fs.section_name] unless fs.section_name.nil?
            if subform_items.present?
              subform_items.each_with_index do |s, i|
                keys = [fs.section_name, i, field.name]
                convert_multi_string(record, field, keys)
                record_modified = true
              end
            end
          end
        end
      else
        fields = get_multi_select_fields(fs)
        if fields.present?
          fields.each do |field|
            keys = [field.name]
            convert_multi_string(record, field, keys)
            record_modified = true
          end
        end
      end
    end

    if record_modified
      puts "Updating #{parent_form.capitalize} #{record.id}..."
      record.save!
    end
  end
end