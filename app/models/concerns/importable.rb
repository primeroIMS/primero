
module Importable
  extend ActiveSupport::Concern

  module ClassMethods
    def unique_property
      raise "You must implement a class attribute called 'unique_property' that returns the name of a unique property"
    end

    def find_by_unique_property
      raise "You must implement a class method called 'find_by_unique_property' that returns a model instance (or nil) when called with a unique property value"
    end

    def convert_array_of_hashes(import_data)
      self.unique_property 
      import_data.each do |h|
        unless h.include?(self.unique_property)
          raise TypeError.new("Data does not include the unique property #{self.unique_property}")  
        end

        instance = self.find_by_unique_property(h[self.unique_property])
      end
    end
  end
end
