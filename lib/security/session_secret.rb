module Security
  module SessionSecret
    class << self

      def secret_token
        fetch || create
      end

      def fetch
        database.get("session_secret")["value"]   rescue nil
      end

      def generate
        UUIDTools::UUID.random_create.to_s
      end

      def create
        secret_value = generate
        database.save_doc "_id" => "session_secret", "value" => secret_value
        secret_value
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
