class Transition
  include Syncable::PrimeroEmbeddedModel
  include PrimeroModel

  validate :validate_record

  property :type, String
  property :to_user_local, String
  property :to_user_remote, String
  property :to_user_agency, String
  property :notes, String
  property :transitioned_by, String
  property :consent_override_by, String
  property :service, String
  property :is_remote, TrueClass
  property :is_remote_primero, TrueClass
  property :created_at, Date
  property :id

  TYPE_REFERRAL = "referral"
  TYPE_TRANSFER = "transfer"

  def initialize *args
    super

    self.id ||= UUIDTools::UUID.random_create.to_s
  end

  def parent_record
    base_doc
  end

  private

  def validate_record
    #TODO
  end
end
