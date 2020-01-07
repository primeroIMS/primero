class Ability
  include CanCan::Ability

  def initialize(user)
    alias_action :index, :view, :list, :export, :to => :read
    alias_action :edit, :update, :destroy, :disable, :to => :write
    alias_action :new => :create

    @user = user

    can [:read_self, :write_self], User do |uzer|
      uzer.user_name == user.user_name
    end

    if user.has_permission_by_permission_type?(Permission::CASE, Permission::ASSIGN) ||
       user.has_permission_by_permission_type?(Permission::CASE, Permission::ASSIGN_WITHIN_AGENCY) ||
       user.has_permission_by_permission_type?(Permission::CASE, Permission::ASSIGN_WITHIN_USER_GROUP) ||
       user.has_permission_by_permission_type?(Permission::CASE, Permission::TRANSFER) ||
       user.has_permission_by_permission_type?(Permission::CASE, Permission::REFERRAL)

       can :search, User
       can :search, Agency
    end

    can [:read_reports], Report do |report|
      can?(:read, report) || can?(:group_read, report)
    end

    can [:show_user], User do |uzer|
      can?(:read_self, uzer) || can?(:read, uzer)
    end

    can [:edit_user], User do |uzer|
      can?(:write_self, uzer) || can?(:edit, uzer)
    end

    user.permissions.each do |permission|
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
        when Permission::FORM
          form_permissions
        when Permission::LOOKUP
          lookup_permissions
        else
          configure_resource permission.resource_class, permission.action_symbols, permission.is_record?
      end
    end

    baseline_permissions

    if user.has_permission? Permission::SYNC_MOBILE
      can :index, FormSection
      can :index, SystemSettings
    end
  end

  def baseline_permissions
    can [:read, :write, :create], SavedSearch do |search|
      user.user_name == search.user_name
    end
  end

  def user_permissions actions
    can actions, User do |uzer|
      if (user.is_super_user?)
        true
      elsif (uzer.is_super_user?)
        false
      elsif (user.is_user_admin?)
        true
      elsif (uzer.is_user_admin?)
        false
      elsif (user.has_permission_by_permission_type?(Permission::USER, Permission::AGENCY_READ) && user.agency == uzer.agency)
        true
      # TODO: should this be limited in a more generic way rather than by not agency user admin?
      elsif !user.has_permission_by_permission_type?(Permission::USER, Permission::AGENCY_READ) && (user.has_group_permission?(Permission::GROUP) || user.has_group_permission?(Permission::ALL))
        # TODO-permission: Add check that the current user has the ability to edit the uzer's role
        # True if, The user's role's associated_role_ids include the uzer's role_id
        user.has_group_permission?(Permission::ALL) ? true : ((user.user_group_ids & uzer.user_group_ids).size > 0)
      else
        uzer.user_name == user.user_name
      end
    end
  end

  def user_group_permissions actions
    can actions, UserGroup do |instance|
      #TODO-permission: replace the if staemnet with the is_super_user? and is_user_admin? functions
      if (user.has_group_permission?(Permission::ALL) || user.has_group_permission?(Permission::ADMIN_ONLY))
        true
      elsif user.has_group_permission?(Permission::GROUP)
        user.user_group_ids.include? instance.id
      else
        false
      end
    end
  end

  def role_permissions permission
    actions = permission.action_symbols
    can actions, Role do |instance|
      if instance.is_super_user_role?
        false
      elsif instance.is_user_admin_role? && !user.is_super_user?
        false
     # TODO-permission: The following code prevents a role from having access to itself.
     # As written it is too broad and won't let a user see or assign its own role.
     # It should be limitted to only preventing the a role from editting itself:
      elsif [Permission::ASSIGN, Permission::READ, Permission::WRITE].map{|p| p.to_sym}.any? {|p| actions.include?(p)}
        #TODO-permission: This else statements should default to false, not true when the conditions are not met
        permission.role_ids.present? ? (permission.role_ids.include? instance.id) : true
      # TODO-permission: This if statement should prevent a role from editing itself, but it should be evaluated before
      # the previous elsif to be effective
      # TODO-permission: I do not believe that the second part of the if statement is helpful or accurate:
      # Not even the super user is allowed to edit their own role, consider removing.
      elsif (user.role_ids.include?(instance.id) && !user.has_group_permission?(Permission::ALL))
        false
      else
        #TODO-permission: This else statements should default to false, not 'true' when the conditions are not met
        true
      end
    end
  end

  def agency_permissions permission
    actions = permission.action_symbols
    can actions, Agency do |instance|
      #TODO-permission: BOTH of these else statements should default to false not true when the conditions are not met
      if [Permission::ASSIGN, Permission::READ, Permission::WRITE].map{|p| p.to_sym}.any? {|p| actions.include?(p)}
        permission.agency_ids.present? ? (permission.agency_ids.include? instance.id) : true
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
    [ContactInformation, Device, Replication, SystemUsers, SystemSettings].each do |resource|
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
      if ((resource == Child) &&
          user.has_permission?(Permission::DASH_TASKS))
        can :index, Task
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
