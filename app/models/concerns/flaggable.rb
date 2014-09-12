module Flaggable
  extend ActiveSupport::Concern

  included do
    before_save :flaggable_update_flag

    property :flag, TrueClass, :default => false
    property :flags, [Flag], :default => []

    design do
      view :by_flag,
            :map => "function(doc) {
                  if (doc.hasOwnProperty('flag'))
                 {
                   if (!doc.hasOwnProperty('duplicate') || !doc['duplicate']) {
                     emit(doc['flag'],null);
                   }
                 }
              }"
    end

    def flag_message_flagged_by
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
    def remove_flag(message_to_delete, index, user_name)
      flag = self.flags[index.to_i]
      if flag.present? and flag.message == message_to_delete
        self.flags.delete_at(index.to_i)
      else
        nil
      end
    end
  end

  module ClassMethods
    def flagged
      by_flag(:key => true)
    end
  end

  private

  def flaggable_update_flag
    self.flag = self.flags.present? and self.flags.length > 0
    true
  end

end
