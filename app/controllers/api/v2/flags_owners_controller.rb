# frozen_string_literal: true

# API to fetch the list of flags given a user
class Api::V2::FlagsOwnersController < ApplicationApiController
  include Api::V2::Concerns::Pagination

  def index
    authorize! :index, Flag
    @flags = Flag.by_owner(query_scope, active_only?, record_types, flagged_by)
    @total = @flags.size
    @flags = @flags.paginate(pagination) if pagination?
  end

  private

  def query_scope
    current_user.record_query_scope(model_class, params[:id_search])
  end

  def record_types
    @record_types = params[:record_type]&.split(',')
  end

  def flagged_by
    @flagged_by = params[:flagged_by_me] == 'true' ? current_user.user_name : nil
  end

  def active_only?
    params[:active_only] == 'true'
  end
end
