# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# A class that stores the results of a search
class Search::SearchResult
  DEFAULT_PER_PAGE = 10
  DEFAULT_PAGE = 1

  attr_accessor :total, :records, :search_query

  def initialize(search_query)
    self.search_query = search_query
  end

  def paginate(pagination)
    per = pagination&.dig(:per_page) || DEFAULT_PER_PAGE
    page = pagination&.dig(:page) || DEFAULT_PAGE
    offset = (page - 1) * per

    self.total ||= search_query.count
    self.records = search_query.limit(per).offset(offset)

    self
  end
end
