json.id record.id
json.merge! record.data.compact.select{|k,_| selected_field_names.include?(k)}.to_h