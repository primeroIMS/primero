#PRIMERO-269
# This fixes records that have dates in an invalid format


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

def fix_date_string key, value, parent_keys, root_element
  if is_a_date_field?(key)
    unless is_date_valid_format?(value)
      puts "PARENTS: #{parent_keys}  #{key}: #{value} is an invalid date format... setting to a default 01-Jan-2000"
      root_element[key] = "01-Jan-2000"
      @record_modified = true
    end
  end
end

def iterate_hash a_hash, parent_keys, root_element
  a_hash.each do |key, value|
    if value.present?
      if value.is_a? Hash
        tmp_parent = []
        tmp_parent += parent_keys
        tmp_parent << key
        iterate_hash value, tmp_parent, root_element[key]
      elsif value.is_a? String
        fix_date_string(key, value, parent_keys, root_element)
      end
    end
  end
end


children = Child.all
children.each do |child|
  puts "Checking for invalid dates for case #{child.short_id}..."

  @record_modified = false

  parent_keys = ['child']
  iterate_hash child, parent_keys, child 

  if @record_modified
    if child.valid?
      puts "Saving changes to case record #{child.short_id}..."
      child.save!
    else
      puts "Case #{child.short_id} still not valid... not saving"
    end
  end
end
