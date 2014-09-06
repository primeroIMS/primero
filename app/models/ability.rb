class Ability
  include CanCan::Ability


  def initialize(user)
    alias_action :index, :view, :list, :to => :read
    #alias_action :edit, :to => :update
    alias_action :edit, :to => :write

    @user = user

    if user.has_permission? Permission::CASE
      configure_resource Child, true
    end

    if user.has_permission? Permission::INCIDENT
      configure_resource Incident, true
    end

    if user.has_permission? Permission::TRACING_REQUEST
      configure_resource TracingRequest, true
    end

    if user.has_permission? Permission::USER
      #TODO: add Group
      #TODO: User is a funny permission.
      [User, Role, Agency].each do |resource|
        configure_resource resource
      end
    end

    if user.has_permission? Permission::METADATA
      [FormSection, Field, Location, Lookup, PrimeroModule, PrimeroProgram].each do |resource|
        configure_resource resource
      end
    end

    if user.has_permission? Permission::SYSTEM
      [ContactInformation, Device, Replication, SystemUsers].each do |resource|
        configure_resource resource
      end
    end

  end

    def user
    @user
  end

  def configure_resource(resource, is_record=false)
    Permission.actions.each do |action|
      if user.has_permission? action
        ability = action.keys.first
        if is_record
          can [ability], resource do |instance|
            if user.has_permission? Permission::ALL
              true
            elsif user.has_permission? Permission::GROUP
              true #TODO: implement for groups!!!
            else
              instance.associated_user_names.include? user.user_name
            end
          end
        end
      else
        can [ability], resource
      end
    end
  end

  def can(action = nil, subject = nil, conditions = nil, &block)
    rules << CanCan::CustomRule.new(true, action, subject, conditions, block)
  end

  def cannot(action = nil, subject = nil, conditions = nil, &block)
    rules << CanCan::CustomRule.new(false, action, subject, conditions, block)
  end





end
