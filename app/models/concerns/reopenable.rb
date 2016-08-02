module Reopenable
  extend ActiveSupport::Concern

  included do
    property :reopened_logs, [ReopenLog], :default => []

    def add_log(case_reopened_user)
      log = ReopenLog.new(
                    :case_reopened_date => DateTime.now,
                    :case_reopened_user => case_reopened_user)

      self.reopened_logs.unshift(log)
      reopened_logs
    end
  end

end
