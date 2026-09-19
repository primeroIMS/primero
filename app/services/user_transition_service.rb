# frozen_string_literal: true

# Returns the users for a specified transition
class UserTransitionService
  attr_accessor :transition, :transitioned_by_user, :model, :module_unique_id

  class << self
    def assign(transitioned_by_user, model, module_unique_id)
      UserTransitionService.new(Assign.name, transitioned_by_user, model, module_unique_id)
    end

    def referral(transitioned_by_user, model, module_unique_id)
      UserTransitionService.new(Referral.name, transitioned_by_user, model, module_unique_id)
    end

    def transfer(transitioned_by_user, model, module_unique_id)
      UserTransitionService.new(Transfer.name, transitioned_by_user, model, module_unique_id)
    end
  end

  def initialize(transition, transitioned_by_user, model, module_unique_id)
    self.transition = transition
    self.transitioned_by_user = transitioned_by_user
    self.model = model
    self.module_unique_id = module_unique_id
  end

  def transition_users(filters = {})
    return User.none unless model.present?
    return with_assign_scope(with_view_record_permission(users_for_transition)) if transition == Assign.name
    return apply_filters(users_for_transition, filters) if transition == TransferRequest.name

    apply_filters(with_receive_permission, filters)
  end

  def can_receive?(transitioned_to_user)
    transition_users.pluck(:user_name).include?(transitioned_to_user.user_name)
  end

  def users_for_transition
    users = User.includes(:agency, :role)
    # NOTE: The app cannot transition a case to an unverified user
    users.where(unverified: false, disabled: false).where(role_categories_subquery).where.not(
      id: transitioned_by_user.id
    )
  end

  def with_receive_permission
    case transition
    when Transfer.name then users_for_transition.where(role_receive_transfer_subquery)
    when Referral.name then users_for_transition.where(role_receive_referral_subquery)
    else
      users_for_transition
    end
  end

  private

  def apply_filters(users, filters = {})
    return users unless filters.present?

    services_filter = filters.delete('service')
    agencies_filter = filters.delete('agency')
    location_filter = filters.delete('location')
    users = users.where(filters) if filters.present?
    users = users.where(':service = ANY (users.services)', service: services_filter) if services_filter.present?
    users = users.joins(:agency).where(agencies: { unique_id: agencies_filter }) if agencies_filter.present?
    users = users.where(reporting_location_code: location_filter) if location_filter.present?

    users
  end

  def with_assign_scope(users)
    # TODO:  Should this query be restricted by module, too?

    case transitioned_by_user.user_assign_scope(model)
    when Permission::ASSIGN then users
    when Permission::ASSIGN_WITHIN_AGENCY then users.where(agency_id: transitioned_by_user.agency_id)
    when Permission::ASSIGN_WITHIN_USER_GROUP
      users.joins(:user_groups).where(user_groups: { id: transitioned_by_user.user_groups.pluck(:id) })
    else
      User.none
    end
  end

  def role_categories_subquery
    Role.joins(:primero_modules).where('roles.id = users.role_id').where(
      'user_category IS NUll OR user_category NOT IN (:categories)',
      categories: [Role::CATEGORY_MAINTENANCE, Role::CATEGORY_SYSTEM]
    ).select('1').arel.exists
  end

  def role_receive_transfer_subquery
    Role.joins(:primero_modules).where('roles.id = users.role_id').where(
      'permissions -> :resource ? :permission',
      resource: model&.parent_form,
      permission: Permission::RECEIVE_TRANSFER
    ).select('1').arel.exists
  end

  def role_receive_referral_subquery
    roles = Role.joins(:primero_modules).where('roles.id = users.role_id')
    roles = with_different_modules(roles)
    roles = with_user_groups(roles, transitioned_by_user.user_groups.pluck(:id))
    roles.select('1').arel.exists
  end

  def with_different_modules(roles)
    receive_different_module_query = <<~SQL.squish
      permissions -> :resource ? :permission_different_module
      OR (permissions -> :resource ?| ARRAY[:permissions] AND primero_modules.unique_id = :module_unique_id)
    SQL
    roles.where(
      receive_different_module_query,
      resource: model&.parent_form, module_unique_id: module_unique_id,
      permission_different_module: Permission::RECEIVE_REFERRAL_DIFFERENT_MODULE,
      permissions: [Permission::RECEIVE_REFERRAL, Permission::RECEIVE_REFERRAL_WITHIN_GROUP]
    )
  end

  def with_user_groups(roles, user_group_ids = [])
    roles.where(
      user_groups_subquery,
      resource: model&.parent_form,
      permission_different_module: Permission::RECEIVE_REFERRAL_DIFFERENT_MODULE,
      permission_referral: Permission::RECEIVE_REFERRAL,
      permission_group: Permission::RECEIVE_REFERRAL_WITHIN_GROUP,
      user_group_ids: user_group_ids
    )
  end

  def user_groups_subquery
    <<~SQL.squish
      permissions -> :resource ? :permission_referral OR (
        permissions -> :resource ? :permission_different_module AND permissions -> :resource ? :permission_group = FALSE
      ) OR (permissions -> :resource ? :permission_group AND EXISTS (
          SELECT 1 FROM user_groups INNER JOIN user_groups_users ON user_groups_users.user_group_id = user_groups.id
          WHERE user_groups.id IN (:user_group_ids) AND user_groups_users.user_id = users.id
        )
      )
    SQL
  end

  def with_view_record_permission(users)
    users.by_resource_and_permission(model&.parent_form, [Permission::READ, Permission::MANAGE])
  end
end
