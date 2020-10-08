# frozen_string_literal: true

# API to fetch the list of flags given a user
class Api::V2::FlagsController < ApplicationApiController
  include Api::V2::Concerns::Pagination

  def index
    authorize! :index, Flag
    @flags = Flag.by_owner(query_scope, record_types)
    # results = current_user.tasks(pagination)
    # @flags = results[:tasks]
    # @total = results[:total]
  end

  # TODO: refactor other methods from old flags controller


  def query_scope
    current_user.record_query_scope(model_class, params[:id_search])
  end

  def record_types
    @record_types = params[:record_type]&.split(',')
  end
end
