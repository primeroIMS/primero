class Message < ApplicationRecord
  has_and_belongs_to_many :recipients, class_name: 'User', join_table: 'messages_recipients'
  validates :body, presence: true

  attr_writer :recipient_groups

  before_create :materialize_recipients

  after_create :send_message

  def materialize_recipients
    recipient_users = Set.new
    @recipient_groups ||= []
    @recipient_groups.each do |group_uid|
      group = UserGroup.find_by(unique_id: group_uid)
      recipient_users.add(group.users)
    end
    recipients << recipient_users.to_a
  end

  def send_message
    SendRapidproMessagesJob.perform_later(id)
  end
end
