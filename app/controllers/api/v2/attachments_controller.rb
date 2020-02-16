# frozen_string_literal: true

# API endpoints for adding and removing attachments on Primero resources (usually records)
class Api::V2::AttachmentsController < Api::V2::RecordResourceController
  before_action { authorize!(:update, @record) }

  def create
    @attachment = Attachment.new(attachment_params)
    @attachment.attach!
    updates_for_record(@record)
  end

  def destroy
    @attachment = AttachmentService.find(params[:id])
    @attachment.detach!
    updates_for_record(@record)
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