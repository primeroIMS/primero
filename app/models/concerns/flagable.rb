module Flagable
  extend ActiveSupport::Concern

  included do
    property :flag, TrueClass
    property :flag_date, Date
    property :flag_message

    design do
      #TODO still need this view? copied from child model.
      view :by_flag,
            :map => "function(doc) {
                  if (doc.hasOwnProperty('flag'))
                 {
                   if (!doc.hasOwnProperty('duplicate') || !doc['duplicate']) {
                     emit(doc['flag'],doc);
                   }
                 }
              }"
    end

    def flagged_by
      user = self.histories.select{|h| h["changes"]["flag"]}.first["user_name"]
      message = (self.flag_message.blank? && "") || ": \"#{self.flag_message}\""
      I18n.t("#{self.class.name.underscore.downcase}.flagged_as_suspected")+" #{user}#{message}"
    end

  end
end
