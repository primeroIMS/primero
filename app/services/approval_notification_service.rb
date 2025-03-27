# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Service for approval notification logic
class ApprovalNotificationService
  attr_accessor :record_id, :type, :manager_user_name, :approved

  def initialize(record_id, type, manager_user_name, approved = nil)
    self.record_id = record_id
    self.type = type
    self.manager_user_name = manager_user_name
    self.approved = approved
  end

  def locale
    @locale ||= I18n.locale
  end

  def manager
    @manager ||= User.find_by(user_name: manager_user_name)
    log_not_found('Manager user', manager_user_name) if @manager.blank?
    @manager
  end

  def child
    @child ||= Child.find_by(id: record_id)
    log_not_found('Case', record_id) if @child.blank?
    @child
  end

  alias record child

  def user
    @user ||= child&.owner
    log_not_found('User', child&.owned_by) if @user.blank?
    @user
  end

  alias owner user

  def approval_type
    child.module&.approvals_labels(manager.locale)&.dig(type) ||
      SystemSettings.current.approvals_labels(manager.locale)&.dig(type)
  end

  def send_notification?
    manager.present? && child.present? && user.present?
  end

  def subject
    I18n.t("email_notification.#{key}_subject",
           id: child.short_id,
           locale:)
  end

  def key; end

  def approval; end

  private

  def log_not_found(type, id)
    Rails.logger.error(
      "Notification not sent. #{type.capitalize} #{id} not found."
    )
  end
end
