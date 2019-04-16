class Transition < ValueObject

  attr_accessor :id, :type, :to_user_local, :to_user_remote, :to_user_agency, :to_user_local_status, :rejected_reason,
                :notes, :transitioned_by, :service, :is_remote, :type_of_export, :consent_overridden,
                :consent_individual_transfer, :created_at

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

  def initialize(args={})
    super(args)
    self.id ||= SecureRandom.uuid
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

end
