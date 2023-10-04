# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::FamiliesController, type: :request do
  before do
    clean_data(Child, Family)
    family1
    family2
    family3
    family4
    Sunspot.commit
  end

  let(:family1) do
    Family.create!(
      data: {
        family_number: '40bf9109',
        family_members: [
          {
            unique_id: '001',
            relation_name: 'Member1',
            relation_sex: 'male',
            relation_age: 10,
            relation_date_of_birth: Date.today - 10.years
          }
        ]
      }
    )
  end

  let(:family2) { Family.create!(data: { family_number: '8962e835' }) }
  let(:family3) { Family.create!(data: { family_number: '2ef057e8' }) }
  let(:family4) { Family.create!(data: { family_number: '318e0925' }) }
  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/families', search: true do
    it 'lists families and accompanying metadata' do
      login_for_test
      get '/api/v2/families'

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(4)
      expect(json['data'].map { |c| c['family_number'] }).to match_array(%w[40bf9109 8962e835 2ef057e8 318e0925])
      expect(json['metadata']['total']).to eq(4)
      expect(json['metadata']['per']).to eq(20)
      expect(json['metadata']['page']).to eq(1)
    end

    context 'when a family_number is passed in' do
      it 'lists families only for that family_number' do
        login_for_test
        get '/api/v2/families?family_number=2ef057e8'

        expect(response).to have_http_status(200)
        expect(json['data'].size).to eq(1)
        expect(json['data'].map { |c| c['family_number'] }).to match_array(%w[2ef057e8])
        expect(json['metadata']['total']).to eq(1)
        expect(json['metadata']['per']).to eq(20)
        expect(json['metadata']['page']).to eq(1)
      end
    end

    context 'when the authorized user is not the record owner' do
      it 'can list all families' do
        login_for_test(
          permissions: [Permission.new(resource: Permission::FAMILY, actions: [Permission::READ])],
          group_permission: Permission::GROUP
        )
        get '/api/v2/families'

        expect(response).to have_http_status(200)
        expect(json['data'].size).to eq(4)
        expect(json['metadata']['total']).to eq(4)
        expect(json['metadata']['per']).to eq(20)
        expect(json['metadata']['page']).to eq(1)
      end
    end

    context 'when user is unauthorized' do
      it 'refuses unauthorized access' do
        login_for_test(permissions: [])
        get '/api/v2/families'

        expect(response).to have_http_status(403)
        expect(json['errors'].size).to eq(1)
        expect(json['errors'][0]['resource']).to eq('/api/v2/families')
      end
    end
  end

  describe 'GET /api/v2/families/:id' do
    context 'when the authorized user has full record access scope' do
      it 'fetches the correct record with code 200' do
        login_for_test
        get "/api/v2/families/#{family1.id}"

        expect(response).to have_http_status(200)
        expect(json['data']['id']).to eq(family1.id)
      end
    end

    context 'when the authorized user is not the record owner' do
      it 'fetches the correct record with code 200' do
        login_for_test(
          permissions: [Permission.new(resource: Permission::FAMILY, actions: [Permission::READ])],
          group_permission: Permission::GROUP
        )
        get "/api/v2/families/#{family1.id}"

        expect(response).to have_http_status(200)
        expect(json['data']['id']).to eq(family1.id)
      end
    end
  end

  describe 'POST /api/v2/families' do
    it 'creates a new record with 200 and returns it as JSON' do
      login_for_test
      params = { data: { family_number: '91afb9a9' } }
      post '/api/v2/families', params:, as: :json

      expect(response).to have_http_status(200)
      expect(json['data']['id']).not_to be_empty
      expect(json['data']['family_number']).to eq('91afb9a9')
      expect(Family.find_by(id: json['data']['id'])).not_to be_nil
    end
  end

  describe 'PATCH /api/v2/families/:id' do
    it 'updates an existing record with 200' do
      login_for_test
      params = { data: { family_number: 'c676db83' } }
      patch "/api/v2/families/#{family1.id}", params:, as: :json

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(family1.id)

      updated_family = Family.find_by(id: family1.id)
      expect(updated_family.data['family_number']).to eq('c676db83')
    end
  end

  # In Primero, we don't actually delete records. We disable them
  describe 'DELETE /api/v2/families/:id' do
    it 'successfully deletes a record with a code of 200' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::FAMILY, actions: [Permission::ENABLE_DISABLE_RECORD])
        ]
      )
      delete "/api/v2/families/#{family1.id}"

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(family1.id)

      updated_family = Family.find_by(id: family1.id)
      expect(updated_family.record_state).to be false
    end
  end

  describe 'POST /api/v2/families/:id/case' do
    context 'when user is unauthorized' do
      it 'refuses unauthorized access' do
        login_for_test(
          permissions: [
            Permission.new(resource: Permission::FAMILY, actions: [Permission::READ, Permission::WRITE])
          ]
        )
        params = { data: { family_member_id: '001' } }

        post "/api/v2/families/#{family1.id}/case", params:, as: :json

        expect(response).to have_http_status(403)
        expect(json['errors'].size).to eq(1)
        expect(json['errors'][0]['resource']).to eq("/api/v2/families/#{family1.id}/case")
      end
    end

    context 'when the family member does not exist' do
      it 'returns a 404 when trying to create a case for a family member that does not exist' do
        login_for_test(
          permissions: [
            Permission.new(
              resource: Permission::FAMILY,
              actions: [
                Permission::READ, Permission::WRITE, Permission::CASE_FROM_FAMILY
              ]
            )
          ]
        )

        params = { data: { family_member_id: '002' } }

        post "/api/v2/families/#{family1.id}/case", params:, as: :json

        expect(response).to have_http_status(404)
        expect(json['errors'].size).to eq(1)
        expect(json['errors'][0]['resource']).to eq("/api/v2/families/#{family1.id}/case")
      end
    end

    it 'successfully creates a case record with a code of 200' do
      login_for_test(
        permissions: [
          Permission.new(
            resource: Permission::FAMILY,
            actions: [
              Permission::READ, Permission::WRITE, Permission::CASE_FROM_FAMILY
            ]
          )
        ]
      )

      params = { data: { family_member_id: '001' } }

      post "/api/v2/families/#{family1.id}/case", params:, as: :json

      expect(response).to have_http_status(200)
      expect(json['data']['id']).to eq(family1.id)

      child = Child.find_by(id: json['data']['record']['id'])
      expect(child.name_first).to eq('Member1')
      expect(child.sex).to eq('male')
      expect(child.age).to eq(10)
      expect(child.date_of_birth).to eq(Date.today - 10.years)
      expect(child.family_number).to eq('40bf9109')
    end
  end

  after do
    clean_data(Child, Family)
  end
end
