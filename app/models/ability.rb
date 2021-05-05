# frozen_string_literal: true

# TODO: Refactor this!!! Write some tests!

class Ability
  include CanCan::Ability

  def initialize(user)
    alias_action :index, :view, :list, :export, to: :read
    alias_action :edit, :update, :destroy, :disable, to: :write
    alias_action new: :create
    alias_action destroy: :delete

    @user = user

    can [:index], SystemSettings
    can :index, FormSection
    can [:index], Lookup
    can [:index], Location
    can :index, Report

    can [:read_self, :write_self], User do |uzer|
      uzer.user_name == user.user_name
    end

    can :search, User if user.permission_by_permission_type?(Permission::CASE, Permission::TRANSFER) ||
                         user.permission_by_permission_type?(Permission::CASE, Permission::ASSIGN) ||
                         user.permission_by_permission_type?(Permission::CASE, Permission::REFERRAL)

    can [:read_reports], Report do |report|
      can?(:read, report) || can?(:group_read, report)
    end

    can [:show_user], User do |uzer|
      can?(:read_self, uzer) || can?(:read, uzer)
    end

    can [:edit_user], User do |uzer|
      can?(:write_self, uzer) || can?(:edit, uzer)
    end

    user.role.permissions.each do |permission|
      case permission.resource
      when Permission::USER
        user_permissions permission.action_symbols
      when Permission::USER_GROUP
        user_group_permissions permission.action_symbols
      when Permission::ROLE
        role_permissions permission
      when Permission::AGENCY
        agency_permissions permission
      when Permission::METADATA
        metadata_permissions
      when Permission::SYSTEM
        system_permissions
      when Permission::TRACING_REQUEST
        configure_tracing_request(permission.action_symbols)
      else
        configure_resource permission.resource_class, permission.action_symbols, permission.record?
      end
    end

    configure_exports
    baseline_permissions
    configure_record_attachments

    [Child, TracingRequest, Incident].each do |model|
      configure_flag(model)
    end
  end

  def baseline_permissions
    can [:read, :write, :create], SavedSearch do |search|
      user.user_name == search.user.user_name
    end
  end

  def user_permissions(actions)
    can actions, User do |uzer|
      if user.super_user?
        true
      elsif uzer.super_user?
        false
      elsif user.user_admin?
        true
      elsif uzer.user_admin?
        false
      elsif user.permission_by_permission_type?(Permission::USER, Permission::AGENCY_READ) &&
            user.agency == uzer.agency
        true
      # TODO: should this be limited in a more generic way rather than by not agency user admin?
      elsif !user.permission_by_permission_type?(Permission::USER, Permission::AGENCY_READ) &&
            user.group_permission?(Permission::GROUP)
        # TODO-permission: Add check that the current user has the ability to edit the uzer's role
        # True if, The user's role's associated_role_ids include the uzer's role_id
        (user.user_group_ids & uzer.user_group_ids).present?
      elsif user.group_permission?(Permission::ALL)
        true
      else
        uzer.user_name == user.user_name
      end
    end
  end

  def user_group_permissions(actions)
    can actions, UserGroup do |instance|
      # TODO-permission: replace the if staemnet with the super_user? and user_admin? functions
      if user.group_permission?(Permission::ALL) || user.group_permission?(Permission::ADMIN_ONLY)
        true
      elsif user.group_permission?(Permission::GROUP)
        user.user_group_ids.include? instance.id
      else
        false
      end
    end
  end

  def role_permissions(permission)
    actions = permission.action_symbols
    can actions, Role do |instance|
      if instance.super_user_role?
        false
      elsif instance.user_admin_role? && !user.super_user?
        false
      # TODO-permission: The following code prevents a role from having access to itself.
      # As written it is too broad and won't let a user see or assign its own role.
      # It should be limited to only preventing the a role from editing itself:
      elsif ([Permission::ASSIGN, Permission::READ, Permission::WRITE].map(&:to_sym) & actions).present?
        permission.role_unique_ids.present? ? (permission.role_unique_ids.include? instance.unique_id) : true
      # TODO-permission: This if statement should prevent a role from editing itself, but it should be evaluated before
      # the previous elsif to be effective
      # TODO-permission: I do not believe that the second part of the if statement is helpful or accurate:
      # Not even the super user is allowed to edit their own role, consider removing.
      elsif user.role_id == instance.id && !user.group_permission?(Permission::ALL)
        false
      else
        # TODO-permission: This else statements should default to false, not 'true' when the conditions are not met
        true
      end
    end
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

  def user
    @user
  end

  def configure_resource(resource, actions, is_record = false)
    if is_record
      can actions, resource do |instance|
        permitted_to_access_record?(user, instance)
      end
      can(:index, Task) if (resource == Child) && user.permission?(Permission::DASH_TASKS)
      can(:index, Flag) if user.permission?(Permission::DASH_FLAGS)
    else
      can actions, resource
    end
  end

  def configure_tracing_request(actions)
    can(actions, TracingRequest) do |instance|
      permitted_to_access_record?(user, instance)
    end
    can(actions, Trace) do |instance|
      permitted_to_access_record?(user, instance.tracing_request)
    end
  end

  def configure_flag(resource)
    can [:flag_record], resource do |instance|
      can?(:read, instance) && can?(:flag, instance)
    end
  end

  def configure_exports
    return unless user.role.permitted_to_export?

    can [:index, :create, :read, :destroy], BulkExport do |instance|
      instance.owned_by == user.user_name
    end
  end

  def configure_record_attachments
    can(%i[read write destroy], Attachment) do |instance|
      permitted_to_access_record?(user, instance.record)
    end
  end

  def permitted_to_access_record?(user, record)
    if user.group_permission? Permission::ALL
      true
    elsif user.group_permission? Permission::AGENCY
      record.associated_user_agencies.include?(user.agency.unique_id)
    elsif user.group_permission? Permission::GROUP
      # TODO: This may need to be record&.owned_by_groups
      (user.user_group_unique_ids & record&.associated_user_groups).present?
    else
      record&.associated_user_names&.include?(user.user_name)
    end
  end

  def can(action = nil, subject = nil, *conditions, &block)
    add_rule(CanCan::CustomRule.new(true, action, subject, *conditions, &block))
  end

  def cannot(action = nil, subject = nil, *conditions, &block)
    add_rule(CanCan::CustomRule.new(true, action, subject, *conditions, &block))
  end
end
