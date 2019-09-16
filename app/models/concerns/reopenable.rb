module Reopenable
  extend ActiveSupport::Concern

  included do
    store_accessor :data, :reopened_logs, :case_status_reopened

    after_initialize :default_reopened_logs
    before_save :reopen_record
    before_save :update_reopened_logs

    def default_reopened_logs
      self.reopened_logs ||= []
    end

    def add_reopened_log(user_name)
      log = { 'reopened_date' => DateTime.now, 'reopened_user' => user_name }
      if self.reopened_logs.is_a? Array
        self.reopened_logs.unshift(log)
      else
        self.reopened_logs = [log]
      end
    end

    def reopened_date
      self.reopened_logs.try(:last).try(:[], 'reopened_date')
    end

    def reopen_record
      if self.status == Record::STATUS_CLOSED
        if changes_to_save_for_record.keys.any? { |key| %w[services_section incident_details].include?(key) }
          self.status = Record::STATUS_OPEN
          self.case_status_reopened = true
        end
      end
    end

    def update_reopened_logs
      if self.case_status_reopened
        changes = changes_to_save_for_record
        if changes['status'] == [Record::STATUS_CLOSED, Record::STATUS_OPEN] &&
            changes['case_status_reopened'][1] == true
          self.add_reopened_log(self.last_updated_by)
        end
      end
    end

  end

end
