class Duplicate
  include ActiveModel::Model

  #TODO - Create rspec tests

  attr_accessor :id

  class << self
    # Emulate 'find' since this isn't persisted in a DB
    def find(id)
      # matching_configuration = MatchingConfiguration.new(id)
      # matching_configuration.load_form_fields
      # matching_configuration
    end
  end

  def initialize(id=nil)
    # @id = id || 'administration'
    #
    # primero_module = PrimeroModule.get(PrimeroModule::CP)
    # @form_ids = primero_module.try(:associated_form_ids)
  end



  # Patch to make nav buttons work
  def new?
    false
  end

  private


end
