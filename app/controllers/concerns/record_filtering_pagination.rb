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
    if params[:order] || params[:column]
      {:"#{sort_column}" => sort_direction.downcase.to_sym}
    else
      {created_at: :desc}
    end
  end

  def sort_column
    order_column = params[:order]['0'][:column]
    params[:columns][order_column][:data] || {}
  end

  def sort_direction
    options = %w(desc asc)
    options.include?(params[:order]['0'][:dir]) ? params[:order]['0'][:dir].upcase : 'ASC'
  end

  def filter
    params[:scope] || {}
  end
end
