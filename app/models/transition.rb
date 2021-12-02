# frozen_string_literal: true

# Class for transfers, referrals, and assign
class Transition < ApplicationRecord
  STATUS_ACCEPTED = 'accepted'
  STATUS_REJECTED = 'rejected'
  STATUS_INPROGRESS = 'in_progress'
  STATUS_DONE = 'done'
  STATUS_REVOKED = 'revoked'

  belongs_to :record, polymorphic: true
  belongs_to :transitioned_to_user, class_name: 'User', foreign_key: 'transitioned_to', 
                                    primary_key: 'user_name', optional: true
  belongs_to :transitioned_by_user, class_name: 'User', foreign_key: 'transitioned_by', primary_key: 'user_name'

  validates :transitioned_to, presence: true, unless: :remote
  validates :transitioned_by, presence: true
  validate :consent_given_or_overridden
  validate :user_can_receive, unless: :remote

  after_initialize :defaults, unless: :persisted?
  before_create :perform
  after_commit :notify_by_email, if: :in_progress?

  after_save :index_record

  def defaults
    self.created_at ||= DateTime.now
  end

  def perform
    raise NotImplementedError
  end

  def accept!
    raise NotImplementedError
  end

  def reject!
    raise NotImplementedError
  end

  def in_progress?
    status == Transition::STATUS_INPROGRESS
  end

  def accepted?
    status == Transition::STATUS_ACCEPTED
  end

  def consent_given_or_overridden
    return if consent_given? || consent_overridden

    errors.add(:consent, 'transition.errors.consent')
  end

  def consent_given?
    false
  end

  def user_can_accept_or_reject?(user)
    return false if remote || !in_progress?

    user.user_name == transitioned_to_user.user_name
  end

  def user_can_receive
    return if user_can_receive?

    errors.add(:transitioned_to, 'transition.errors.to_user_can_receive')
  end

  def user_can_receive?
    UserTransitionService.new(
      self.class.name,
      transitioned_by_user,
      record.class,
      record.module_id
    ).can_receive?(transitioned_to_user)
  end

  def key
    type.underscore
  end

  def notify_by_email
    TransitionNotifyJob.perform_later(id)
  end

  def index_record
    Sunspot.index!(record) if record
  end

  def update_incident_ownership
    return unless record.respond_to?(:incidents)

    record.incidents.each do |incident|
      incident.owned_by = transitioned_to
      incident.save!
    end
  end

  def remove_assigned_user
    return if Transition.where(
      transitioned_to: transitioned_to,
      type: [Referral.name],
      status: [STATUS_INPROGRESS, STATUS_ACCEPTED],
      record_id: record.id
    ).or(
      Transition.where(
        transitioned_to: transitioned_to,
        type: [Transfer.name],
        status: [STATUS_INPROGRESS],
        record_id: record.id
      )
    ).where.not(id: id).exists?

    record.assigned_user_names.delete(transitioned_to) if record.assigned_user_names.present?
  end
end
