# Primero-31
# Add order to agencies

agencies = Agency.all.all
agencies.each do |agency|
  record_modified = false

  if !agency['order'].present? || agency['order'] == 0
    agency.update_attributes(order: 1)
    record_modified = true
  end

  if record_modified
    if agency.valid?
      puts "Saving changes to agency..."
      agency.save!
    else
      puts "agency still not valid... not saving"
    end
  end
end