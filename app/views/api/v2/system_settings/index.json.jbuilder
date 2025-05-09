# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

code_of_conduct = CodeOfConduct.current

# rubocop:disable Metrics/BlockLength
json.data do
  json.merge! FieldI18nService.fill_keys(['welcome_email_text_i18n'],
                                         @system_setting.attributes.except('id', 'approvals_labels_i18n',
                                                                           'default_locale', 'locales'))
  json.locale I18n.locale
  json.default_locale I18n.default_locale
  json.rtl_locales @system_setting.rtl_locales
  json.reporting_location_config current_user.role.reporting_location_config
  json.approvals_labels FieldI18nService.to_localized_values(@system_setting.approvals_labels_i18n)
  json.export_require_password ZipService.require_password?
  json.system_options @system_setting.system_options
                                     .merge('maximum_attachments_per_record' =>
                                            @system_setting.maximum_attachments_per_record)
  json.audit_log do
    json.actions AuditLog::ACTIONS
    json.record_types AuditLog::RECORD_TYPES
  end
  if code_of_conduct
    json.code_of_conduct do
      json.partial! 'api/v2/codes_of_conduct/code_of_conduct', code_of_conduct:
    end
  end
  if @agencies.present?
    json.agencies do
      json.array! @agencies do |agency|
        json.partial! 'api/v2/agencies/agency', agency:
      end
    end
  end
  if @primero_modules.present?
    json.modules do
      json.array! @primero_modules do |primero_module|
        json.partial! 'api/v2/primero_modules/primero_module', primero_module:
      end
    end
  end
end.compact!
# rubocop:enable Metrics/BlockLength
