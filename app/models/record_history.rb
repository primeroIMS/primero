class RecordHistory < ApplicationRecord
  # Since Rails 5 belongs_to acts as a validate_presence_of.
  # This relation will be optional because will fail otherwise.
  belongs_to :record, polymorphic: true, optional: true

  def user
    #TODO: Refactor with User
    @user || User.find_by_user_name(self.user_name)
  end

  #TODO: This is an N+1 performance issue
  def user_organization
    self.user.organization
  end

end
