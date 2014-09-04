
[[Child, 'case'],
 [Incident, 'incident'],
 [TracingRequest, 'tracing_request']].each do |(model, parent_form)|
  form_sections_to_check = FormSection.find_by_parent_form(parent_form).select {|fs| fs.is_nested}

  model.all.rows.map {|r| model.database.get(r["id"]) }.each do |inst|
    form_sections_to_check.each do |form_section|
      uid = form_section.unique_id
      if inst[uid].is_a?(String) && inst[uid] == ''
        inst.delete(uid)
        inst.save
      end
    end
  end
end
