class AuditLog < ApplicationRecord

  after_initialize do
    self.timestamp ||= DateTime.now
  end

  belongs_to :record, polymorphic: true, optional: true

  def mobile?
    self.mobile_data.try(:[], 'mobile_id').present?
  end

end
