class UserLocationService
  class << self
    def inject_locations(users)
      location_codes = users.pluck(:location).compact.uniq
      locations_by_code = get_locations_by_code(location_codes)
      rpt_locations_by_location_code = reporting_locations_by_location_code(locations_by_code)
      users.each do |user|
        user.user_location = locations_by_code[user.location]
        if rpt_locations_by_location_code[user.location].present?
          user.exists_reporting_location = true
          user.reporting_location = rpt_locations_by_location_code[user.location]
        else
          user.exists_reporting_location = false
        end
      end
    end

    private

    def reporting_locations_by_location_code(locations_by_code)
      hierarchies = locations_by_code.values.map(&:hierarchy_path)
      reporting_locations = Location.reporting_locations_for_hierarchies(hierarchies)

      locations_by_code.values.inject({}) do |acc, location|
        acc.merge(
          location.location_code => reporting_locations.find do |reporting_location|
            location.hierarchy_path.split('.').include?(reporting_location.location_code)
          end
        )
      end
    end

    def get_locations_by_code(location_codes)
      Location.where(location_code: location_codes).inject({}) do |acc, location|
        acc.merge(location.location_code => location)
      end
    end
  end
end
