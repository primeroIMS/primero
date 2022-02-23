# frozen_string_literal: true

# Pulls together the record data for presentation in the JSON API
class RecordDataService
  COMPUTED_FIELDS = %w[sync_status synced_at current_care_arrangements_type current_name_caregiver
                       current_care_arrangement_started_date tracing_names].freeze
  CENSORED_VALUE = '*******'

  def self.data(record, user, selected_field_names)
    new.data(record, user, selected_field_names)
  end

  def self.visible_name(record)
    record.try(:hidden_name) ? CENSORED_VALUE : record.try(:name)
  end

  def data(record, user, selected_field_names)
    data = select_fields(record.data, selected_field_names)
    data = embebed_data(data, record, selected_field_names, user)
    data = embed_photo_metadata(data, record, selected_field_names)
    data = embed_attachments(data, record, selected_field_names)
    data = embed_associations_as_data(data, record, selected_field_names, user)
    data['last_updated_at'] = record.last_updated_at
    embed_computed_fields(data, record, selected_field_names)
  end

  def embebed_data(data, record, selected_field_names, user)
    data = embed_case_data(data, record, selected_field_names)
    data = embed_incident_data(data, record, selected_field_names)
    data = embed_user_scope(data, record, selected_field_names, user)
    data = embed_hidden_name(data, record, selected_field_names)
    data = embed_flag_metadata(data, record, selected_field_names)
    data = embed_alert_metadata(data, record, selected_field_names)
    data = embed_registry_record_info(data, record, selected_field_names)
    data
  end

  def select_fields(data, selected_field_names)
    data.select { |k, _| selected_field_names.include?(k) }
  end

  def embed_user_scope(data, record, selected_field_names, user)
    return data unless selected_field_names.include?('record_in_scope')

    data['record_in_scope'] = user.can?(:read, record)
    data
  end

  def embed_hidden_name(data, record, selected_field_names)
    return data unless selected_field_names.include?('name')

    data['name'] = RecordDataService.visible_name(record)
    data
  end

  def embed_flag_metadata(data, record, selected_field_names)
    return data unless selected_field_names.include?('flag_count')

    data['flag_count'] = record.flag_count
    data
  end

  def embed_photo_metadata(data, record, selected_field_names)
    return data unless selected_field_names.include?('photos')

    data['photo'] = record.photo_url
    data
  end

  def embed_attachments(data, record, selected_field_names)
    field_names = attachment_field_names & selected_field_names
    return data unless field_names.present?

    attachments = record.attachments
    field_names.each do |field_name|
      for_field = attachments.select { |a| a.field_name == field_name }
      data[field_name] = for_field.map(&:to_h_api)
    end
    data
  end

  def embed_alert_metadata(data, record, selected_field_names)
    return data unless selected_field_names.include?('alert_count')

    data['alert_count'] = record.alert_count
    data
  end

  def embed_registry_record_info(data, record, selected_field_names)
    return data unless selected_field_names.include?('registry_record_id')

    data['registry_record_id'] = record.registry_record_id
    data
  end

  def embed_associations_as_data(data, record, selected_field_names, current_user)
    return data unless (record.associations_as_data_keys & selected_field_names).present?

    data.merge(record.associations_as_data(current_user).select { |key| selected_field_names.include?(key) })
  end

  def embed_case_data(data, record, selected_field_names)
    return data unless record.class == Incident && record.incident_case_id.present?

    data['incident_case_id'] = record.incident_case_id if selected_field_names.include?('incident_case_id')
    data['case_id_display'] = record.case_id_display if selected_field_names.include?('case_id_display')
    data
  end

  def embed_incident_data(data, record, selected_field_names)
    return data unless record.class == Incident

    if selected_field_names.include?('incident_date_derived')
      data['incident_date_derived'] = record.incident_date_derived
    end
    data['violation_category'] = record.violation_category || [] if selected_field_names.include?('violation_category')
    data
  end

  def embed_computed_fields(data, record, selected_field_names)
    # NOTE: sync status fields will cause an N+1 query if queried for multiple records. We don't need to solve that yet.
    # TODO: Dynamically figuring out computed fields makes lots of unnecessary queries. Would be nice though.
    # computed_fields = (record.methods.map(&:to_s) - data.keys)
    computed_fields = COMPUTED_FIELDS & selected_field_names
    # Note: For now we are choosing to discard computed nil values to avoid inserting nil data acccessor values.
    #       Revisit if we want to always display nils for certain computed fields.
    computed_data = record.slice(*computed_fields).compact
    data.merge(computed_data)
  end

  private

  def attachment_field_names
    @attachment_field_names ||= Field.binary.pluck(:name)
  end
end
