# frozen_string_literal: true

# Logs the event of the record being sent to an external system via a webhook
class RecordSendLog < ApplicationRecord
  SENDING = 'sending' # Started HTTP send request
  SENT = 'sent'       # Completed HTTP send request successfully
  FAILED = 'failed'   # Failed the HTTP send request
  SYNCED = 'synced' # The downstream system processed the send request and reverted

  belongs_to :record, polymorphic: true, optional: true
  belongs_to :user, optional: true
end
