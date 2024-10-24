# frozen_string_literal: true

class Api::V2::MessagesController < ApplicationApiController
  include Api::V2::Concerns::Pagination
  include Api::V2::Concerns::JsonValidateParams
  def index
    # TODO: authz
    @messages = Message.all
  end

  def create
    permitted = params.permit(:body)
    @message = Message.new(permitted)
    @message.save
    # status = params[:data][:id].present? ? 204 : 200
    status = 204
    render :create, status:
  end
end
