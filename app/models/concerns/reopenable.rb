module Reopenable
  extend ActiveSupport::Concern

  included do
    property :reopened_logs, [ReopenLog], :default => []

    def add_reopened_log(user)
      log = ReopenLog.new(
                    :reopened_date => DateTime.now,
                    :reopened_user => user)

      self.reopened_logs.unshift(log)
      reopened_logs
    end

    def reopened_date
      self.try(:reopened_logs).try(:last).try(:reopened_date)
    end
  end

end
