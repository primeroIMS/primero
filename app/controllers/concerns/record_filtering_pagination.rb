module RecordFilteringPagination
  extend ActiveSupport::Concern

  included do
    before_filter :draw, only: [:index]
  end

  def page
    params[:page].to_i || 1
  end

  def per_page
    params.fetch(:length, 20).to_i
  end

  def order
    if params[:order] || params[:column]
      {:"#{sort_column}" => sort_direction.downcase.to_sym}
    else
      {created_at: :desc}
    end
  end

  def pagination
    {page: page, per_page: per_page}
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

  def draw
    @draw = params[:draw]
  end
end
