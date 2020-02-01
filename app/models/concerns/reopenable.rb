# frozen_string_literal: true

# Records that use this module may be closed and reopened,
# assuming they define the status attribute.
module Reopenable
  extend ActiveSupport::Concern

  included do
    store_accessor :data, :reopened_logs, :case_status_reopened

    after_initialize :default_reopened_logs
    before_save :close_record
    before_save :reopen_record
    before_save :update_reopened_logs
  end

  def default_reopened_logs
    self.reopened_logs ||= []
  end

  def add_reopened_log(user_name)
    log = {
      reopened_date: DateTime.now,
      reopened_user: user_name
    }.with_indifferent_access
    if reopened_logs.is_a? Array
      reopened_logs.unshift(log)
    else
      self.reopened_logs = [log]
    end
  end

  def reopened_date
    reopened_logs&.last&.dig('reopened_date')
  end

  def reopen_record
    return unless status == Record::STATUS_CLOSED
    return unless (changes_to_save_for_record.keys & %w[services_section incident_details]).present?

    self.status = Record::STATUS_OPEN
    self.case_status_reopened = true
  end

  def update_reopened_logs
    return unless case_status_reopened

    changes = changes_to_save_for_record
    if changes['status'] == [Record::STATUS_CLOSED, Record::STATUS_OPEN] &&
       changes['case_status_reopened'][1] == true
      add_reopened_log(last_updated_by)
    end
  end

  def close_record
    return unless status == Record::STATUS_CLOSED
    return unless changes_to_save_for_record['status'] == [Record::STATUS_OPEN, Record::STATUS_CLOSED]

    self.date_closure ||= Date.today
  end
end
