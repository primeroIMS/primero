# frozen_string_literal: true

# API endpoint for Agency CRUD
class Api::V2::WebhooksController < ApplicationApiController
  before_action :load_webhook, only: %i[show update destroy]

  def index
    authorize! :index, Webhook
    @webhooks = Webhook.all
  end

  def show
    authorize! :read, @webhook
  end

  def create
    authorize! :create, Webhook
    @webhook = Webhook.new(webhook_params.except(:id))
    @webhook.save!
    status = params[:data][:id].present? ? 204 : 200
    render :create, status: status
  end

  def update
    authorize! :update, @webhook
    @webhook.update(webhook_params)
    @webhook.save!
  end

  def destroy
    authorize! :destroy, @webhook
    @webhook.destroy!
  end

  def webhook_params
    params.require(:data).permit(
      :id, :events, :url, :role_unique_id, metadata: {}
    )
  end

  protected

  def load_webhook
    @webhook = Webhook.find(params[:id])
  end
end
