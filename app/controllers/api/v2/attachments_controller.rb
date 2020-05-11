# frozen_string_literal: true

# API endpoints for adding and removing attachments on Primero resources (usually records)
class Api::V2::AttachmentsController < Api::V2::RecordResourceController
  before_action { authorize!(:update, @record) }

  def create
    authorize_attach!(attachment_params[:field_name])
    @attachment = Attachment.new(attachment_params)
    @attachment.attach!
    updates_for_record(@record)
  end

  def destroy
    @attachment = Attachment.find(params[:id])
    authorize_attach!(@attachment.field_name)
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

  def authorize_attach!(field_name)
    return unless field_name

    permitted_fields = PermittedFieldService.new(
      current_user,
      model_class
    ).permitted_field_names
    raise Errors::ForbiddenOperation unless permitted_fields.include?(field_name)
  end

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