class Transition
  include Syncable::PrimeroEmbeddedModel
  include PrimeroModel

  validate :validate_record

  property :type, String
  property :to_user_local, String
  property :to_user_remote, String
  property :to_user_agency, String
  property :to_user_local_status, String
  property :rejected_reason, String
  property :notes, String
  property :transitioned_by, String
  property :service, String #service referers to the 'Type of Service'
  property :service_section_unique_id, String
  property :is_remote, TrueClass
  property :type_of_export, String
  property :consent_overridden, TrueClass
  property :consent_individual_transfer, TrueClass
  property :created_at, Date
  property :id

  TYPE_REFERRAL = "referral"
  TYPE_REASSIGN = "reassign"
  TYPE_TRANSFER = "transfer"
  TYPE_TRANSFER_REQUEST = "transfer_request"

  TRANSFERRED_STATUS = 'transferred'

  TO_USER_LOCAL_STATUS_PENDING = "pending"
  TO_USER_LOCAL_STATUS_ACCEPTED = "accepted"
  TO_USER_LOCAL_STATUS_REJECTED = "rejected"
  TO_USER_LOCAL_STATUS_DONE = "done"
  TO_USER_LOCAL_STATUS_INPROGRESS = "in_progress"

  def initialize *args
    super

    self.id ||= UUIDTools::UUID.random_create.to_s
  end

  def parent_record
    base_doc
  end

  def is_referral_active?
    self.to_user_local_status == Transition::TO_USER_LOCAL_STATUS_INPROGRESS
  end

  def is_transfer_in_progress?
    self.to_user_local_status == Transition::TO_USER_LOCAL_STATUS_INPROGRESS
  end

  def is_assigned_to_user_local?(user)
    self.to_user_local == user
  end

  private

  def validate_record
    #TODO
  end
end
