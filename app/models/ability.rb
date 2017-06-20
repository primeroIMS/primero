class Ability
  include CanCan::Ability

  def initialize(user)
    alias_action :index, :view, :list, :export, :to => :read
    alias_action :edit, :update, :destroy, :disable, :to => :write
    alias_action :new => :create

    @user = user

    can [:read, :write], User do |uzer|
      uzer.user_name == user.user_name
    end

    can [:read_reports], Report do |report|
      can?(:read, report) || can?(:group_read, report)
    end

    user.permissions.each do |permission|
      case permission.resource
        when Permission::USER
          user_permissions permission.action_symbols
        when Permission::ROLE
          role_permissions permission
        when Permission::AGENCY
          agency_permissions permission
        when Permission::METADATA
          metadata_permissions
        when Permission::SYSTEM
          system_permissions
        else
          configure_resource permission.resource_class, permission.action_symbols, permission.is_record?
      end
    end

    if user.has_permission? Permission::SYNC_MOBILE
      can :index, FormSection
      can :index, SystemSettings
    end
  end

  def user_permissions actions
    can actions, User do |uzer|
      if user.has_group_permission? Permission::ALL
        true
      elsif user.has_group_permission? Permission::GROUP
        (user.user_group_ids & uzer.user_group_ids).size > 0
      else
        uzer.user_name == user.user_name
      end
    end

    can actions, UserGroup do |instance|
      if user.has_group_permission? Permission::ALL
        true
      elsif user.has_group_permission? Permission::GROUP
        #TODO - restrict User Group access
        true
      else
        #TODO
        true
      end
    end
  end

  def role_permissions permission
    actions = permission.action_symbols
    can actions, Role do |instance|
      if [Permission::ASSIGN, Permission::READ, Permission::WRITE].map{|p| p.to_sym}.any? {|p| actions.include?(p)}
        permission.role_ids.present? ? (permission.role_ids.include? instance.id) : true
      else
        true
      end
    end
  end

  def agency_permissions permission
    actions = permission.action_symbols
    can actions, Agency do |instance|
      if [Permission::ASSIGN, Permission::READ, Permission::WRITE].map{|p| p.to_sym}.any? {|p| actions.include?(p)}
        permission.agency_ids.present? ? (permission.agency_ids.include? instance.id) : true
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
    [ContactInformation, Device, Replication, SystemUsers, SystemSettings].each do |resource|
      can :manage, resource
    end
  end

  def user
    @user
  end

  def configure_resource(resource, actions, is_record=false)
    if is_record
      can actions, resource do |instance|
        if user.has_group_permission? Permission::ALL
          true
        elsif user.has_group_permission? Permission::GROUP
          allowed_groups = instance.associated_users.map{|u|u.user_group_ids}.flatten.compact
          (user.user_group_ids & allowed_groups).size > 0
        else
          instance.associated_user_names.include? user.user_name
        end
      end
      can [:index, :show], BulkExport do |instance|
        instance.owned_by == user.user_name
      end
    else
      can actions, resource
    end
  end

  def can(action = nil, subject = nil, conditions = nil, &block)
    rules << CanCan::CustomRule.new(true, action, subject, conditions, block)
  end

  def cannot(action = nil, subject = nil, conditions = nil, &block)
    rules << CanCan::CustomRule.new(false, action, subject, conditions, block)
  end
end
