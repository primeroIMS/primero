class UserGroup < ApplicationRecord
  include Configuration

  before_create :set_unique_id

  has_and_belongs_to_many :users

  class << self
    alias super_clear clear
    def clear
      all.each do |ug|
        ug.users.destroy(ug.users)
      end
      super_clear
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

  private

  def set_unique_id
    self.unique_id = "#{self.class.name}-#{name}".parameterize.dasherize unless unique_id.present?
  end
end
