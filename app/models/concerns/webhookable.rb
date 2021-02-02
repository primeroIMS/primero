# frozen_string_literal: true

# Supporting logic and fields for
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

    sql = AuditLog.sanitize_sql(
      [
        "select logs.resource_url as destination, logs.metadata ->> 'webhook_status' as status, logs.timestamp " \
        'from audit_logs logs,' \
        '     (select resource_url, max(timestamp) as max_timestamp' \
        '      from audit_logs' \
        "      where record_id = :record_id and record_type = :record_type and action = 'webhook'" \
        '      group by resource_url) latest ' \
        'where logs.resource_url = latest.resource_url' \
        '      and logs.timestamp = latest.max_timestamp' \
        '      and logs.record_id = :record_id' \
        '      and logs.record_type = :record_type' \
        "      and logs.action = 'webhook'",
        { record_id: id, record_type: self.class.name }
      ]
    )
    @webhook_status = AuditLog.connection.select_all(sql).to_hash
                              .map { |r| [r['destination'], DestringifyService.destringify(r)] }
                              .to_h.with_indifferent_access
  end
  # rubocop:enable Metrics/MethodLength

  private

  def log_synced
    return unless mark_synced && mark_synced_url.present?

    timestamp = DateTime.now
    AuditLog.create(
      record: self, resource_url: mark_synced_url, action: AuditLog::WEBHOOK,
      webhook_status: AuditLog::SYNCED, timestamp: timestamp
    )
  end

  def queue_for_webhook(action)
    # TODO: Any other constraints for sharing publishing records?
    # TODO: Module scope, for example?
    return unless Webhook.count.positive?

    WebhookJob.perform_later(self.class.parent_form, id, action)
  end
end
