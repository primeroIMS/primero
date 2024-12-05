# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# TODO: Refactor this!!! Write some tests!

# Class for Ability
# rubocop:disable Metrics/ClassLength
class Ability
  include CanCan::Ability

  # rubocop:disable Metrics/MethodLength
  def initialize(user)
    alias_user_actions
    @user = user
    @permitted_form_fields_service = PermittedFormFieldsService.instance
    can_index
    can_access_self(user)
    can_search(user)
    can_read_reports
    can_show_user
    can_edit_user
    initialize_permissions(user)
    configure_exports
    baseline_permissions
    configure_record_attachments
    configure_flags
  end
  # rubocop:enable Metrics/MethodLength

  def baseline_permissions
    can [:read, :write, :create], SavedSearch do |search|
      user.user_name == search.user.user_name
    end
  end

  def user_permissions(actions)
    can actions, User do |instance|
      permitted_to_access_user?(instance)
    end
  end

  def permitted_to_access_user?(instance)
    return true if super_user_or_admin?(user)

    return false if super_user_or_admin?(instance)

    return true if agency_permission?(instance)

    return (user.user_group_ids & instance.user_group_ids).present? if group_permission?

    return true if user.group_permission?(Permission::ALL)

    instance.user_name == user.user_name
  end

  def super_user_or_admin?(uzr)
    uzr.super_user? || uzr.user_admin?
  end

  def agency_permission?(instance)
    user.permission_by_permission_type?(Permission::USER, Permission::AGENCY_READ) &&
      user.agency == instance.agency
  end

  def group_permission?
    !user.permission_by_permission_type?(Permission::USER, Permission::AGENCY_READ) &&
      user.group_permission?(Permission::GROUP)
  end

  def user_group_permissions(actions)
    can actions, UserGroup do |instance|
      # TODO-permission: replace the if staemnet with the super_user? and user_admin? functions
      if user.group_permission?(Permission::ALL) || user.group_permission?(Permission::ADMIN_ONLY)
        true
      elsif user.group_permission?(Permission::GROUP) || user.group_permission?(Permission::AGENCY)
        user.user_group_ids.include? instance.id
      else
        false
      end
    end
  end

  def role_permissions(permission)
    actions = permission.action_symbols
    can actions, Role do |instance|
      permitted_to_access_role?(instance, actions, permission)
    end
  end

  def permitted_to_access_role?(instance, actions, permission)
    return false if instance.super_user_role? || (instance.user_admin_role? && !user.super_user?)

    return check_role_id(instance, permission) if read_write_or_assign?(actions)

    return false if user.role_id == instance.id && !user.group_permission?(Permission::ALL)

    true
  end

  def read_write_or_assign?(actions)
    ([Permission::ASSIGN, Permission::READ, Permission::WRITE].map(&:to_sym) & actions).present?
  end

  def check_role_id(instance, permission)
    permission.role_unique_ids.present? ? (permission.role_unique_ids.include? instance.unique_id) : true
  end

  def agency_permissions(permission)
    actions = permission.action_symbols
    can actions, Agency do |instance|
      if ([Permission::ASSIGN, Permission::READ, Permission::WRITE].map(&:to_sym) & actions).present?
        permission.agency_unique_ids.present? ? (permission.agency_unique_ids.include? instance.unique_id) : true
      else
        true
      end
    end
  end

  def metadata_permissions
    [FormSection, Field, Location, Lookup, PrimeroProgram, PrimeroModule].each do |resource|
      can :manage, resource
    end
  end

  def system_permissions
    [ContactInformation, SystemSettings].each do |resource|
      can :manage, resource
    end
  end

  attr_reader :user

  def configure_resource(resource, actions, is_record = false)
    if is_record
      can actions, resource do |instance|
        user.permitted_to_access_record?(instance)
      end
      can(:index, Task) if (resource == Child) && user.permission?(Permission::DASH_TASKS)
      can(:index, Flag) if user.permission?(Permission::DASH_FLAGS)
    else
      can actions, resource
    end
  end

  def configure_tracing_request(actions)
    can(actions, TracingRequest) do |instance|
      user.permitted_to_access_record?(instance)
    end
    can(actions, Trace) do |instance|
      user.permitted_to_access_record?(instance.tracing_request)
    end
  end

  def configure_flag(resource)
    can [:flag_record], resource do |instance|
      can?(:read, instance) && can?(:flag, instance)
    end
  end

  def resolve_flag(resource)
    can [:flag_resolve], resource do |instance|
      (can?(:read, instance) && can?(:flag, instance)) || (can?(:read, instance) && can?(:resolve_any_flag, instance))
    end
  end

  def configure_exports
    return unless user.role.permitted_to_export?

    can [:index, :create, :read, :destroy], BulkExport do |instance|
      instance.owned_by == user.user_name
    end
  end

  def configure_record_attachments
    can(:read, Attachment) do |instance|
      PermittedAttachmentService.permitted_to_read?(user, instance, @permitted_form_fields_service)
    end

    can(%i[create destroy], Attachment) do |instance|
      PermittedAttachmentService.permitted_to_write?(user, instance, @permitted_form_fields_service)
    end
  end

  def can(action = nil, subject = nil, *, &)
    add_rule(CanCan::CustomRule.new(true, action, subject, *, &))
  end

  def cannot(action = nil, subject = nil, *, &)
    add_rule(CanCan::CustomRule.new(true, action, subject, *, &))
  end

  def alias_user_actions
    alias_action :index, :view, :list, :export, to: :read
    alias_action :edit, :update, :destroy, :disable, to: :write
    alias_action new: :create
    alias_action destroy: :delete
  end

  def can_index
    can [:index], SystemSettings
    can :index, FormSection
    can [:index], Lookup
    can [:index], Location
    can :index, Report
  end

  def can_access_self(user)
    can [:read_self, :write_self], User do |uzer|
      uzer.user_name == user.user_name
    end
  end

  def can_search(user)
    can :search, User if user.permission_by_permission_type?(Permission::CASE, Permission::TRANSFER) ||
                         user.permission_by_permission_type?(Permission::CASE, Permission::ASSIGN) ||
                         user.permission_by_permission_type?(Permission::CASE, Permission::REFERRAL)
  end

  def can_read_reports
    can [:read_reports], Report do |report|
      can?(:read, report) || can?(:group_read, report) || can?(:agency_read, report)
    end
  end

  def can_show_user
    can [:show_user], User do |uzer|
      can?(:read_self, uzer) || can?(:read, uzer)
    end
  end

  def can_edit_user
    can [:edit_user], User do |uzer|
      can?(:write_self, uzer) || can?(:edit, uzer)
    end
  end

  def initialize_permissions(user)
    user.role.permissions.each do |permission|
      initialize_permission(permission)
    end
  end

  # rubocop:disable Metrics/MethodLength
  # rubocop:disable Metrics/CyclomaticComplexity
  def initialize_permission(permission)
    case permission.resource
    when Permission::USER
      user_permissions(permission.action_symbols)
    when Permission::USER_GROUP
      user_group_permissions(permission.action_symbols)
    when Permission::ROLE
      role_permissions(permission)
    when Permission::AGENCY
      agency_permissions(permission)
    when Permission::METADATA
      metadata_permissions
    when Permission::SYSTEM
      system_permissions
    when Permission::TRACING_REQUEST
      configure_tracing_request(permission.action_symbols)
    else
      configure_resource(
        permission.resource_class, permission.action_symbols, permission.record_with_ownership_authorization?
      )
    end
  end
  # rubocop:enable Metrics/MethodLength
  # rubocop:enable Metrics/CyclomaticComplexity

  def configure_flags
    [Child, TracingRequest, Incident, RegistryRecord, Family].each do |model|
      configure_flag(model)
      resolve_flag(model)
    end
  end
end
# rubocop:enable Metrics/ClassLength
