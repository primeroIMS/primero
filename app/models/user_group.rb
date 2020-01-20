class UserGroup < ApplicationRecord

  include Configuration

  before_create :set_unique_id

  has_and_belongs_to_many :users

  class << self
    alias super_clear clear
    def clear
      self.all.each do |ug|
        ug.users.destroy(ug.users)
      end
      super_clear
    end

    def new_with_properties(user_group_params)
      user_group = UserGroup.new(user_group_params.except(:user_ids))
      user_group.users = User.where(id: user_group_params[:user_ids])
      user_group
    end
  end

  def update_properties(user_group_params)
    assign_attributes(user_group_params.except(:user_ids))
    self.users = User.where(id: user_group_params[:user_ids])
  end

  private

  def set_unique_id
    unless self.unique_id.present?
      self.unique_id = "#{self.class.name}-#{self.name}".parameterize.dasherize
    end
  end
end
