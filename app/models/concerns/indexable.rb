module Indexable
  extend ActiveSupport::Concern

  #TODO: Refactor the Flag model and the Searchable concern to use this concern

  included do
    include Sunspot::Rails::Searchable

    Sunspot::Adapters::InstanceAdapter.register DocumentInstanceAccessor, self
    Sunspot::Adapters::DataAccessor.register DocumentDataAccessor, self
  end

  module Searchable
    def indexable_location(field)
      location = nil
      ancestors = nil
      Location::ADMIN_LEVELS.each do |admin_level|
        string "#{field}#{admin_level}", as: "#{field}#{admin_level}_sci".to_sym do
          #TODO - Possible refactor to make more efficient
          location ||= Location.find_by_location_code(self.send(field))
          if location.present?
            # break if admin_level > location.admin_level
            if admin_level == location.admin_level
              location.location_code
            elsif location.admin_level.present? && (admin_level < location.admin_level)
              # find the ancestor with the current admin_level
              ancestors ||= location.ancestors
              lct = ancestors.select {|l| l.admin_level == admin_level}
              lct.present? ? lct.first.location_code : nil
            end
          end
        end
      end
    end
  end

end