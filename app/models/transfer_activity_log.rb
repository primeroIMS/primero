# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Represents a transfer activity for a record
class TransferActivityLog < ActivityLog
  def initialize(record_history)
    super(record_history)
    self.type = TransferActivityLog.type
    self.data = generate_data
  end

  class << self
    def list(user, params = {})
      query = transfer_query(RecordHistory.includes(:record), user)
      query = query.where(datetime: params[:datetime_range]) if params[:datetime_range].present?

      query.map do |record_history|
        transfer_activity = new(record_history)
        transfer_activity.record_access_denied = user.cannot?(:read, record_history.record)
        transfer_activity
      end
    end

    def type
      Transfer.name.downcase
    end

    private

    def transfer_query(query, user)
      managed_user_names = user.managed_user_names

      accepted_transfer_query(query, managed_user_names).or(
        rejected_transfer_query(query, managed_user_names)
      ).order('datetime DESC')
    end

    def accepted_transfer_query(query, managed_user_names)
      query.where(
        'record_changes @> ?',
        { transfer_status: { from: Transition::STATUS_INPROGRESS, to: Transition::STATUS_ACCEPTED } }.to_json
      ).where('record_changes->\'owned_by\'->\'from\' <@ ?', managed_user_names.to_json)
    end

    def rejected_transfer_query(query, managed_user_names)
      rejected_query = query.where(
        'record_changes @> ?',
        { transfer_status: { from: Transition::STATUS_INPROGRESS, to: Transition::STATUS_REJECTED } }.to_json
      )

      rejected_query.where(
        'record_changes->\'assigned_user_names\'->\'from\' ?| array[:users]', users: managed_user_names
      ).or(
        rejected_query.where('record_changes->\'associated_user_names\'->\'from\' ?| array[:users]',
                             users: managed_user_names)
      )
    end
  end

  private

  def generate_data
    transfer_status = record_history.record_changes.dig('transfer_status', 'to')

    return {} unless [Transition::STATUS_ACCEPTED, Transition::STATUS_REJECTED].include?(transfer_status)

    {
      status: {
        from: record_history.record_changes.dig('transfer_status', 'from'),
        to: record_history.record_changes.dig('transfer_status', 'to')
      }
    }.merge(send("#{transfer_status}_data"))
  end

  def accepted_data
    {
      owned_by: {
        from: record_history.record_changes.dig('owned_by', 'from'),
        to: record_history.record_changes.dig('owned_by', 'to')
      }
    }
  end

  def rejected_data
    {
      owned_by: {
        from: record_history.record.owned_by,
        to: (
          record_history.record_changes.dig(
            'assigned_user_names', 'from'
          ) - record_history.record_changes.dig('assigned_user_names', 'to')
        ).first
      }
    }
  end
end
