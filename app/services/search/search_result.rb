# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# A class that stores the results of a search
class Search::SearchResult
  DEFAULT_PER_PAGE = 10
  DEFAULT_PAGE = 1

  attr_accessor :total

  def initialize(query)
    @query = query
    self.total = @query.count
  end

  def records
    @query
  end

  def paginate(pagination)
    return self unless pagination.present?

    per = pagination[:per_page] || DEFAULT_PER_PAGE
    page = pagination[:page] || DEFAULT_PAGE
    offset = (page - 1) * per

    @query = @query.limit(per).offset(offset)

    self
  end
end
