module RecordFilteringPagination
  extend ActiveSupport::Concern

  included do
  end

  def page
    params[:page] ? params[:page].to_i : 1
  end

  def per_page
    params[:per] ? params[:per].to_i : 25
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
    params[:scope] || {}
  end
end
