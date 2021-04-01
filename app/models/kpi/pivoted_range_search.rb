# frozen_string_literal: true

# PivotedRangeSearch
#
# Extract the logic for a common form of search involving a range,
# usually of dates and a pivoted field for counting occurances within
# those dates.
class Kpi::PivotedRangeSearch < Kpi::Search
  class << self
    def range_field(field = nil)
      @range_field ||= field
    end

    def pivot_field(field = nil)
      @pivot_field ||= field
    end
  end

  def range_field
    ::SolrUtils.sunspot_setup(search_model).field(self.class.range_field)
  end

  def pivot_field
    ::SolrUtils.sunspot_setup(search_model).field(self.class.pivot_field)
  end

  # Shortening this method (or the others below) would either:
  #
  # 1. Require an arbitrary breaking up of the solr query into methods
  #    which arguably add little to no explanatory or architectural value
  #    to the code base.
  # 2. Require re-achitecting the solution to invert the responcibilities
  #    of defining a search so that individual aspects of the search
  #    would be defined in methods and later combined together into a
  #    whole search by some evaluation method. It feels wrong to drive
  #    that sort of architectural decisions for linting reasons alone.
  #
  # rubocop:disable Metrics/MethodLength
  def search(&block)
    @search ||= search_model.search do
      with :owned_by_groups, owned_by_groups
      with :owned_by_agency_id, owned_by_agency_id

      adjust_solr_params do |params|
        params.merge!(
          'facet': true,
          'facet.range': "{!tag=range}#{range_field.indexed_name}",
          'facet.range.start': from,
          'facet.range.end': to,
          'facet.range.gap': '+1MONTH',
          'facet.pivot': [
            "{!range=range}#{pivot_field.indexed_name}"
          ]
        )
      end

      yield(self) if block
    end
  end
  # rubocop:enable Metrics/MethodLength

  def columns
    @columns ||= search.facet_response
                       .dig('facet_ranges', range_field.indexed_name, 'counts')
                       .each_slice(2)
                       .map(&:first)
  end

  def data
    location_codes, rows = *pivot_range_counts
      .transform_keys(&:upcase)
      .to_a
      .transpose

    return @data = [] if location_codes.nil? || rows.nil?

    # Should use pluck but `placename` is a `localized_property` which uses
    # some ruby to get the right value, so we can't delegate to the db only.
    placenames = Location.where(location_code: location_codes)
                         .map(&:placename)

    @data = placenames.zip(rows).map do |placename, row|
      { reporting_site: placename }.merge(row)
    end
  end

  private

  def pivot_range_counts
    search.facet_response
          .dig('facet_pivot', pivot_field.indexed_name)
          .map do |record|
      [record['value'],
       record
         .dig('ranges', range_field.indexed_name, 'counts')
         .each_slice(2)
         .to_h]
    end.to_h
  end
end
