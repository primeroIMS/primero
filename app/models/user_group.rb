# frozen_string_literal: true

# Users belong to user groups which may be used to limit the records that an individual user may have access to.
class UserGroup < ApplicationRecord
  include ConfigurationRecord

  has_and_belongs_to_many :users

  before_create :generate_unique_id

  def self.new_with_properties(params, user)
    user_group = UserGroup.new(params)
    user_group.add_creating_user(user)
    user_group
  end

  def add_creating_user(user)
    return unless [Permission::AGENCY, Permission::GROUP, Permission::SELF].include?(user.role&.group_permission)

    users << user
  end

  def self.list(user, validate_group_permission)
    if validate_group_permission.present? && user.role.group_permission == 'group'
      user.user_groups
    else
      UserGroup.all
    end
  end
end
