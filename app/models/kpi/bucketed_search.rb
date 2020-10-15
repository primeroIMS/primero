module KPI
  # BucketedSearch
  #
  # Extracts the logic for a common form of search in which data is
  # aggregated into buckets over a range of data.
  class BucketedSearch < KPI::Search
    class <<self
      def restricted_field(field = nil)
        @restricted_field ||= field
      end

      def compared_field(field = nil)
        @compared_field ||= field
      end
    end

    def restricted_field
      SolrUtils.sunspot_setup(search_model).field(self.class.restricted_field)
    end

    def compared_field
      SolrUtils.sunspot_setup(search_model).field(self.class.compared_field)
    end

    def days(number)
      number.days.in_milliseconds
    end

    # For the purposes of this search 1 month is 30.4167 days or
    # 30.4167 * 24 * 60 * 60 * 1000 milliseconds
    def months(number)
      number * days(30.4167)
    end

    def buckets
      raise NotImplementedError
    end

    # rubocop:disable Metrics/AbcSize
    def search
      @search ||= search_model.search do
        with restricted_field.name, from..to
        without :duplicate, true

        adjust_solr_params do |params|
          params[:facet] = true
          params[:'facet.query'] = buckets.map do |args|
            frange(restricted_field.indexed_name, compared_field.indexed_name, args)
          end
        end
      end
    end
    # rubocop:enable Metrics/AbcSize

    def data
      raise NotImplementedError
    end

    private

    def frange(field_a, field_b, **options)
      param_string = options.map { |k, v| "#{k}=#{v}" }.join(' ')
      "{!frange #{param_string}} ms(#{field_a},#{field_b})"
    end
  end
end
