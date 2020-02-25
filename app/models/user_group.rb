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
      if user.group_permission?(Permission::AGENCY) || user.group_permission?(Permission::GROUP) ||
         user.group_permission?(Permission::SELF)
        user_group.users = [user]
      end
      user_group
    end
  end

  private

  def set_unique_id
    self.unique_id = "#{self.class.name}-#{name}".parameterize.dasherize unless unique_id.present?
  end
end
