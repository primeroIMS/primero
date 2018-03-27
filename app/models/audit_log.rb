class AuditLog < CouchRest::Model::Base
  include PrimeroModel

  use_database :audit_log

  property :user_name
  property :action_name
  property :record_id
  property :display_id
  property :record_type
  property :timestamp, DateTime

  design do
    view :by_timestamp
  end

  def initialize(*args)
    super

    self.timestamp ||= DateTime.now
  end
end
