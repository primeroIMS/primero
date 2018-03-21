class AuditLog < CouchRest::Model::Base
  include PrimeroModel

  use_database :audit_log
  before_create :set_created_at

  property :user_name
  property :action_name
  property :record_id
  property :record_type
  property :created_at, DateTime

  design do
    view :by_created_at
  end

  def set_created_at
    self[:created_at] = Primero::Clock.current_formatted_time
  end

end
