class Ability
  include CanCan::Ability

  def initialize(user)
    alias_action :index, :view, :list, :export, :to => :read
    alias_action :edit, :update, :create, :new, :destroy, :disable, :import, :to => :write

    @user = user

    actions = Permission.actions.reduce([]) do |array, action|
      if (user.has_permission? action)
        array << action.to_sym
      end
      array
    end

    if user.has_permission? Permission::CASE
      configure_resource Child, actions, true
    end

    if user.has_permission? Permission::INCIDENT
      configure_resource Incident, actions, true
    end

    if user.has_permission? Permission::TRACING_REQUEST
      configure_resource TracingRequest, actions, true
    end

    #Deal with users
    can [:read, :write], User do |uzer|
      uzer.user_name == user.user_name
    end

    if user.has_permission? Permission::USER
      can actions, User do |uzer|
        if user.has_permission? Permission::ALL
          true
        elsif user.has_permission? Permission::GROUP
          (user.user_group_ids & uzer.user_group_ids).size > 0
        else
          uzer.user_name == user.user_name
        end
      end

      [Role, UserGroup, Agency].each do |resource|
        configure_resource resource, actions
      end
    end

    if user.has_permission? Permission::METADATA
      [FormSection, Field, Location, Lookup, PrimeroModule, PrimeroProgram].each do |resource|
        #configure_resource resource, actions
        can :manage, resource
      end
    end

    if user.has_permission? Permission::SYSTEM
      [ContactInformation, Device, Replication, SystemUsers].each do |resource|
        #configure_resource resource, actions
        can :manage, resource
      end
    end

  end

  def user
    @user
  end

  def configure_resource(resource, actions, is_record=false)
    if is_record
      can actions, Report
      can actions, resource do |instance|
        if user.has_permission? Permission::ALL
          true
        elsif user.has_permission? Permission::GROUP
          allowed_groups = instance.associated_users.map{|u|u.user_group_ids}.flatten.compact
          (user.user_group_ids & allowed_groups).size > 0
        else
          instance.associated_user_names.include? user.user_name
        end
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
