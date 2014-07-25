#TODO: Get rid of thus concern!
module SearchableRecord
  extend ActiveSupport::Concern

  #TODO: Move these includes into case/incident
  include Record
  include Searchable

  module ClassMethods

  end

end