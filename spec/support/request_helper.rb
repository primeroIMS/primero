# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# Helpers for request specs.

shared_examples 'a paginated resource' do
  before(:each) do
    login_for_test(action[:login_params] || {})
  end

  it 'limits pagination per page to 1000' do
    get "/api/v2/#{action[:resource]}?per=3000"

    expect(json['metadata']['per']).to eq(1000)
  end

  it 'defaults pagination per page to 20' do
    get "/api/v2/#{action[:resource]}"

    expect(json['metadata']['per']).to eq(20)
  end

  it 'return pagination per page when less than 1000' do
    get "/api/v2/#{action[:resource]}?per=999"

    expect(json['metadata']['per']).to eq(999)
  end
end
