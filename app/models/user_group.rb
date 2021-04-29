# frozen_string_literal: true

# Users belong to user groups which may be used to limit the records that an individual user may have access to.
class UserGroup < ApplicationRecord
  include ConfigurationRecord

  has_and_belongs_to_many :users

  scope :enabled, ->(is_enabled = true) { where.not(disabled: is_enabled) }

  before_create :generate_unique_id
 
  class << self
    def list(params = {})
      return enabled if params.blank?

      where(params)
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
