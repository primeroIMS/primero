#Configure for compatibility with older version.
#Current model_type_key is 'type', older is 'couchrest-type'
CouchRest::Model::Base.configure do |config|
  config.mass_assign_any_attribute = true
  config.model_type_key = 'couchrest-type'
end

module CouchRest
  module Model
    class Base
      #This is a monkeypatch to set the dirty flag for arbitrary attributes when mass assignment is turned on.
      #Couchrest_model is using the inherited []= setter which fails to set the flag.
      #See: https://github.com/couchrest/couchrest_model/issues/114
      #See: https://github.com/couchrest/couchrest_model/issues/130
      #TODO: Still a hack, doesn't cover the model['foo']['bar']='value' case.
      alias :set_a_value :[]=
      def []=(key, value)
        prev_value = self[key]
        changed_attributes[key] = prev_value
        set_a_value key, value
      end
      #TODO: what about overriding the delete method?

      #flag as saved CastedArray and CastedHash fields.
      after_save do
        flag_saved_embedded_properties
      end

      # Instantiate a new CouchRest::Model::Base by preparing all properties
      # using the provided document hash.
      #
      # Options supported:
      #
      # * :directly_set_attributes, true when data comes directly from database
      # * :database, provide an alternative database
      #
      # If a block is provided the new model will be passed into the
      # block so that it can be populated.
      def initialize(attributes = {}, options = {})
        super()
        prepare_all_attributes(attributes, options)
        # set the instance's database, if provided
        self.database = options[:database] unless options[:database].nil?
        unless self['_id'] && self['_rev']
          self[self.model_type_key] = self.class.model_type_value
        end

        #:directly_set_attributes is set to true when the object is built from the database.
        #flag as saved CastedArray and CastedHash fields.
        if options[:directly_set_attributes]
          flag_saved_embedded_properties
        end

        yield self if block_given?

        after_initialize if respond_to?(:after_initialize)
        run_callbacks(:initialize) { self }
      end

      private

      #Flag saved CastedBy fields (:document_saved to true) in order to be aware
      #that items were saved or they were loaded from the database.
      def flag_saved_embedded_properties
        casted_properties = self.properties_with_values.select { |property, value| value.respond_to?(:casted_by) && value.respond_to?(:casted_by_property) }
        casted_properties.each do |property, value|
          if value.instance_of?(CouchRest::Model::CastedArray)
            value.each do |item|
              item.document_saved = true if item.respond_to?(:document_saved)
            end
          elsif value.instance_of?(CouchRest::Model::CastedHash) && value.respond_to?(:document_saved)
            value.document_saved = true
          end
        end
      end

    end
  end
end

module CouchRest
  module Model
    module Embeddable
      #track down whether the instance is new or not.
      #CouchRest::Model::Embeddable new? method rely
      #on the new? of the parent object. This make not
      #possible to know if the embedded object already
      #exists or not in the database.
      #document_saved nil or false consider the field as new.
      attr_accessor :document_saved

      #Override new? method to not rely on the new? of the parent object.
      def new?
        !@document_saved
      end
      alias :new_record? :new?

      #couchrest 0.34
      #CouchRest::CastedModel did not provide "to_key" method.
      #
      #couchrest 1.1.3 defined the module CouchRest::Model::Embeddable
      #as the new way to define CastedModel, this class define the
      #method "to_key" which returns the the id, but
      #actionpack-4.0.3/lib/action_view/record_identifier.rb needs the
      #return value as a Enumerable type such an array.
      #
      #The following solve the issue in /form_section/ when edit fields.
      def to_key
        key = respond_to?(:id) && id
        key ? [key] : nil
      end
    end
  end
end
