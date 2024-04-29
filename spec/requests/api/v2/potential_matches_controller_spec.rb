# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe Api::V2::PotentialMatchesController, type: :request do
  before(:each) { clean_data(Attachment, Trace, Incident, Child) }
  after(:each) { clean_data(Attachment, Trace, Incident, Child) }

  let(:case1) do
    Child.create!(
      name: 'Test', age: 5, sex: 'male',
      family_details_section: [{ relation: 'father', relation_name: "Father's Name" }]
    )
  end
  let(:case2) { Child.create!(name: 'Test 2', age: 10, sex: 'female') }
  let(:tracing_request) { TracingRequest.create!(inquiry_date: Date.new(2019, 3, 1), relation_name: 'Test 1') }
  let(:trace1) { Trace.create!(tracing_request:, name: 'Test', age: 5, sex: 'male') }
  let(:trace2) { Trace.create!(tracing_request:, name: 'Test 3', age: 10, sex: 'female') }
  let(:potential_matches) do
    [
      PotentialMatch.new(child: case1, trace: trace1, score: 1.0, likelihood: MatchingService::LIKELY),
      PotentialMatch.new(child: case2, trace: trace2, score: 0.2, likelihood: MatchingService::POSSIBLE)
    ]
  end
  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/traces/:id/potential_matches' do
    before do
      allow(MatchingService).to receive(:matches_for).with(trace1).and_return(potential_matches)

      attachment1 = Attachment.new(
        field_name: 'photos',
        attachment_type: 'image',
        file_name: 'jorge.jpg',
        attachment: attachment_base64('jorge.jpg')
      )
      attachment1.record = tracing_request
      attachment1.attach!

      attachment2 = Attachment.new(
        field_name: 'photos',
        attachment_type: 'image',
        file_name: 'jeff.png',
        attachment: attachment_base64('jeff.png')
      )
      attachment2.record = case1
      attachment2.attach!

      attachment3 = Attachment.new(
        field_name: 'recorded_audio',
        attachment_type: 'audio',
        file_name: 'sample.mp3',
        attachment: attachment_base64('sample.mp3')
      )
      attachment3.record = tracing_request
      attachment3.attach!

      attachment4 = Attachment.new(
        field_name: 'recorded_audio',
        attachment_type: 'audio',
        file_name: 'sample.mp3',
        attachment: attachment_base64('sample.mp3')
      )
      attachment4.record = case1
      attachment4.attach!
    end

    it 'fetches the correct record with code 200' do
      login_for_test(permissions:
        [
          permission_tracing_request,
          Permission.new(
            resource: Permission::POTENTIAL_MATCH,
            actions: [Permission::READ, Permission::VIEW_PHOTO, Permission::VIEW_AUDIO]
          )
        ])
      get "/api/v2/traces/#{trace1.id}/potential_matches"

      expect(response).to have_http_status(200)
      expect(json['data']['potential_matches'].size).to eq(2)
      expect(json['data']['potential_matches'][0]['score']).to eq(1.0)
      expect(json['data']['potential_matches'][0]['likelihood']).to eq(MatchingService::LIKELY)
      expect(json['data']['potential_matches'][0]['case']['id']).to eq(case1.id)
      expect(json['data']['potential_matches'][0]['case']['photos'][0]['file_name']).to eq('jeff.png')
      expect(json['data']['potential_matches'][0]['case']['recorded_audio'][0]['file_name']).to eq('sample.mp3')
      expect(json['data']['potential_matches'][0]['trace']['id']).to eq(trace1.id)
      expect(json['data']['potential_matches'][0]['trace']['photos'][0]['file_name']).to eq('jorge.jpg')
      expect(json['data']['potential_matches'][0]['trace']['recorded_audio'][0]['file_name']).to eq('sample.mp3')
      expect(json['data']['potential_matches'][0]['comparison']['case_to_trace'].size.positive?).to be_truthy
      expect(json['data']['record']['id']).to eq(trace1.id)
      expect(json['data']['record']['type']).to eq('trace')
    end

    it 'fetches the correct record without attachments with code 200' do
      login_for_test(permissions: [permission_tracing_request, permission_potential_match])
      get "/api/v2/traces/#{trace1.id}/potential_matches"

      expect(response).to have_http_status(200)
      expect(json['data']['potential_matches'].size).to eq(2)
      expect(json['data']['potential_matches'][0]['score']).to eq(1.0)
      expect(json['data']['potential_matches'][0]['likelihood']).to eq(MatchingService::LIKELY)
      expect(json['data']['potential_matches'][0]['case']['id']).to eq(case1.id)
      expect(json['data']['potential_matches'][0]['case']['photos']).to be_nil
      expect(json['data']['potential_matches'][0]['case']['recorded_audio']).to be_nil
      expect(json['data']['potential_matches'][0]['trace']['id']).to eq(trace1.id)
      expect(json['data']['potential_matches'][0]['trace']['photos']).to be_nil
      expect(json['data']['potential_matches'][0]['trace']['recorded_audio']).to be_nil
      expect(json['data']['potential_matches'][0]['comparison']['case_to_trace'].size.positive?).to be_truthy
      expect(json['data']['record']['id']).to eq(trace1.id)
      expect(json['data']['record']['type']).to eq('trace')
    end

    it 'returns 403 when user can not access the associated trace record' do
      login_for_test(
        permissions: [permission_tracing_request, permission_potential_match],
        group_permission: Permission::SELF
      )
      get "/api/v2/traces/#{trace1.id}/potential_matches"

      expect(response).to have_http_status(403)
    end
  end

  describe 'GET /api/v2/traces/:id/potential_matches' do
    before { allow(MatchingService).to receive(:matches_for).with(case1).and_return(potential_matches) }

    it 'fetches the correct record with code 200' do
      login_for_test(permissions: [permission_case, permission_potential_match])
      get "/api/v2/cases/#{case1.id}/potential_matches"

      expect(response).to have_http_status(200)
      expect(json['data']['potential_matches'].size).to eq(2)
      expect(json['data']['potential_matches'][0]['score']).to eq(1.0)
      expect(json['data']['potential_matches'][0]['likelihood']).to eq(MatchingService::LIKELY)
      expect(json['data']['potential_matches'][0]['case']['id']).to eq(case1.id)
      expect(json['data']['potential_matches'][0]['trace']['id']).to eq(trace1.id)
      expect(json['data']['potential_matches'][0]['comparison']['case_to_trace'].size.positive?).to be_truthy
      expect(json['data']['record']['id']).to eq(case1.id)
      expect(json['data']['record']['type']).to eq('case')
    end

    it 'returns 403 when user can not access the associated case record' do
      login_for_test(
        permissions: [permission_case, permission_potential_match],
        group_permission: Permission::SELF
      )
      get "/api/v2/cases/#{case1.id}/potential_matches"

      expect(response).to have_http_status(403)
    end
  end
end
