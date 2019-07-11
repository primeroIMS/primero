json.id record.id
json.merge! record.data.select{|k,_| selected_field_names.include?(k)}.to_h
if selected_field_names.include?("photos") && record.photos.count > 0
  json.merge!({ "photos" => record.photos.map{ |photo| rails_blob_path(photo.image, only_path: true) } })
end
