module Api::V2::Concerns
  module FilteringPagination
    extend ActiveSupport::Concern

    def page
      @page ||= (params[:page] ? params[:page].to_i : 1)
    end

    def per
      @per ||= (params[:per] ? params[:per].to_i : 20)
    end

    def offset
      @offset ||= ((page - 1) * per)
    end

    def pagination
      { page: page, per_page: per }
    end

    def order_by
      @order_by ||= (params[:order_by] ? params[:order_by] : 'created_at')
    end

    def order
      @order ||= (params[:order] ? params[:order] : 'desc')
    end

  end
end