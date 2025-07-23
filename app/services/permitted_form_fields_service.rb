# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# This service handles computing the permitted fields for a given role,
# based on the forms associated with that role. The query is optionally cached.
# The similarly named PermittedFieldService uses this service to compute the full list of permitted fields
class PermittedFormFieldsService
  attr_accessor :with_cache

  PERMITTED_WRITEABLE_FIELD_TYPES = [
    Field::TEXT_FIELD, Field::TEXT_AREA, Field::RADIO_BUTTON, Field::TICK_BOX,
    Field::SELECT_BOX, Field::NUMERIC_FIELD, Field::DATE_FIELD,
    Field::AUDIO_UPLOAD_BOX, Field::PHOTO_UPLOAD_BOX, Field::DOCUMENT_UPLOAD_BOX,
    Field::SUBFORM, Field::TALLY_FIELD, Field::CALCULATED
  ].freeze

  # TODO: Primero is assuming that these forms exist in the configuration.
  PERMITTED_SUBFORMS_FOR_ACTION = {
    Permission::ADD_NOTE => 'notes_section',
    Permission::INCIDENT_DETAILS_FROM_CASE => 'incident_details',
    Permission::SERVICES_SECTION_FROM_CASE => 'services_section'
  }.freeze

  UPDATE_FORBIDDEN = %w[id unique_identifier unique_id short_id created_at created_by].freeze

  UPDATE_FORBIDDEN_BY_TYPE = {
    case: %w[case_id case_id_display].freeze,
    incident: %w[incident_id incident_id_display].freeze,
    tracing_request: %w[tracing_request_id tracing_request_id_display].freeze,
    registry_record: %w[registry_id registry_id_display].freeze,
    family: %w[family_id family_id_display].freeze
  }.with_indifferent_access.freeze

  def self.instance
    new(Rails.configuration.use_app_cache)
  end

  def initialize(with_cache = false)
    self.with_cache = with_cache
  end

  def generate_cache_key(roles, record_type, module_unique_id, action_name)
    role_keys = roles.map(&:cache_key_with_version)

    # The assumption here is that the cache will be updated if any changes took place to Forms, or Roles
    "permitted_form_fields_service/#{role_keys.join('/')}/#{module_unique_id}/#{record_type}/#{action_name}"
  end

  def permitted_fields_from_cache(roles, record_type, module_unique_id, action_name, force = false)
    cache_key = generate_cache_key(roles, record_type, module_unique_id, action_name)

    Rails.cache.fetch(cache_key, expires_in: 48.hours, force:) do
      permitted_fields_from_forms(roles, record_type, module_unique_id, action_name).to_a
    end
  end

  def permitted_field_names_from_cache(roles, record_type, module_unique_id, action_name, force = false)
    cache_key = generate_cache_key(roles, record_type, module_unique_id, action_name)

    Rails.cache.fetch("#{cache_key}/names", expires_in: 48.hours, force:) do
      permitted_fields_from_cache(roles, record_type, module_unique_id, action_name, force).map(&:name).uniq
    end
  end

  def permitted_fields_from_forms(roles, record_type, module_unique_id, action_name, visible_only = false)
    fields = fetch_filtered_fields(roles, record_type, module_unique_id, visible_only)
    return fields unless writeable?(action_name)

    fields = filter_writeable_fields(fields, permission_level(writeable?(action_name)), record_type, module_unique_id)
    fields = filter_create_only_fields(fields, record_type, action_name)
    action_subform_fields = permitted_subforms_from_actions(roles, record_type)
    append_action_subform_fields(fields, action_subform_fields, record_type, module_unique_id)
  end

  alias with_cache? with_cache

  def permitted_fields(roles, record_type, module_unique_id, writeable)
    if with_cache?
      permitted_fields_from_cache(roles, record_type, module_unique_id, writeable)
    else
      permitted_fields_from_forms(roles, record_type, module_unique_id, writeable).to_a
    end
  end

  def permitted_field_names(roles, record_type, module_unique_id, action_name)
    if with_cache?
      permitted_field_names_from_cache(roles, record_type, module_unique_id, action_name)
    else
      permitted_fields_from_forms(roles, record_type, module_unique_id, action_name).map(&:name).uniq
    end
  end

  def permitted_subforms_from_actions(roles, record_type)
    roles = [roles].flatten
    roles.map do |role|
      PERMITTED_SUBFORMS_FOR_ACTION.select { |k, _v| role.permits?(record_type, k) }.values
    end.flatten.uniq
  end

  private

  def writeable?(action_name)
    action_name.in?(%w[create update])
  end

  def permission_level(writeable)
    writeable ? FormPermission::PERMISSIONS[:read_write] : writeable
  end

  def eagerloaded_fields
    Field.includes(subform: :fields).left_outer_joins(form_section: %i[roles primero_modules])
  end

  def fetch_filtered_fields(roles, record_type, module_unique_id, visible_only)
    eagerloaded_fields.where(
      fields: {
        form_sections: {
          roles: { id: roles },
          visible: visible_only || nil,
          parent_form: record_type
        }.compact.merge(module_unique_id.present? ? { primero_modules: { unique_id: module_unique_id } } : {})
      }
    )
  end

  def filter_writeable_fields(fields, permission_level, record_type, module_unique_id)
    fields.where(
      fields: {
        form_sections: {
          form_sections_roles: { permission: permission_level },
          primero_modules: { unique_id: module_unique_id }, parent_form: record_type
        },
        type: PERMITTED_WRITEABLE_FIELD_TYPES,
        subform_summary: nil
      }
    )
  end

  def filter_create_only_fields(fields, record_type, action_name)
    return fields if action_name == 'create'

    forbidden_fields = UPDATE_FORBIDDEN + UPDATE_FORBIDDEN_BY_TYPE[record_type]
    fields.where.not(name: forbidden_fields)
  end

  def append_action_subform_fields(fields, action_subform_fields, record_type, module_unique_id)
    return fields unless action_subform_fields.present?

    fields.or(
      eagerloaded_fields.where(
        name: action_subform_fields,
        type: Field::SUBFORM,
        form_sections: { primero_modules: { unique_id: module_unique_id }, parent_form: record_type }
      )
    )
  end
end
