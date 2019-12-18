module Indicators
  class AbstractIndicator < ValueObject
    attr_accessor :name, :record_model, :scope, :scope_to_owner

    class << self
      def dawn_of_time
        Time.zone.at(0)
      end

      def this_week
        Time.zone.now - 7.days
      end

      def recent_past
        Time.zone.now - 10.days
      end

      def present
        Time.zone.now
      end
    end

    def query(_, _)
      raise NotImplementedError
    end

    def facet_name
      name
    end

    def stats_from_search(sunspot_search)
      owner = owner_from_search(sunspot_search)
      sunspot_search.facet(facet_name).rows.map do |row|
        stat = {
          'count' => row.count,
          'query' => stat_query_strings(row, owner)
        }
        [row.value, stat]
      end.to_h
    end

    def stat_query_strings(_, _)
      raise NotImplementedError
    end

    protected

    def owner_from_search(sunspot_search)
      return unless scope_to_owner

      owner_query = sunspot_search&.query&.scope&.to_params
                      &.dig(:fq)&.find { |p| p.match(/owned_by/) }
      owner_query && owner_query.split(':')[1]
    end

    def scope_query_strings
      scope&.map(&:to_s) || []
    end

    def owner_query_string(owner)
      if owner.present?
        ["owned_by=#{owner}"]
      else
        []
      end
    end

  end
end