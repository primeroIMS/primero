# frozen_string_literal: true

# Trigger a webhook send on a record.
class Api::V2::WebhookSyncsController < Api::V2::RecordResourceController
  def create
    # TODO: Confirm a read permission is good enough to trigger a sync.
    authorize! :read, @record
    @record.queue_for_webhook(Webhook::POST)
    head :no_content
  end
end
