# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# This service handles computing the permitted fields for a given role,
# based on the forms associated with that role. The query is optionally cached.
# The similarly named PermittedFieldService uses this service to compuyte the full list of permitted fields
class PermittedFormFieldsService
  attr_accessor :fields, :field_names, :with_cache

  def self.instance
    new(Rails.configuration.use_app_cache)
  end

  def initialize(with_cache = false)
    self.with_cache = with_cache
  end

  def rebuild_cache(roles, record_type, writeable, force = false)
    return unless force || fields.nil?

    # The assumption here is that the cache will be updated if any changes took place to Forms, or Roles
    role_keys = roles.map(&:cache_key_with_version)
    cache_key = "permitted_form_fields_service/#{role_keys.join('/')}/#{record_type}/#{writeable}"
    self.fields = Rails.cache.fetch(cache_key, expires_in: 48.hours) do
      permitted_fields_from_forms(roles, record_type, writeable).to_a
    end
    # TODO: This can be cached too
    self.field_names = fields.map(&:name).uniq
  end

  # TODO: Constrain to only allow API data updates on the following types:
  #       TEXT_FIELD, TEXT_AREA, RADIO_BUTTON, SELECT_BOX, NUMERIC_FIELD, DATE_FIELD, SUBFORM, TICK_BOX
  def permitted_fields_from_forms(roles, record_type, writeable, visible_only = false)
    permission_level = writeable ? FormPermission::PERMISSIONS[:read_write] : writeable
    fields = Field.includes(subform: :fields).joins(form_section: :roles).where(
      fields: {
        form_sections: { roles: { id: roles }, parent_form: record_type, visible: (visible_only || nil) }.compact
      }
    )
    if writeable
      fields = fields.where(fields: { form_sections: { form_sections_roles: { permission: permission_level } } })
    end
    fields
  end

  alias with_cache? with_cache

  def permitted_fields(roles, record_type, writeable)
    if with_cache?
      rebuild_cache(roles, record_type, writeable)
      fields
    else
      permitted_fields_from_forms(roles, record_type, writeable).to_a
    end
  end

  def permitted_field_names(roles, record_type, writeable)
    if with_cache?
      rebuild_cache(roles, record_type, writeable)
      field_names
    else
      permitted_fields_from_forms(roles, record_type, writeable).map(&:name).uniq
    end
  end
end
