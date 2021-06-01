# frozen_string_literal: true

# Users belong to user groups which may be used to limit the records that an individual user may have access to.
class UserGroup < ApplicationRecord
  include ConfigurationRecord

  has_and_belongs_to_many :users

  before_create :generate_unique_id
  class << self
    def list(user, opts = {})
      user_groups = !opts[:managed] ? UserGroup.all : user.permitted_user_groups

      user_groups = user_groups.where(disabled: opts[:disabled].values) if opts[:disabled].present?

      order_query = SqlOrderQueryService.build_order_query(self, opts)

      order_query.present? ? user_groups.order(order_query) : user_groups
    end

    def new_with_properties(params, user)
      user_group = UserGroup.new(params)
      user_group.add_creating_user(user)
      user_group
    end
  end

  def add_creating_user(user)
    return unless [Permission::AGENCY, Permission::GROUP, Permission::SELF].include?(user.role&.group_permission)

    users << user
  end
end
