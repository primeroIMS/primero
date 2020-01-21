module Api::V2::Concerns
  module Pagination
    extend ActiveSupport::Concern

    def page
      @page ||= (params[:page].try(:to_i) || 1)
    end

    def per
      @per ||= (params[:per].try(:to_i) || 20)
    end

    def offset
      @offset ||= ((page - 1) * per)
    end

    def pagination
      { page: page, per_page: per }
    end

    def order_by
      @order_by ||= (params[:order_by] || default_sort_field)
    end

    def order
      @order ||= (params[:order] || 'desc')
    end

    def sort_order
      { order_by => order}
    end

    def default_sort_field
      'created_at'
    end

  end
end