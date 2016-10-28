class ChildIdsController < ApplicationController
  def all
    child_json = Child.fetch_all_ids_and_revs(managed_users, marked_for_mobile, last_update_date)
    render :json => child_json
  end

  private

  def managed_users
    current_user.managed_user_names
  end

  def marked_for_mobile
    ['true', '1'].include? params["mobile"] ? true : false
  end

  def last_update_date
    @last_update_date ||= params["last_update"]
  end
end