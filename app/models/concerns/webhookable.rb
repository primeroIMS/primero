# frozen_string_literal: true

# Note: Currently this concern contains logic / fields specific to Child/Case.
# Note: This is dependent on the Serviceable concern.  Serviceable must be included before Workflow
module Webhookable
  extend ActiveSupport::Concern

  included do
    has_many :record_send_logs, as: :record
    attribute :mark_synced, :boolean
    attribute :mark_synced_url, :string

    before_update :log_synced
    after_create { queue_for_webhook(Webhook::CREATE) }
    after_update { queue_for_webhook(Webhook::UPDATE) }
  end

  # We'll give ourselves a rubocop pass on account of custom SQL
  # rubocop:disable Metrics/MethodLength
  def webhook_status
    return @webhook_status if @webhook_status

    sql = RecordSendLog.sanitize_sql(
      [
        'select logs.destination, logs.status, logs.completed_at ' \
        'from record_send_logs logs,' \
        '     (select destination, max(completed_at) as max_completed_at' \
        '      from record_send_logs' \
        '      where record_id = :record_id and record_type = :record_type' \
        '      group by destination) latest ' \
        'where logs.destination = latest.destination' \
        '      and logs.completed_at = latest.max_completed_at' \
        '      and logs.record_id = :record_id' \
        '      and logs.record_type = :record_type',
        { record_id: id, record_type: self.class.name }
      ]
    )
    @webhook_status = RecordSendLog.connection.select_all(sql).to_hash
                                   .map { |r| [r['destination'], DestringifyService.destringify(r)] }
                                   .to_h.with_indifferent_access
  end
  # rubocop:enable Metrics/MethodLength

  private

  def log_synced
    return unless mark_synced && mark_synced_url.present?

    timestamp = DateTime.now
    RecordSendLog.create(
      record: self, destination: mark_synced_url,
      status: RecordSendLog::SYNCED, started_at: timestamp, completed_at: timestamp
    )
  end

  def queue_for_webhook(action)
    # TODO: Any other constraints for sharing publishing records?
    # TODO: Module scope, for example?
    return unless Webhook.count.positive?

    WebhookJob.perform_later(self.class.parent_form, id, action)
  end
end
