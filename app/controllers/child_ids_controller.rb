class ChildIdsController < ApplicationController
  def all
    @user = current_user.managed_user_names
    @children = Child.by_ids_and_revs.select { |f| @user.include? f.owned_by }
    if params["mobile"]
      @children = mark_for_mobile(@children)
    end
    if params["last_update"]
      @children = new_update_after_last_update(@children, params["last_update"])
    end
    @children = show_ids_and_revs(@children)
    render :json => @children
  end

  def new_update_after_last_update(children, last_update)
    children = children.select { |f| f.last_updated_at > last_update }
    children
  end

  def mark_for_mobile(children)
    children = children.select { |f| f.marked_for_mobile? }
    children
  end

  def show_ids_and_revs(children)
    children = children.map do |child|
      child_ids_and_revs = Hash.new
      child_ids_and_revs["_id"], child_ids_and_revs["_rev"] = child._id, child._rev
      child_ids_and_revs
    end
    children
  end


end