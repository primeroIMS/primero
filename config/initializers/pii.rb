# frozen_string_literal: true

Rails.application.config.x.pii_analysis_enabled =
  ActiveRecord::Type::Boolean.new.cast(ENV.fetch('PRIMERO_PII_ANALYSIS_ENABLED', false))
Rails.application.config.x.pii_analyzer_url = ENV.fetch('PRIMERO_PII_ANALYZER_URL', nil)
Rails.application.config.x.pii_anonymizer_url = ENV.fetch('PRIMERO_PII_ANONYMIZER_URL', nil)

unless Rails.application.config.x.pii_analyzer_url.present? && Rails.application.config.x.pii_anonymizer_url.present?
  Rails.application.config.x.pii_analysis_enabled = false
end
