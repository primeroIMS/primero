module Security
  module SessionSecret
    class << self

      def session_secret
        fetch || create
      end

      def fetch
        doc = database.get("session_secret") rescue nil
        #Verify if the doc contains the new format
        if doc && doc["value"] && doc["value"]["token"] && doc["value"]["key_base"]
          doc["value"]
        else
          #Delete current doc because does not apply the new format.
          database.delete_doc doc if doc
          #Returns null in order to create the document with the new format.
          nil
        end
      end

      def generate
        UUIDTools::UUID.random_create.to_s
      end

      def create
        secret_value = {"token" => generate, "key_base" => generate}
        begin
          database.save_doc("_id" => "session_secret", "value" => secret_value)
        rescue Errno::ECONNREFUSED
          nil
        else
          secret_value
        end
      end

      def database
        COUCHDB_SERVER.database! "#{COUCHDB_CONFIG[:db_prefix]}_session_secret_#{COUCHDB_CONFIG[:db_suffix]}"
      end

      def env
        Rails.env
      end

    end
  end
end
