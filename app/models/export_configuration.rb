# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Allows certain types of exporter (UNHCR, IR) to be configured for each implementation
class ExportConfiguration < ApplicationRecord
  include LocalizableJsonProperty
  include ConfigurationRecord

  localize_properties :name

  validate :valid_record_type

  def valid_record_type
    return true if %w[Child TracingRequest Incident].include?(record_type)

    errors.add(:record_type, I18n.t('errors.models.export_configuration.record_type'))
  end
end
