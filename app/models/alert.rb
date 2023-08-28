# frozen_string_literal: true

# Describes a record alert in Primero.
class Alert < ApplicationRecord
  belongs_to :record, polymorphic: true
  belongs_to :agency, optional: true
  belongs_to :user, optional: true
  validates :alert_for, presence: { message: 'errors.models.alerts.alert_for' }
  attribute :send_email, :boolean, default: false

  before_create :generate_fields
  before_create :remove_duplicate_alert
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

    AlertNotifyJob.perform_later(id)
  end
end
