module Flaggable
  extend ActiveSupport::Concern
  include Sunspot::Rails::Searchable

  included do
    has_many :flags, as: :record

    after_save :index_flags, unless: Proc.new{ Rails.env == 'production' }

    def add_flag(message, date, user_name)
      flag = Flag.new(flagged_by: user_name, message: message, date: date, created_at: DateTime.now)
      self.flags << flag
    end

    #TODO: Is this necessary?
    def index_flags
      if self.flags.present?
        Sunspot.index! self.flags
      end
    end

    def remove_flag(id, user_name, unflag_message)
      flag = self.flags.find(id)
      if flag.present?
        flag.unflag_message = unflag_message
        flag.unflagged_date = Date.today
        flag.unflagged_by = user_name
        flag.removed = true
        flag.save!
      end
    end

    def flag_count
      self.flags.where(removed: false).count
    end

    def flagged?
      self.flag_count > 0
    end
    alias_method :flag, :flagged?

    def self.batch_flag(ids, message, date, user_name)
      records = self.find(ids)
      records.each do |record|
        record.add_flag(message, date, user_name)
      end
    end

  end
end
