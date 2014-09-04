module RecordFilteringPagination
  extend ActiveSupport::Concern

  included do
  end

  def page
    params[:page] ? params[:page].to_i : 1
  end

  def per_page
    params[:per] ? params[:per].to_i : 20
  end

  def pagination
    { page: page, per_page: per_page }
  end

  def order
    column = params[:column]
    order = params[:order]
    if order && column
      {:"#{column}" => order.downcase.to_sym}
    else
      {created_at: :desc}
    end
  end

  def filter
    filter = if params[:scope].present?
      params[:scope].reject{|k,v| k == 'users'}
    else
      {}
    end
  end

  def associated_users
    @associated_users ||= if current_user.is_manager?
      #TODO: This method needs to change here once Josh gets the users filter in place on the index page
      current_user.all_reports.map(&:user_name) + [current_user.user_name]
    else
      [current_user.user_name]
    end
  end

  def users_filter
    if params[:scope].present? and params[:scope][:users].present?
      params[:scope][:users].split(',')
    else
      associated_users
    end

  end



end
