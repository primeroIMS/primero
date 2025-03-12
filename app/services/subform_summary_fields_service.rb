# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# This service retrieves the summary fields. The query is optionally cached.
class SubformSummaryFieldsService
  attr_accessor :with_cache

  def self.instance
    new(Rails.configuration.use_app_cache)
  end

  alias with_cache? with_cache

  def initialize(with_cache = false)
    self.with_cache = with_cache
  end

  def subform_summary_fields_from_cache(record_type, force = false)
    # The assumption here is that the cache will be updated if any changes took place to Fields
    max_updated_at = Field.maximum(:updated_at).as_json
    cache_key = "subform_summary_fields_service/fields/#{max_updated_at}/#{record_type}"
    Rails.cache.fetch(cache_key, expires_in: 48.hours, force:) do
      subform_summary_fields_from_forms(record_type).to_a
    end
  end

  def subform_summary_fields(record_type)
    if with_cache?
      subform_summary_fields_from_cache(record_type)
    else
      subform_summary_fields_from_forms(record_type)
    end
  end

  def subform_summary_fields_from_forms(record_type)
    Field.joins(:form_section)
         .where(form_section: { parent_form: record_type }, visible: true)
         .where.not(subform_summary: nil)
  end
end
