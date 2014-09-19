module Flaggable
  extend ActiveSupport::Concern

  included do
    property :flags, [Flag], :default => []
    property :flag_count, :default => 0

    design do
      view :by_flag,
            :map => "function(doc) {
                  if (doc.hasOwnProperty('flags'))
                 {
                   if (!doc.hasOwnProperty('duplicate') || !doc['duplicate']) {
                     emit(doc['flags'].length > 0,null);
                   }
                 }
              }"
    end

    def flag_message_flagged_by
      #TODO Keep the panel in the show and the edit show one of the flag, the last one.
      #that panel eventually will change.
      flag = self.flags.last
      I18n.t("#{self.class.name.underscore.downcase}.flagged_as_suspected")+" #{flag.flagged_by}: #{flag.message}" if flag
    end

    #Add a flag. The caller still need to call save method to persistence the changes by the method.
    #The method was added to be called in the controller. It returns the flag added to the array.
    def add_flag(message, date, user_name)
      flag = Flag.new(:flagged_by => user_name, :message => message, :date => date)
      self.flags << flag
      flag
    end

    #Remove flag. The caller still need to call the save method to persistence the changed by the method.
    #The method was added to be called in the controller. It returns the flag removed or nil if the tag is not removed.
    #To remove a tag the value of the message_to_delete should be found in the position described by the index parameter.
    #The index is used as a key to identify what flag should be removed.
    def remove_flag(message_to_delete, index, user_name, unflag_message)
      flag = self.flags[index.to_i]
      if flag.present? and flag.message == message_to_delete
        # self.flags.delete_at(index.to_i)
        flag[:unflag_message] =unflag_message
        flag[:removed] = true
        return flag
      else
        nil
      end
    end

    def flagged?
      self.flags.present?
    end
    alias_method :flag, :flagged?

    def flag_count
      self.flags.select{|f| !f.removed}.count
    end

  end

  module ClassMethods
    def flagged
      by_flag(:key => true)
    end
  end

end
