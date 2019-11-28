class RecordDataService

  def self.data(record, user, selected_field_names)
    data = record.data
    data = select_fields(data, selected_field_names)
    data = embed_user_scope(data, record, selected_field_names, user)
    data = embed_hidden_name(data, record, selected_field_names)
    data = embed_flag_metadata(data, record, selected_field_names)
    data = embed_photo_metadata(data, record, selected_field_names)
    data
  end

  def self.select_fields(data, selected_field_names)
    data.compact_deep
        .select { |k, _| selected_field_names.include?(k) }
  end

  def self.embed_user_scope(data, record, selected_field_names, user)
    return data unless selected_field_names.include?('record_in_scope')

    data['record_in_scope'] = user.can?(:read, record)
    data
  end

  def self.embed_hidden_name(data, record, selected_field_names)
    return data unless record.try(:hidden_name) && selected_field_names.include?('name')

    data['name'] = '*******'
    data
  end

  def self.embed_flag_metadata(data, record, selected_field_names)
    return data unless (selected_field_names.include?('flag_count') || selected_field_names.include?('alert_count'))

    data['alert_count'] = record.alert_count
    data['flag_count'] = record.flag_count
    data
  end

  def self.embed_photo_metadata(data, record, selected_field_names)
    return data unless selected_field_names.include?('photos') && record.try(:photos) && record.photos.count.positive?

    data['photos'] = record.photos.map do |photo|
      Rails.application.routes.url_helpers.rails_blob_path(photo.image, only_path: true)
    end
    data
  end

end