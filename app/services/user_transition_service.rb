# frozen_string_literal: true

# Returns the users for a specified transition
class UserTransitionService
  attr_accessor :transition, :transitioned_by_user, :model, :module_unique_id

  RECEIVE_PERMISSIONS = {
    Referral.name => {
      receive: Permission::RECEIVE_REFERRAL,
      receive_different_module: Permission::RECEIVE_REFERRAL_DIFFERENT_MODULE
    },
    TransferRequest.name => {
      receive: Permission::RECEIVE_TRANSFER
    },
    Transfer.name => {
      receive: Permission::RECEIVE_TRANSFER
    }
  }.freeze

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

    users = User.where(disabled: false).where.not(id: transitioned_by_user.id)

    return with_assign_scope(users) if transition == Assign.name

    apply_filters(with_receive_permission(users), filters)
  end

  def can_receive?(transitioned_to_user)
    transition_users.pluck(:user_name).include?(transitioned_to_user.user_name)
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

  def with_receive_permission(users)
    receive_permission = RECEIVE_PERMISSIONS[transition][:receive]

    users = users.joins(role: :primero_modules).where(
      'roles.permissions -> :resource ? :permission',
      resource: model&.parent_form,
      permission: receive_permission
    ).where(roles: { primero_modules: { unique_id: module_unique_id } })

    with_different_module_users(users)
  end

  def with_different_module_users(users)
    return users unless RECEIVE_PERMISSIONS[transition][:receive_different_module].present?

    users.or(
      User.joins(role: :primero_modules).where(
        'roles.permissions -> :resource ? :permission',
        resource: model&.parent_form,
        permission: RECEIVE_PERMISSIONS[transition][:receive_different_module]
      )
    )
  end
end
