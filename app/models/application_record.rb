#TODO: This was added in Rails 5
#TODO: Our models inherit from Couchrest, not ActiveRecord
#TODO: Leaving this as a stub for now
#TODO: Determine if this needs to be tweaked for Couchrest and then inherited by our models
class ApplicationRecord < CouchRest::Model::Base
  # self.abstract_class = true
end
