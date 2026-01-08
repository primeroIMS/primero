# frozen_string_literal: true

# Copyright (c) 2014 - 2026 UNICEF. All rights reserved.

# Controller to handle serving files stored in ActiveStorage
class StorageController < ApplicationController
  before_action :authenticate_user_with_unauthorized!
  before_action :set_blob

  def show
    send_data(
      @blob.download,
      filename: @blob.filename.to_s,
      type: @blob.content_type,
      disposition: 'inline'
    )
  end

  private

  def authenticate_user_with_unauthorized!
    head :unauthorized unless current_user
  end

  def set_blob
    @blob = ActiveStorage::Blob.find(params[:id])
  end
end
