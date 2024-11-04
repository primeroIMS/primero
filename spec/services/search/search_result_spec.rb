# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe Search::SearchResult do
  it 'handles StatementInvalid errors and returns an empty result' do
    allow(Rails.logger).to receive(:error).and_return(nil)
    result = Search::SearchResult.new(Child.where("data @? '$.associated_user_names ? ( @ == \"List[\"user1\"]\" )' "))

    expect(result.total).to eq(0)
    expect(result.records).to be_empty
    expect(Rails.logger).to have_received(:error)
  end
end
