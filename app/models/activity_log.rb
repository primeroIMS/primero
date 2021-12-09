# frozen_string_literal: true

# Retrieves a list of record histories by type
class ActivityLog
  attr_accessor :record_history, :data, :datetime, :performed_by, :record_access_denied,
                :record_display_id, :record_id, :record_type, :type

  class << self
    def list(user, params = {})
      selected_activities = activities.select { |activity| params[:types].include?(activity.type) }
      selected_activities = selected_activities.map { |klass| klass.list(user, params) }.flatten.sort_by(&:datetime)

      return selected_activities.reverse if params[:order] == 'desc'

      selected_activities
    end

    def activities
      [TransferActivityLog]
    end

    def activity_types
      activities.map(&:type)
    end
  end

  def initialize(record_history)
    self.record_history = record_history
    self.datetime = record_history.datetime
    self.performed_by = record_history.user_name
    self.record_type = record_history.record_type
    self.record_id = record_history.record_id
    self.record_display_id = record_history.record.display_id
  end
end
