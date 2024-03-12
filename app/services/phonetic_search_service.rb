# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# A service that performs phonetic searches using SQL
class PhoneticSearchService
  DEFAULT_SEARCH_PARAMS = {
    filters: [],
    scope: {},
    sort: { created_at: :desc },
    pagination: {},
    phonetic: false
  }.freeze

  attr_accessor :record_class, :search_params

  def self.search(record_class, search_params = {})
    new(record_class, search_params).search
  end

  def initialize(record_class, search_params)
    self.record_class = record_class
    self.search_params = DEFAULT_SEARCH_PARAMS.merge(search_params)
    mark_location_filters!
  end

  def search
    search_query.with_scope(search_params[:scope])
                .with_filters(search_params[:filters])
                .with_sort(search_params[:sort])
                .result
                .paginate(search_params[:pagination])
  end

  def phonetic?
    search_params[:phonetic] == 'true'
  end

  private

  def mark_location_filters!
    search_params.tap do |param|
      param[:filters] = param[:filters].map do |filter|
        next(filter) unless record_class.searchable_location_field?(filter.field_name)
        next(filter) unless filter.reporting_location_filter?

        filter.location_filter = true
        filter
      end
    end
  end

  def search_query
    return Search::SearchQuery.phonetic(record_class, search_params[:query]) if phonetic?

    Search::SearchQuery.filter_ids(record_class, search_params[:query])
  end
end
