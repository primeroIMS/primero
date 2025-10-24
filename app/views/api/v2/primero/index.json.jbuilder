# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# rubocop:disable Metrics/BlockLength
json.data do
  json.sandbox_ui Rails.configuration.sandbox_ui
  json.config_ui Rails.configuration.config_ui
  json.allow_self_registration Rails.configuration.allow_self_registration
  json.locales I18n.available_locales
  json.webpush_enabled Rails.configuration.x.webpush.enabled
  json.agencies do
    json.array!(@agencies_with_system_logos) do |agency|
      json.unique_id agency.unique_id
      json.name agency.name
      json.logo_full rails_blob_path(agency.logo_full, only_path: true) if agency&.logo_full&.attached?
      json.logo_icon rails_blob_path(agency.logo_icon, only_path: true) if agency&.logo_icon&.attached?
    end
  end
  json.agencies_logo_options do
    json.array!(@agencies_with_logo_options) do |agency|
      json.unique_id agency.unique_id
      json.name agency.name
      json.logo_full rails_blob_path(agency.logo_full, only_path: true) if agency&.logo_full&.attached?
      json.logo_icon rails_blob_path(agency.logo_icon, only_path: true) if agency&.logo_icon&.attached?
    end
  end

  json.registration_streams(@system_options&.[]('registration_streams')&.map do |stream|
    { id: stream['unique_id'] }
  end || [])
  json.registration_streams_link_labels @system_options&.[]('registration_streams_link_labels_i18n') || {}
  json.registration_streams_consent_text @system_options&.[]('registration_streams_consent_text_i18n') || {}

  if Rails.configuration.x.captcha_provider.present?
    json.captcha do
      json.provider Rails.configuration.x.captcha_provider
      json.site_key Rails.configuration.x.captcha[:site_key]
    end
  end
end.compact!
# rubocop:enable Metrics/BlockLength
