# frozen_string_literal: true

# Monkeypatch.

# Sunspot Rails Server hardcoded the log file location. It is actually possible
# to indicate via sunspot.yml the file log location, but it is not read by the server.
# Others properties are read in the same way.
Sunspot::Rails::Server.class_eval do
  # Log file for Solr. File is in the rails log/ directory.
  def log_file
    configuration.log_file
  end
end

# Expose the Rsolr connection for raw Solr manipulations:
# rsolr = Sunspot.session.session.rsolr_connection
Sunspot::Session.class_eval do
  def rsolr_connection
    connection
  end
end
