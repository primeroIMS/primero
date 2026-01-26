# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# This service computes the permitted values for the given fields
class PermittedFieldValuesService
  attr_accessor :with_cache

  def self.instance
    new(Rails.configuration.use_app_cache)
  end

  def initialize(with_cache = false)
    self.with_cache = with_cache
  end

  def permitted_field_values(fields)
    parent_fields = fields.reject { |field| field&.form_section&.is_nested? }
    values_for_fields(parent_fields, fetch_lookups)
  end

  def values_for_fields(fields, lookups)
    fields.each_with_object({}) do |field, memo|
      if field.subform.present?
        memo[field.subform.unique_id] = values_for_fields(field.subform.fields, lookups)
      else
        memo[field.name] = values_for_field(field, lookups)
      end
    end
  end

  def values_for_field(field, lookups)
    return [] unless field.lookup? || field.option_strings_text.present?

    field.options_list(locale: I18n.locale, lookups:).map { |option| option['id'] }
  end

  def fetch_lookups
    return fetch_lookups_from_cache if with_cache

    Lookup.all.to_a
  end

  def fetch_lookups_from_cache(force = false)
    # The assumption here is that the cache will be updated if any changes took place to Lookup
    max_updated_at = Lookup.maximum(:updated_at).as_json
    cache_key = "permitted_field_values_service/lookups/#{max_updated_at}"
    Rails.cache.fetch(cache_key, expires_in: 48.hours, force:) do
      Lookup.all.to_a
    end
  end
end
