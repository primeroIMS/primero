#This describes all models that have a name and description fields, and may need to be retrieved from the database by name
module Namable
  extend ActiveSupport::Concern

  included do

    property :name
    property :description

    design do
      view :by_name,
              :map => "function(doc) {
                  if ((doc['couchrest-type'] == '#{self.model.name}') && doc['name']) {
                    emit(doc['name'], null);
                  }
              }"
    end

    validates_presence_of :name, :message => I18n.t("errors.models.#{self.name.underscore}.name_present")
    validate :is_name_unique, :if => :name

    before_save :generate_id

    def is_name_unique
      named_object = self.class.find_by_name(self.name)
      return true if named_object.nil? or self.id == named_object.id
      errors.add(:name, I18n.t("errors.models.#{self.class.name.underscore}.unique_name"))
    end

    def generate_id
      self["_id"] ||= self.class.id_from_name(self.name)
    end

  end

  module ClassMethods

    def find_by_name(name)
       self.by_name(:key => name).first
    end

    def id_from_name(name)
      "#{self.name}-#{name}".parameterize.dasherize
    end

    #This method returns a list of id / display_text value pairs
    #It is used to create the select options list for fields
    def all_names
      self.by_disabled(key: false).map{|r| {id: r.id, display_text: r.name}.with_indifferent_access}
    end
  end

end
