# frozen_string_literal: true

# API to fetch the list of flags given a user
class Api::V2::FlagsOwnersController < ApplicationApiController
  include Api::V2::Concerns::Pagination

  before_action :load_flags, only: %i[index]

  def index
    # TODO: handle pagination
    # TODO: fix front end for old index by record id
    authorize! :index, Flag

    # results = current_user.tasks(pagination)
    # @flags = results[:tasks]
    # @total = results[:total]
  end

  protected

  def load_flags
    @flags = Flag.by_owner(query_scope, record_types)

    # TODO: this shouldn't be in a controller
    @flags.map { |flag| flag['r_name'] = '*******' if flag['r_name'].present? && flag['r_hidden_name'].present? }
  end

  private

  def query_scope
    current_user.record_query_scope(model_class, params[:id_search])
  end

  def record_types
    @record_types = params[:record_type]&.split(',')
  end
end
