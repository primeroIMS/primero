record_data = record.data.compact.select{|k,_| selected_field_names.include?(k)}.to_h
record_data.merge!({'name' => '*******'}) if record.try(:hidden_name) && selected_field_names.include?('name')
json.id record.id
json.merge! record_data
if selected_field_names.include?("photos") && record.photos.count > 0
  json.merge!({ "photos" => record.photos.map{ |photo| rails_blob_path(photo.image, only_path: true) } })
end
if selected_field_names.include?('flag_count')
  json.flag_count record.flag_count
end
