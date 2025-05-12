# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Class for transfers, referrals, and assign
class Transition < ApplicationRecord
  STATUS_ACCEPTED = 'accepted'
  STATUS_REJECTED = 'rejected'
  STATUS_INPROGRESS = 'in_progress'
  STATUS_DONE = 'done'
  STATUS_REVOKED = 'revoked'
  NOTIFICATION_ACTION = 'transition_notification'

  belongs_to :record, polymorphic: true
  belongs_to :transitioned_to_user, class_name: 'User', foreign_key: 'transitioned_to',
                                    primary_key: 'user_name', optional: true
  belongs_to :transitioned_by_user, class_name: 'User', foreign_key: 'transitioned_by', primary_key: 'user_name'
  belongs_to :role, class_name: 'Role', foreign_key: 'authorized_role_unique_id',
                    primary_key: 'unique_id', optional: true

  validates :transitioned_to, presence: true, unless: :remote
  validates :transitioned_by, presence: true
  validate :consent_given_or_overridden
  validate :user_can_receive, unless: :remote

  after_initialize :defaults, unless: :persisted?
  before_create :perform
  before_create :copy_record_ownership
  before_create :copy_transitioned_user_groups_and_agency
  after_save_commit :notify

  after_save :save_record

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

  def notified_statuses
    [Transition::STATUS_INPROGRESS]
  end

  def notify
    return unless should_notify?

    TransitionNotifyJob.perform_later(id)
  end

  def should_notify?
    notified_statuses.include?(status)
  end

  def update_incident_ownership
    return unless record.respond_to?(:incidents)

    record.incidents.each do |incident|
      incident.owned_by = transitioned_to
      incident.save!
    end
  end

  def progress_or_accepted_transition?
    Transition.where(transitioned_to:, type: [Referral.name],
                     status: [STATUS_INPROGRESS, STATUS_ACCEPTED],
                     record_id: record.id)
              .or(
                Transition.where(transitioned_to:, type: [Transfer.name],
                                 status: [STATUS_INPROGRESS],
                                 record_id: record.id)
              ).where.not(id:).exists?
  end

  def remove_assigned_user
    return if progress_or_accepted_transition?

    record.assigned_user_names.delete(transitioned_to) if record.assigned_user_names.present?
  end

  def copy_record_ownership
    self.record_owned_by = record.owned_by
    self.record_owned_by_agency = record.owned_by_agency_id
    self.record_owned_by_groups = record.owned_by_groups
  end

  def copy_transitioned_user_groups_and_agency
    self.transitioned_by_user_agency = transitioned_by_user.agency&.unique_id
    self.transitioned_by_user_groups = transitioned_by_user.user_group_unique_ids
    return if remote

    self.transitioned_to_user_agency = transitioned_to_user.agency&.unique_id
    self.transitioned_to_user_groups = transitioned_to_user.user_group_unique_ids
  end

  def save_record
    record.save!
  end

  def service_i18n(locale = I18n.locale)
    Lookup.display_value('lookup-service-type', service, nil, locale:) if service.present?
  end
end
