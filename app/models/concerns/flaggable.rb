module Flaggable
  extend ActiveSupport::Concern
  include Sunspot::Rails::Searchable

  included do
    property :flags, [Flag], :default => []

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

      view :by_flag_with_date,
             :map => "function(doc) {
               if (doc['record_state'] == true
                   && (!doc.hasOwnProperty('duplicate') || !doc['duplicate'])
                   && doc.hasOwnProperty('flags')) {
                 for(var index = 0; index < doc['flags'].length; index++) {
                   if (!doc['flags'][index]['removed'] && doc['flags'][index]['date'] != null) {
                     emit(doc['flags'][index]['date'], null);
                   }
                 }
               }
             }"

      view :by_flag_created_at_latest,
             :map => "function(doc) {
               if (doc['record_state'] == true
                   && (!doc.hasOwnProperty('duplicate') || !doc['duplicate'])
                   && doc.hasOwnProperty('flags')) {
                 var latest_created_at = null;
                 for(var index = 0; index < doc['flags'].length; index++) {
                   if (!doc['flags'][index]['removed'] && doc['flags'][index]['created_at'] != null) {
                     if (latest_created_at == null) {
                      latest_created_at = doc['flags'][index]['created_at'];
                     } else {
                       if (latest_created_at < doc['flags'][index]['created_at']) {
                         latest_created_at = doc['flags'][index]['created_at'];
                       }
                     }
                   }
                 }
                 if (latest_created_at != null) {
                   emit([doc['module_id'], latest_created_at], null);
                 }
               }
             }",
             :reduce => "_count"
    end

    # Flags are not getting indexed on save in production, however they ARE getting indexed via the Couch Watcher notifier.
    # Technically things are getting double indexed, once in the notifier and once in the application.
    # We can revisit moving all indexing to the notifier, but there is a concern that there may be an index lag under stress.
    # TODO use Indexable::auto_index?
    after_save :index_flags, unless: Proc.new{ Rails.env == 'production' }

    def flag_message_flagged_by
      #TODO Keep the panel in the show and the edit show one of the flag, the last one.
      #that panel eventually will change.
      flag = self.flags.last
      I18n.t("#{self.class.name.underscore.downcase}.flagged_as_suspected")+" #{flag.flagged_by}: #{flag.message}" if flag
    end

    #Add a flag. The caller still need to call save method to persistence the changes by the method.
    #The method was added to be called in the controller. It returns the flag added to the array.
    def add_flag(message, date, user_name)
      flag = Flag.new(:flagged_by => user_name, :message => message, :date => date, :created_at => DateTime.now)
      self.flags << flag
      flag
    end

    def index_flags
      if self.flags.present?
        Sunspot.index! self.flags
      end
    end

    #Remove flag. The caller still need to call the save method to persistence the changed by the method.
    #The method was added to be called in the controller. It returns the flag removed or nil if the tag is not removed.
    #To remove a tag the value of the message_to_delete should be found in the position described by the index parameter.
    #The index is used as a key to identify what flag should be removed.
    def remove_flag(message_to_delete, index, user_name, unflag_message, unflag_date)
      flag = self.flags[index.to_i]
      if flag.present? and flag.message == message_to_delete
        # self.flags.delete_at(index.to_i)
        flag.unflag_message = unflag_message
        flag.unflagged_date = unflag_date
        flag.unflagged_by = user_name
        flag.removed = true
        flag
      else
        nil
      end
    end

    def flagged?
      self.flags.any? { |f| !f.removed }
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


    def get_scheduled_activities
    end
  end

end
