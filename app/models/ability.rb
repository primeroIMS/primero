class Ability
  include CanCan::Ability

  def initialize(user)
    alias_action :index, :view, :list, :export, :to => :read
    alias_action :edit, :update, :create, :new, :destroy, :disable, :to => :write

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
        when Permission::METADATA
          metadata_permissions
        when Permission::SYSTEM
          system_permissions
        when Permission::FORM
          form_permissions
        when Permission::LOOKUP
          lookup_permissions
        else
          configure_resource permission.resource_class, permission.action_symbols, permission.is_record?
      end
    end

    if user.has_permission? Permission::SYNC_MOBILE
      can :index, FormSection
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
    [UserGroup, Agency].each do |resource|
      configure_resource resource, actions
    end
  end

  def role_permissions permission
    actions = permission.action_symbols
    can actions, Role do |instance|
      if (actions.include? Permission::ASSIGN.to_sym) || (actions.include? Permission::READ.to_sym) || (actions.include? Permission::WRITE.to_sym)
        permission.role_ids.present? ? (permission.role_ids.include? instance.id) : true
      else
        true
      end
    end
  end

  def metadata_permissions
    [Location, PrimeroProgram, PrimeroModule].each do |resource|
      can :manage, resource
    end
  end

  def system_permissions
    [ContactInformation, Device, Replication, SystemUsers].each do |resource|
      can :manage, resource
    end
  end

  def form_permissions
    [FormSection, Field].each do |resource|
      can :manage, resource
    end
  end

  def lookup_permissions
    can :manage, Lookup
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
