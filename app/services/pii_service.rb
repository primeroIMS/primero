# frozen_string_literal: true

# A service that connects to Presidio and detects and scrubs PII
# TODO: This is POC-grade code and should be made efficient in prod.
#       At least use ApiConnector::Connection or better yet build a Connector
#       English is hardcoded
class PiiService
  REDACTED_VALUE = '********'
  LANGUAGE = 'en'
  HEADERS = {
    'Content-Type' => 'application/json',
    'cache-control' => 'no-cache'
  }.freeze

  def anonymizers(analysis)
    analysis.to_h do |fragment|
      [fragment['entity_type'], { 'type' => 'replace', 'new_value' => REDACTED_VALUE }]
    end
  end

  def analyze(text)
    Rails.logger.info "Calling PII analyzer #{Rails.application.config.x.pii_analyzer_url}"
    response = Faraday.post(Rails.application.config.x.pii_analyzer_url, { text:, language: LANGUAGE }.to_json, HEADERS)
    JSON.parse(response.body) if response.status == 200
  rescue JSON::ParserError, Faraday::ConnectionFailed
    nil
  end

  # rubocop:disable Metrics/AbcSize
  def anonymize(text, analysis)
    anonymize_request = { text:, anonymizers: anonymizers(analysis), analyzer_results: analysis }

    Rails.logger.info "Calling PII anonymizer #{Rails.application.config.x.pii_anonymizer_url}"
    response = Faraday.post(Rails.application.config.x.pii_anonymizer_url, anonymize_request.to_json, HEADERS)
    return text unless response.status == 200

    response_text = JSON.parse(response.body)['text']
    response_text.present? ? response_text : text
  rescue JSON::ParserError, Faraday::ConnectionFailed
    text
  end
  # rubocop:enable Metrics/AbcSize

  def scrub(text)
    analysis = analyze(text)
    anonymize(text, analysis)
  end
end
