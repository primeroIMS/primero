#PRIMERO-269
# This fixes records that have dates in an invalid format
# and if they do not have a "record_state", add one


def is_a_date_field? aField
  fs = FormSection.get_form_containing_field aField
  return false unless fs.present?
 
  myField = fs.fields.select {|x| x.name == aField}.first
  myField[:type] == "date_field"  
end


def is_date_valid_format? aValue
  begin
    Date.strptime(aValue, '%d-%b-%Y')
    true
  rescue
    false
  end  
end


children = Child.all
children.each do |child|
  puts "Scrubbing old record data for case #{child.short_id}..."
  
  recordModified = false 
  
  #Change / to - to fix old date formats    
  child.each do |key, value|
    if value.present? && is_a_date_field?(key)
      unless is_date_valid_format?(value)
        puts "#{key}: #{value} is an invalid date format... setting to a default 01-Jan-2000"
        child[key] = "01-Jan-2000"
        recordModified = true
      end
    end
  end
  
  #Add a record_state to old records
  unless child[:record_state].present?
    child.merge! record_state: 'Valid record'
    recordModified = true
  end   
  
  if recordModified
    if child.valid?
      puts "Saving changes to case record..."
      child.save!
    else
      puts "Case still not valid... not saving"
    end
  end
end



