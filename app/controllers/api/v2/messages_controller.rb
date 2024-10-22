# frozen_string_literal: true

class Api::V2::MessagesController < ApplicationApiController
  include Api::V2::Concerns::Pagination
  include Api::V2::Concerns::JsonValidateParams
  def index
    @messages = Message.all
  end
end
