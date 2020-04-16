# frozen_string_literal: true

# Model of the record histories
class RecordHistory < ApplicationRecord
  belongs_to :record, polymorphic: true

  def user
    #TODO: Refactor with User
    User.find_by_user_name(user_name)
  end

  #TODO: This is an N+1 performance issue
  def user_organization
    Agency.find(user.agency_id)
  end
end
