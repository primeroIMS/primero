ActiveSupport.parse_json_times = true

# Usage of parse_json_times and the retrevial of active storage attachments do
# not work. This is potentially a bug in rails. ActiveSupport::Messages::Metadata.expired_at
# is in the incorrect format. It should be a string date format, but is
# ActiveSupport::TimeWithZone instead. This causes Time.iso8601(@expires_at) in
# ActiveSupport::Messages::Metadata.fresh? to throw a `no implicit conversion of
# ActiveSupport::TimeWithZone into String` exception. ActiveSupport.parse_json_times
# is globally parsing all json dates including ActiveSupport::Messages::Metadata.expired_at
# which shouldn't not be parsed.
module ActiveSupport
  module Messages
    class Metadata
      private

      def self.extract_metadata(message)
        data = JSON.decode(message) rescue nil

        if data.is_a?(Hash) && data.key?("_rails")
          expiry = data['_rails']['exp']

          if expiry.is_a?(ActiveSupport::TimeWithZone)
            expiry = expiry.iso8601
          end

          new(decode(data["_rails"]["message"]), expiry, data["_rails"]["pur"])
        else
          new(message)
        end
      end
    end
  end
end
