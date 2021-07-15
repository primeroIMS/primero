# frozen_string_literal: true

# Calculate the permitted users for a user if specified
class PermittedUsersService
  attr_accessor :user

  def initialize(user = nil)
    self.user = user
  end

  def find_permitted_users(filters = nil, pagination = nil, order_params = nil)
    users = apply_filters(permitted_users, filters)
    total = users.size

    current_pagination = build_pagination(pagination)

    users = users.limit(current_pagination[:per_page]).offset(current_pagination[:offset])

    users = apply_order(users, order_params)

    { total: total, users: users }
  end

  private

  def permitted_users
    users = User.all.includes(:user_groups, role: :primero_modules)

    return users if user.blank? || user.super_user?

    return reject_super_users(users) if user.user_admin?

    users = reject_admin_users(users)

    return agency_only_users(users) if user.agency_read?

    group_permitted_users(users)
  end

  def apply_order(users_query, order_params)
    return users_query if order_params.blank?
    return OrderByPropertyService.apply_order(users_query, order_params) unless order_params[:order_by] == 'agency_id'

    order = OrderByPropertyService.order_direction(order_params[:order])
    locale = OrderByPropertyService.order_locale(order_params[:locale])

    users_query.joins(:agency).order("LOWER(name_i18n ->> '#{locale}') #{order}")
  end

  def apply_filters(users_query, filters)
    return users_query unless filters.present?

    query_filters = build_query_filters(filters)
    users_query = users_query.joins(:user_groups) if query_filters[:user_groups].present?
    users_query.where(query_filters)
  end

  def build_query_filters(filters)
    query_filters = filters.compact
    query_filters['disabled'] = query_filters['disabled'].values if query_filters['disabled'].present?
    user_group_ids = query_filters.delete('user_group_ids')

    return query_filters if user_group_ids.blank?

    query_filters.merge(user_groups: { unique_id: user_group_ids })
  end

  def build_pagination(pagination = nil)
    current_pagination = pagination.presence || { per_page: 20, page: 1 }
    current_pagination.merge(offset: current_pagination[:per_page] * (current_pagination[:page] - 1))
  end

  def reject_super_users(users_query)
    users_query.joins(:role).where.not('roles.permissions @> ?', Role::SUPER_ROLE_PERMISSIONS.to_json)
  end

  def reject_admin_users(users_query)
    query = reject_super_users(users_query)
    query.where
         .not('roles.permissions @> ?', Role::ADMIN_ROLE_PERMISSIONS.to_json)
         .or(query.where.not(roles: { group_permission: Permission::ADMIN_ONLY }))
  end

  def agency_only_users(users_query)
    users_query.where(organization: user.organization)
  end

  def group_permitted_users(users_query)
    return users_query if user.group_permission?(Permission::ALL)

    if user.group_permission?(Permission::GROUP)
      return users_query.joins(:user_groups).where(user_groups: { id: user.user_group_ids })
    end

    users_query.where(user_name: user.user_name)
  end
end
