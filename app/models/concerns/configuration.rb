module Configuration
  extend ActiveSupport::Concern
  module ClassMethods
    def clear
      self.delete_all
    end

    def import(data)
      record = self.new(data)
      record.save!
    end

    def export
      self.all.map{ |r| r.attributes.except('id') }
    end
  end
end