Records = [Child, TracingRequest, Incident];

puts 'Migrating (i81n): Records'

form_sections = FormSection.all.rows.map {|r| FormSection.database.get(r["id"]) }

Records.each do |record_type|
  record_type.all.rows.map {|r| record_type.database.get(r["id"]) }.each do |record|
    # form_sections.each do |fs|
    #   fs[fields].each do |field|
    #     if ['select_box', 'tick_box', 'tally_field'].include?(field[:type])
    #       binding.pry; x = 0;
    #     end
    #   end
    # end
  end
end