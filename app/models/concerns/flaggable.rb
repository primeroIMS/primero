# frozen_string_literal: true

# Describes records that can have flags applied to them.
module Flaggable
  extend ActiveSupport::Concern
  include Sunspot::Rails::Searchable

  included do
    searchable do
      boolean :flagged
    end

    has_many :flags, as: :record
    has_many :active_flags, -> { where(removed: false) }, as: :record, class_name: 'Flag'
  end

  def add_flag(message, date, user_name)
    date_flag = date.presence || Date.today
    flag = Flag.new(flagged_by: user_name, message: message, date: date_flag, created_at: DateTime.now)
    flags << flag
    flag
  end

  def remove_flag(id, user_name, unflag_message)
    flag = flags.find_by(id: id)
    return unless flag.present?

    flag.unflag_message = unflag_message
    flag.unflagged_date = Date.today
    flag.unflagged_by = user_name
    flag.removed = true
    flag.save!
    flag
  end

  def flag_count
    active_flags.size
  end

  def flagged?
    flag_count.positive?
  end
  alias flagged flagged?

  # ClassMethods
  module ClassMethods
    def batch_flag(records, message, date, user_name)
      ActiveRecord::Base.transaction do
        records.each do |record|
          record.add_flag(message, date, user_name)
        end
      end
    end
  end
end
