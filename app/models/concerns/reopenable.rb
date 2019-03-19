module Reopenable
  extend ActiveSupport::Concern

  included do
    store_accessor :data, :reopened_logs

    after_initialize :default_reopened_logs

    def default_reopened_logs
      self.reopened_logs ||= []
    end

    def add_reopened_log(user)
      log = {'reopened_date' => DateTime.now, 'reopened_user' => user}
      if self.reopened_logs.is_a? Array
        self.reopened_logs.unshift(log)
      else
        self.reopened_logs = [log]
      end
    end

    def reopened_date
      self.reopened_logs.try(:last).try(:[], 'reopened_date')
    end
  end

end
