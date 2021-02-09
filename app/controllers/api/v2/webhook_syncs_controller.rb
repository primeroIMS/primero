# frozen_string_literal: true

# Trigger a webhook send on a record.
class Api::V2::WebhookSyncsController < Api::V2::RecordResourceController
  def create
    authorize! :sync_external, @record.class
    @record.queue_for_webhook(Webhook::POST)
    head :no_content
  end
end
