#PRIMERO-549
#Look for any multi-select fields that are not of type array
#If any exist, remove those fields
[[Child, 'case'],
 [Incident, 'incident'],
 [TracingRequest, 'tracing_request']].each do |(model, parent_form)|
  fields_to_check = FormSection.all_visible_form_fields(parent_form).select {|f| f.multi_select?}

  model.all.rows.map {|r| model.database.get(r["id"]) }.each do |inst|
    fields_to_check.each do |field|
      field_name = field.name
      if !(inst[field_name].is_a?(Array))
        inst.delete(field_name)
        puts "Deleted key #{field_name} from #{model.name} #{inst['_id']}"
        inst.save
      end
    end
  end
end
