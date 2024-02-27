# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Describes a record alert in Primero.
class Alert < ApplicationRecord
  belongs_to :record, polymorphic: true
  belongs_to :agency, optional: true
  belongs_to :user, optional: true
  validates :alert_for, presence: { message: 'errors.models.alerts.alert_for' }
  attribute :send_email, :boolean, default: false

  before_create :generate_fields
  before_create :remove_duplicate_alert
  before_destroy :recalculate_record_alert_types
  after_create_commit :handle_send_email

  def generate_fields
    self.unique_id ||= SecureRandom.uuid
  end

  # This allows us to use the property 'type' on Alert, normally reserved by ActiveRecord
  def self.inheritance_column
    'type_inheritance'
  end

  def remove_duplicate_alert
    return unless alert_for == DuplicateIdAlertable::DUPLICATE_FIELD

    DuplicatedFieldAlertService.duplicate_alert(record, type)&.destroy!
  end

  def handle_send_email
    return unless send_email

    users = record.associated_users
    users.each do |user|
      AlertNotifyJob.perform_later(id, user.id)
    end
  end

  def recalculate_record_alert_types
    record_to_update = record
    return unless record_to_update.present?

    record_to_update.calculate_current_alert_types
  end
end
