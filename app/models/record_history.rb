class RecordHistory < ApplicationRecord
  belongs_to :record, polymorphic: true

  def user
    #TODO: Refactor with User
    @user || User.find_by_user_name(self.user_name)
  end

  #TODO: This is an N+1 performance issue
  def user_organization
    self.user.organization
  end

end
