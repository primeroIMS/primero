class Transition < ApplicationRecord

  # attr_accessor :id, :type, :to_user_local, :to_user_remote, :to_user_agency, :to_user_local_status, :rejected_reason,
  #               :notes, :transitioned_by, :service, :is_remote, :type_of_export, :consent_overridden,
  #               :consent_individual_transfer, :created_at

  REFERRAL = "referral" ; REASSIGN = "reassign" ; TRANSFER = "transfer" ; TRANSFER_REQUEST = "transfer_request"

  STATUS_PENDING = "pending" ; STATUS_ACCEPTED = "accepted" ; STATUS_REJECTED = "rejected"
  STATUS_DONE = "done" ; STATUS_INPROGRESS = "in_progress"

  belongs_to :record, polymorphic: true

  after_initialize :defaults, unless: :persisted?

  def defaults
    self.created_at ||= DateTime.now
  end

  def in_progress?
    self.status == Transition::STATUS_INPROGRESS
  end

  def is_assigned_to_user_local?(user)
    self.to_user_local == user
  end

end
