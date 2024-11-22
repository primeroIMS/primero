# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Pulls together the record data for presentation in the JSON API
# rubocop:disable Metrics/ClassLength
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
    data = select_service_section(data, record, selected_field_names, user)
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
    data = embed_family_members_user_access(data, record, selected_field_names, user)
    embed_family_info(data, record, selected_field_names, user)
  end

  def select_fields(data, selected_field_names)
    data.select { |k, _| selected_field_names.include?(k) }
  end

  def embed_user_scope(data, record, selected_field_names, user)
    return data unless selected_field_names.include?('record_in_scope')

    data['record_in_scope'] = user.can?(:read, record)
    data
  end

  def select_service_section(data, record, selected_field_names, user)
    return data unless record.is_a?(Child)

    return data if record&.services_section.blank? || !selected_field_names.include?('services_section')

    data['services_section'] = if should_filter_services?(record, user)
                                 filter_services_by_user(record.services_section, user)
                               else
                                 record.services_section
                               end

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
    return data unless (selected_field_names & %w[photos photo]).present?

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

  def embed_family_info(data, record, selected_field_names, user = nil)
    return data unless record.is_a?(Child)

    data['family_id'] = record.family_id if selected_field_names.include?('family_id')
    data['family_member_id'] = record.family_member_id if selected_field_names.include?('family_member_id')
    data = embed_family_details(data, record, selected_field_names)
    embed_family_details_section(data, record, selected_field_names, user)
  end

  def embed_family_details(data, record, selected_field_names)
    field_names = selected_field_names & FamilyLinkageService::GLOBAL_FAMILY_FIELDS
    field_names.each do |field_name|
      data[field_name] = record.family.present? ? record.family.data[field_name] : data[field_name]
    end
    data
  end

  def embed_family_details_section(data, record, selected_field_names, user)
    return data unless selected_field_names.include?('family_details_section')

    data['family_details_section'] = calculate_family_member_record_user_access(
      record.family_members_details, record.family&.cases_grouped_by_id, user
    )
    data
  end

  def embed_family_members_user_access(data, record, selected_field_names, user)
    return data unless record.is_a?(Family) && selected_field_names.include?('family_members')

    data['family_members'] = calculate_family_member_record_user_access(
      data['family_members'], record.cases_grouped_by_id, user
    )
    data
  end

  def embed_associations_as_data(data, record, selected_field_names, current_user)
    return data unless (record.associations_as_data_keys & selected_field_names).present?

    data.merge(record.associations_as_data(current_user).select { |key| selected_field_names.include?(key) })
  end

  def embed_case_data(data, record, selected_field_names)
    return data unless record.instance_of?(Incident) && record.incident_case_id.present?

    data['incident_case_id'] = record.incident_case_id if selected_field_names.include?('incident_case_id')
    data['case_id_display'] = record.case_id_display if selected_field_names.include?('case_id_display')
    data
  end

  def embed_incident_data(data, record, selected_field_names)
    return data unless record.instance_of?(Incident)

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
    # NOTE: For now we are choosing to discard computed nil values to avoid inserting nil data acccessor values.
    #       Revisit if we want to always display nils for certain computed fields.
    computed_data = record.slice(*computed_fields).compact
    data.merge(computed_data)
  end

  private

  def attachment_field_names
    @attachment_field_names ||= Field.binary.pluck(:name)
  end

  def calculate_family_member_record_user_access(family_members, cases_grouped_by_id, user)
    return family_members if family_members.blank? || user.blank?

    family_members.each do |family_member|
      family_member_record = cases_grouped_by_id&.dig(family_member['case_id'])&.first
      next if family_member_record.blank?

      family_member['can_read_record'] = user.can_read_record?(
        family_member_record
      )
    end
  end

  # Check if the record is not owned by the current user and if the user has the SERVICE_OWN_ENTRIES_ONLY permission
  def should_filter_services?(record, user)
    return false if record.owner?(user) || user.admin_query_scope?

    user.role.service_own_entries_only?
  end

  def filter_services_by_user(services, user)
    services.select do |service|
      user.user_name == service['service_implementing_agency_individual']
    end
  end
end
# rubocop:enable Metrics/ClassLength
