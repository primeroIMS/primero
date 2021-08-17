# frozen_string_literal: true

# Connector that encapsulates webhook requests: Sending POST to external endpoints based on some system event.
# For now connection parameters for these endpoints is configured through environment variables.
class ApiConnector::WebhookConnector < ApiConnector::AbstractConnector
  IDENTIFIER = 'webhook'

  attr_accessor :webhook_url, :webhook_path, :role_unique_id

  def self.id
    IDENTIFIER
  end

  def initialize(options = {})
    self.webhook_url = options['webhook_url']
    connection_opts = self.connection_opts(webhook_url)
    self.webhook_path = connection_opts.delete('webhook_path')
    self.role_unique_id = options['webhook_role_unique_id']
    super(options.merge(connection_opts))
  end

  def create(record)
    update(record)
  end

  def update(record)
    # TODO: Retry logic
    log = log_send(record)
    status, response = connection.post(webhook_url, post_params(record))
    log_response(log, status, response)
    { status: status, response: response }
  end

  def syncable?(_record)
    true
  end

  # Trigger the relevant_updates check
  def new?(_record)
    false
  end

  # Not that it really matters
  def relevant_updates?(_record)
    true
  end

  def post_params(record)
    field_names = PermittedFieldService.new(user, record.class).permitted_field_names
    data = {
      record_id: record.id,
      record_type: record.class.parent_form,
      hostname: Rails.application.routes.default_url_options[:host]
    }.merge(RecordDataService.data(record, user, field_names))
    { data: data }
  end

  def log_send(record)
    AuditLog.create(
      action: AuditLog::WEBHOOK, record: record, resource_url: webhook_url,
      webhook_status: AuditLog::SENDING, timestamp: DateTime.now
    )
  end

  def log_response(log, http_status, response)
    status = http_status < 400 ? AuditLog::SENT : AuditLog::FAILED
    log.update(metadata: { webhook_status: status, webhook_response: response })
  end

  def role
    @role ||= Role.find_by(unique_id: role_unique_id)
  end

  def user
    @user || User.new(role_id: role.id)
  end

  def connection_opts(url)
    uri = URI(url)
    {
      'tls' => (uri.scheme == 'https'),
      'host' => uri.host,
      'webhook_path' => uri.path,
      'port' => uri.port
    }
  end
end
