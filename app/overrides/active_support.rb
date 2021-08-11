# frozen_string_literal: true

# Usage of parse_json_times and the retrevial of active storage attachments do
# not work. This is potentially a bug in rails. ActiveSupport::Messages::Metadata.expired_at
# is in the incorrect format. It should be a string date format, but is
# ActiveSupport::TimeWithZone instead. This causes Time.iso8601(@expires_at) in
# ActiveSupport::Messages::Metadata.fresh? to throw a `no implicit conversion of
# ActiveSupport::TimeWithZone into String` exception. ActiveSupport.parse_json_times
# is globally parsing all json dates including ActiveSupport::Messages::Metadata.expired_at
# which shouldn't not be parsed.

# rubocop:disable Metrics/AbcSize
# rubocop:disable Metrics/MethodLength
ActiveSupport::Messages::Metadata.class_eval do
  def self.extract_metadata(message)
    data = begin
             ActiveSupport::JSON.decode(message)
           rescue StandardError
             nil
           end
    if data.is_a?(Hash) && data.key?('_rails')
      expiry = data['_rails']['exp']
      expiry = expiry.iso8601 if expiry.is_a?(ActiveSupport::TimeWithZone)

      new(decode(data['_rails']['message']), expiry, data['_rails']['pur'])
    else
      new(message)
    end
  end
end
# rubocop:enable Metrics/AbcSize
# rubocop:enable Metrics/MethodLength
