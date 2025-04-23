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
  end

  def search
    Search::SearchResult.new(
      search_query.with_scope(search_params[:scope])
      .with_filters(search_params[:filters])
      .with_query(search_params[:query])
      .build
    ).paginate(search_params[:pagination])
  end

  def phonetic?
    search_params[:phonetic] == 'true'
  end

  private

  def search_query
    return Search::PhoneticSearchQuery.new(record_class) if phonetic?

    Search::IdSearchQuery.new(record_class).with_sort(search_params[:sort])
  end
end
