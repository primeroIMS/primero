# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# API endpoints for adding and removing attachments on Primero resources (usually records)
class Api::V2::AttachmentsController < Api::V2::RecordResourceController
  def create
    @attachment = Attachment.new(attachment_params)
    authorize! :create, @attachment
    @attachment.attach!
    updates_for_record(@record)
  end

  def destroy
    @attachment = Attachment.find(params[:id])
    authorize! :destroy, @attachment
    @attachment.detach!
    updates_for_record(@record)
  end

  def create_action_message
    'attach'
  end

  def destroy_action_message
    'detach'
  end

  private

  def attachment_params
    return @attachment_params if @attachment_params

    @attachment_params = params.require(:data).permit(
      :field_name, :date, :description, :is_current,
      :comments, :attachment, :file_name, :attachment_type
    ).to_h
    @attachment_params[:record] = @record
    @attachment_params
  end
end
