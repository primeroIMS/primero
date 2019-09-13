class DuplicateBulkExport < BulkExport
  def self.get(id)
    DuplicateBulkExport.new(super(id))
  end

  def process_records_in_batches(facet_batch_size=100, batch_size=500, duplicate_export_field, &block)
    #TODO: this is a good candidate for multithreading
    #TODO: Right now this is duplicated code with what appears in the record_actions controller concern
    pagination_ops = {:page => 1, :per_page => batch_size}

    solr_duplicate_export_field = SolrUtils.indexed_field_name(self.record_type, duplicate_export_field)

    begin
      facet_search = self.model_class.search do
        with(:status, Record::STATUS_OPEN)
        with(:record_state, true)

        adjust_solr_params do |params|
          params['facet'] = 'true'
          params['facet.field'] = [solr_duplicate_export_field]
          params['facet.limit'] = '-1'
          params['facet.method'] = 'fcs'
          params['facet.threads'] = '-1'
          params["f.#{solr_duplicate_export_field}.facet.mincount"] = '2'
        end
      end

      facet_results = facet_search
        .facet_response['facet_fields'][solr_duplicate_export_field]
        .map{|value| value if value.is_a?(String) }
        .compact
        .in_groups_of(facet_batch_size, false)

      if facet_results.present?
        facet_results.each do |results|
          begin
            filters = {
              "#{duplicate_export_field}" => {
                :type => 'list',
                :value => results
              }
            }

            search = self.model_class.list_records(
              filters, {"#{duplicate_export_field}" => :desc}, pagination_ops,
              self.owner.try(:managed_user_names), self.query, self.match_criteria
            )

            results = search.results

            yield(results)

            #Set again the values of the pagination variable because the method modified the variable.
            pagination_ops[:page] = results.next_page
            pagination_ops[:per_page] = batch_size
          end until results.next_page.nil?
        end
      else
        yield([])
      end
    end
  end

  def job
    DuplicateBulkExportJob
  end
end