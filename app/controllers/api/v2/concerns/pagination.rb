# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Pagination helpers for parsing the controller params
module Api::V2::Concerns::Pagination
  extend ActiveSupport::Concern

  def page
    @page ||= params[:page].try(:to_i) || 1
  end

  def per
    return @per if @per.present?

    @per = params[:per].try(:to_i)
    @per = 20 unless @per.present?
    @per = [@per, 1000].min
  end

  def offset
    @offset ||= ((page - 1) * per)
  end

  def pagination
    { page:, per_page: per }
  end

  def pagination?
    params[:page].present? || params[:per].present?
  end

  def order_by
    @order_by ||= params[:order_by] || default_sort_field
  end

  def order
    @order ||= params[:order] || 'desc'
  end

  def sort_order
    { order_by => order }
  end

  def default_sort_field
    'created_at'
  end
end
