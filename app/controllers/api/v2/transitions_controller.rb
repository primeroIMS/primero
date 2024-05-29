# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# API to list all transitions (transfers, referrals, assigns, etc.) for a record
class Api::V2::TransitionsController < Api::V2::RecordResourceController
  def index
    authorize! :read, @record
    types = params[:types].try(:split, ',')
    @transitions = @record.transitions_for_user(current_user, types)
    render 'api/v2/transitions/index'
  end
end
