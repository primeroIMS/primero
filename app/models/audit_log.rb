class AuditLog < ActiveRecord::Base

  after_initialize do
    self.timestamp ||= DateTime.now
  end

  belongs_to :record, :polymorphic => true

end
