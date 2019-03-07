class AuditLog < ActiveRecord::Base

  after_initialize do
    self.timestamp ||= DateTime.now
  end

  belongs_to :record, :polymorphic => true

  scope :find_by_user_name, ->(user_name) { where(user_name: user_name) }

  scope :find_by_timestamp, ->(from = Time.at(0).to_datetime, to = DateTime.now.end_of_day) {
    where(timestamp: (from || Time.at(0).to_datetime)..to)
  }

end
