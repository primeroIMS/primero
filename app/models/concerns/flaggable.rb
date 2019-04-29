module Flaggable
  extend ActiveSupport::Concern
  include Sunspot::Rails::Searchable

  included do
    has_many :flags, as: :record

    after_save :index_flags, unless: Proc.new{ Rails.env == 'production' }


    #Add a flag. The caller still need to call save method to persistence the changes by the method.
    #The method was added to be called in the controller. It returns the flag added to the array.
    def add_flag(message, date, user_name)
      flag = Flag.new(:flagged_by => user_name, :message => message, :date => date, :created_at => DateTime.now)
      self.flags << flag
      (flag.present? && !flag.new_record?) ? flag : nil
    end

    #TODO: Is this necessary?
    def index_flags
      if self.flags.present?
        Sunspot.index! self.flags
      end
    end

    #Remove flag. The caller still need to call the save method to persistence the changed by the method.
    #The method was added to be called in the controller. It returns the flag removed or nil if the tag is not removed.
    #To remove a tag the value of the message_to_delete should be found in the position described by the index parameter.
    #The index is used as a key to identify what flag should be removed.
    def remove_flag(id, message_to_delete, user_name, unflag_message, unflag_date)
      flag = self.flags.find(id)
      if flag.present? and flag.message == message_to_delete
        flag.unflag_message = unflag_message
        flag.unflagged_date = unflag_date
        flag.unflagged_by = user_name
        flag.removed = true
        flag.save ? flag : nil
      else
        nil
      end
    end

    def flag_count
      self.flags.where(removed: false).count
    end

    def flagged?
      self.flag_count > 0
    end
    alias_method :flag, :flagged?

  end
end
