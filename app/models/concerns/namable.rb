module Namable
  extend ActiveSupport::Concern

  included do

    property :name
    property :description

    design do
      view :by_name,
              :map => "function(doc) {
                  if ((doc['couchrest-type'] == '#{self.model.name}') && doc['name']) {
                    emit(doc['name'], doc);
                  }
              }"
    end

    #TODO: I18n this
    validates_presence_of :name, :message => I18n.t("errors.models.#{self.class.name.underscore}.name_present")
    validate :is_name_unique, :if => :name

    def is_name_unique
      named_object = self.class.find_by_name(self.name)
      return true if named_object.nil? or self.id == named_object.id
      errors.add(:name, I18n.t("errors.models.#{self.class.name.underscore}.unique_name"))
    end


  end

end