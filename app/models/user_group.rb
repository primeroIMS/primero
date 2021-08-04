# frozen_string_literal: true

# Users belong to user groups which may be used to limit the records that an individual user may have access to.
class UserGroup < ApplicationRecord
  include ConfigurationRecord
  USER_GROUP_FIELDS_SCHEMA = {
    'id' => { 'type' => 'integer' }, 'unique_id' => { 'type' => 'string' },
    'name' => { 'type' => 'string' }, 'description' => { 'type' => 'string' },
    'disabled' => { 'type' => 'boolean' }
  }.freeze

  has_and_belongs_to_many :users

  before_create :generate_unique_id
  class << self
    def order_insensitive_attribute_names
      %w[name description]
    end

    def list(user, opts = {})
      user_groups = !opts[:managed] ? UserGroup.all : user.permitted_user_groups

      user_groups = user_groups.where(disabled: opts[:disabled].values) if opts[:disabled].present?

      OrderByPropertyService.apply_order(user_groups, opts)
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
