# frozen_string_literal: true

# API READ endpoint for Record Histories
class Api::V2::RecordHistoriesController < Api::V2::RecordResourceController
  include Api::V2::Concerns::Pagination

  def index
    authorize_change_log(@record)
    filter_record_histories = @record.ordered_histories
    @total = filter_record_histories.size
    @record_histories = filter_record_histories.paginate(pagination)
  end

  private

  def authorize_change_log(record)
    can_assign =
      current_user.can?(:read, record) ||
      current_user.can?(:change_log, record)
    raise Errors::ForbiddenOperation unless can_assign
  end
end
