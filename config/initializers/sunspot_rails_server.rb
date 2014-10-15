#Sunspot Rails Server hardcoded the log file location. It is actually possible
#to indicate via sunspot.yml the file log location, but it is not read by the server.
#Others properties are read in the same way.
module Sunspot
  module Rails
    class Server
      # 
      # Log file for Solr. File is in the rails log/ directory.
      #
      def log_file
        configuration.log_file
      end
    end
  end
end
