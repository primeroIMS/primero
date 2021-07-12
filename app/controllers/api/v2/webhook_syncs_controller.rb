# frozen_string_literal: true

# Trigger a webhook send on a record.
class Api::V2::WebhookSyncsController < Api::V2::RecordResourceController
  def create
    authorize! :sync_external, @record.class
    AuditLog.create(
      record: @record, action: AuditLog::WEBHOOK, destination: AuditLog::WEBHOOK,
      webhook_status: AuditLog::SENDING, timestamp: DateTime.now
    )
    @record.queue_for_webhook(Webhook::POST)
  end

  def update
    authorize! :update, @record
    @record.update_properties(record_params)
    
    @record.save!
  end  

  #TO-DO: Finish the post and API_key method
  def post
  #  authorize! :
  end 
  
  def api_key
  #  authorize! :
  end

  def basic_auth
    authorize! :auth_secret, @record
  end


end
