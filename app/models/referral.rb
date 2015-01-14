class Referral
  include Syncable::PrimeroEmbeddedModel
  include PrimeroModel

  validate :validate_record

  property :referred_to_user, String
  property :referred_to_user_agency, String
  property :notes, String
  property :referred_by, String
  property :service, String
  property :is_remote, TrueClass
  property :is_remote_primero, TrueClass
  property :created_at, Date
  property :id

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
