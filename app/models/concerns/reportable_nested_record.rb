module ReportableNestedRecord
  extend ActiveSupport::Concern
  #TODO: For now this will be used to only read and index data on nested forms.
  #TODO: This is similar to Violations and may need to be combined with Violations when refactoring or have violations extend this class
  #      Make similar (and test exhaustively!) to Flag model to perform reads and writes
  #TODO: Potentially this may need to be incorporated into lib/forms_to_properties.rb


  included do
    include CouchRest::Model::Embeddable #TODO: This is just so that Sunspot doesn't complain.
    include Indexable
    attr_accessor :parent_record, :object
  end


  module ClassMethods

    #TODO: Do we need self.all ? Does Solr need it?
    # def self.all(options={})
    #   violations = []
    #   incidents = Incident.all(options).all
    #   incidents.each do |incident|
    #     violations = violations + from_incident(incident)
    #   end
    #   return violations
    # end

    def from_record(record)
      objects = []
      record.send(record_field_name).each do |object|
        reportable = new
        reportable.parent_record = record
        reportable.object = object
        objects << reportable
      end
      return objects
    end
  end

  def record_value(field_name)
    if self.parent_record.present?
      self.parent_record.send field_name
    end
  end

  def object_value(field_name)
    if self.object.present? && self.object.respond_to?(field_name)
      object.send field_name
    end
  end

  module Searchable
    def configure_searchable(record_class)
      string :parent_record_id do |f|
        f.record_value('id')
      end
      record_class.parent_record_type.minimum_reportable_fields.each do |type, fields|
        case type
        when 'string'
          fields.each{|f| string(f, as: "#{f}_sci".to_sym) {record_value(f)}}
        when 'multistring'
          fields.each{|f| string(f, multiple: true) {record_value(f)}}
        when 'boolean'
          fields.each{|f| boolean(f){record_value(f)}}
        when 'date'
          fields.each{|f| date(f){record_value(f)}}
        when 'integer'
          fields.each{|f| integer(f){record_value(f)}}
        when 'location'
          fields.each do |field|
            #TODO - Refactor needed
            #TODO - There is a lot of similarity to Admin Level code in searchable concern
            location = nil
            ancestors = nil
            Location::ADMIN_LEVELS.each do |admin_level|
              string "#{field}#{admin_level}", as: "#{field}#{admin_level}_sci".to_sym do
                location ||= Location.find_by_location_code(record_value(field))
                if location.present?
                  # break if admin_level > location.admin_level
                  if admin_level == location.admin_level
                    location.location_code
                  elsif location.admin_level.present? && (admin_level < location.admin_level)
                    ancestors ||= location.ancestors
                    # find the ancestor with the current admin_level
                    lct = ancestors.select{|l| l.admin_level == admin_level}
                    lct.present? ? lct.first.location_code : nil
                  end
                end
              end
            end
          end
        #TODO: arrays?
        end
      end

      object_property = record_class.parent_record_type.properties.select{|p| p.name == record_class.record_field_name}.first
      if object_property.present?
        object_class = object_property.type
        object_class.properties.each do |property|
          name = property.name
          if property.array
            string(name, multiple: true) {object_value(name)}
          else
            if property.type == String
              string(name, as: "#{name}_sci".to_sym) {object_value(name)}
            elsif [DateTime, PrimeroDate].include? property.type
              date(name) {object_value(name)}
            elsif property.type == TrueClass
              boolean(name) {object_value(name)}
            elsif property.type == Integer
              integer(name) {object_value(name)}
            end
          end
        end
      end
    end
  end


end