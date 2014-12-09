#Expose the Rsolr connection for raw Solr manipulations:
# rsolr = Sunspot.session.session.rsolr_connection
module Sunspot
  class Session
    def rsolr_connection
      connection
    end
  end
end