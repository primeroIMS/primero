# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

# API to list identified users
class Api::V2::UsersIdentifiedController < ApplicationApiController
  include Api::V2::Concerns::Pagination

  def index
    authorize!(:attribute, Child)
    @users = User.search_identified_by_name(permitted_params[:query])
    @total = @users.size
    @users = @users.paginate(pagination) if pagination?
    render 'api/v2/users/users_identified'
  end

  def permitted_params
    params.permit(:query, :per, :page)
  end
end
