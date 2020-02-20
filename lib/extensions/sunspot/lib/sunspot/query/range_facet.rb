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
            # Allow tags on range facets
            # NOTE: This should also be available on queries, stats etc
            local_params[:tag] = @options[:tag] if @options[:tag]
            local_params
          end
      end
    end
  end
end
