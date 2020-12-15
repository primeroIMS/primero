# frozen_string_literal: true

# rubocop:disable Style/ClassAndModuleChildren
# Monkeypatch.
module Sunspot
  module Rails
    # Sunspot Rails Server hardcoded the log file location. It is actually possible
    # to indicate via sunspot.yml the file log location, but it is not read by the server.
    # Others properties are read in the same way.
    class Server
      # Log file for Solr. File is in the rails log/ directory.
      def log_file
        configuration.log_file
      end
    end
  end

  # Expose the Rsolr connection for raw Solr manipulations:
  # rsolr = Sunspot.session.session.rsolr_connection
  class Session
    def rsolr_connection
      connection
    end
  end
end
# rubocop:enable Style/ClassAndModuleChildren
