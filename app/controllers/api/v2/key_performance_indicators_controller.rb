module Sunspot
  module Query
    class RangeFacet
      def to_params
        params = super
        params[:"facet.range"] = [field_name_with_local_params]
        params[qualified_param('range.start')] = @field.to_indexed(@options[:range].first)
        params[qualified_param('range.end')] = @field.to_indexed(@options[:range].last)
        params[qualified_param('range.gap')] = "#{@options[:range_interval] || 10}"
        params[qualified_param('range.include')] = @options[:include].to_s if @options[:include]
        params
      end

      def local_params 
        @local_params ||=
          begin
            local_params = {}
            local_params[:ex] = @exclude_tag if @exclude_tag
            local_params[:key] = @options[:name] if @options[:name]
            local_params[:tag] = @options[:tag] if @options[:tag]
            local_params
          end
      end
    end

    class Pivot < AbstractFieldFacet
      def initialize(fields, options)
        @fields = fields
        # This facet operates on mutiple fields
        super(nil, options)
      end

      # ammended not to rely on @field
      def qualified_param(param)
        :"facet.pivot.#{param}"
      end

      def to_params
        super.tap do |params|
          # use array so that multiple facet.pivot appear in the search
          # string rather than the last facet.pivot key added to the params
          # see:
          # * https://github.com/sunspot/sunspot/blob/3328212da79178319e98699d408f14513855d3c0/sunspot/lib/sunspot/query/common_query.rb#L81
          # * https://github.com/sunspot/sunspot/blob/3328212da79178319e98699d408f14513855d3c0/sunspot/lib/sunspot/util.rb#L236
          #
          params[:"facet.pivot"] = [field_names_with_local_params]
        end
      end

      private

      def local_params
        @local_params ||=
          {}.tap do |local_params|
            local_params[:range] = @options[:range] if @options[:range]
            local_params[:stats] = @options[:stats] if @options[:stats]
            local_params[:query] = @options[:query] if @options[:query]
          end
      end

      def field_names_with_local_params
        if local_params.empty?
          field_names.join(',')
        else
          pairs = local_params.map { |key, value| "#{key}=#{value}" }
          "{!#{pairs.join(' ')}}#{field_names.join(',')}"
        end
      end

      def field_names
        @fields.map(&:indexed_name)
      end
    end
  end

  module DSL
    class FieldQuery
      def pivot(*field_names, **options)
        fields = field_names.map { |f| @setup.field(f) }
        pivot = Sunspot::Query::Pivot.new(fields, options)
        @query.add_field_facet(pivot)
      end
    end
  end
end


module Api::V2
  class KeyPerformanceIndicatorsController < ApplicationApiController
    # This is only temporary to avoid double render errors while developing.
    # I looks like this method wouldn't make sense for the audit log to
    # write given that 'write_audit_log' required a record type, id etc.
    # This response doesn't utilize any type of record yet and so cannot
    # provide this information.
    skip_after_action :write_audit_log

    def indexed_field_name(type, field_name)
      # TODO: Check if there can be duplicate field names
      Sunspot::Setup.for(type).
        all_field_factories.
        map(&:build).
        select { |field| field.name == field_name }.
        map { |field| field.indexed_name }.
        first
    end

    def number_of_cases
      created_at = indexed_field_name(Child, :created_at)
      owned_by_location = indexed_field_name(Child, :owned_by_location)

      search = Child.search do
        facet :created_at,
          tag: :per_month,
          range: from..to,
          range_interval: '+1MONTH',
          minimum_count: -1

        pivot :owned_by_location,
          range: :per_month,
          minimum_count: -1

        paginate page: 1, per_page: 0
      end

      @columns = search.facet_response.
        dig('facet_ranges', created_at, 'counts').
        select { |result| result.is_a?(String) }

      @data = (search.facet_response.
            dig('facet_pivot', owned_by_location).
        map do |pivot|
          location = Location.
            find_by({ location_code: pivot['value'].upcase }).
            placename
          counts = pivot.dig('ranges', created_at, 'counts').
            each_slice(2).
            to_h

          # How to we translate this name?
          { reporting_site: location }.merge(counts)
        end.to_a)
    end

    def number_of_incidents
    end

    def reporting_delay
    end

    def service_access_delay
    end

    def assessment_status
    end
    
    def completed_case_safety_plans
    end

    def completed_case_action_plans
    end

    def completed_supervisor_approved_case_action_plans
    end

    def services_provided
    end

    private

    # TODO: Add these to permitted params
    def from
      params[:from]
    end

    def to
      params[:to]
    end
  end
end
