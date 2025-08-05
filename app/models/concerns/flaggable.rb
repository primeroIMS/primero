# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Describes records that can have flags applied to them.
module Flaggable
  extend ActiveSupport::Concern

  included do
    store_accessor(:data, :flagged)

    has_many :flags, as: :record
    has_many :active_flags, -> { where(removed: false) }, as: :record, class_name: 'Flag'

    before_save :calculate_flagged
  end

  def add_flag(message, date, user_name)
    date_flag = date.presence || Date.today
    flag = Flag.new(flagged_by: user_name, message:, date: date_flag, created_at: DateTime.now)
    flags << flag

    flag
  end

  def add_flag!(message, date, user_name)
    flag = add_flag(message, date, user_name)
    save! && flag
  end

  def update_flag(id, user_name, params)
    flag = flags.find(id)

    if params[:unflag_message].present?
      flag.mark_removed(user_name, params[:unflag_message])
    else
      flag.updated_by = user_name
      flag.message = params[:message]
      flag.date = params[:date]
    end

    flag
  end

  def update_flag!(id, user_name, params)
    flag = update_flag(id, user_name, params)
    flag.save!

    save! && flag
  end

  def flag_count
    return flags.reject(&:removed).size if new_record?

    active_flags.size
  end

  def flagged?
    flag_count.positive?
  end

  def calculate_flagged
    self.flagged = flagged?
    flagged
  end

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
