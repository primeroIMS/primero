# frozen_string_literal: true

require 'rails_helper'

describe Api::V2::CodesOfConductController, type: :request do
  before :each do
    clean_data(User, CodeOfConduct)
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/codes_of_conduct' do
    it 'returns a 404 when the code of conduct does not exist' do
      login_for_test
      get '/api/v2/codes_of_conduct'

      expect(response).to have_http_status(404)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/codes_of_conduct')
    end

    it 'fetches the correct code of conduct with code 200' do
      code_of_conduct = CodeOfConduct.new(
        title: 'Some Title',
        content: 'Some Content',
        created_by: 'fakeuser'
      )

      code_of_conduct.save!

      login_for_test

      get '/api/v2/codes_of_conduct'

      expect(response).to have_http_status(200)
      expect(json['data']['title']).to eq(code_of_conduct.title)
      expect(json['data']['content']).to eq(code_of_conduct.content)
      expect(json['data']['created_by']).to eq(code_of_conduct.created_by)
      expect(json['data']['created_on']).not_to be_nil
    end

    context 'when a code of conduct already exists' do
      it 'returns the last code of conduct created' do
        CodeOfConduct.create!(
          title: 'Some Title',
          content: 'Some Content',
          created_by: 'fakeuser'
        )

        code_of_conduct = CodeOfConduct.new(
          title: 'Some Title',
          content: 'Some Content',
          created_by: 'fakeuser'
        )
        code_of_conduct.save!

        login_for_test

        get '/api/v2/codes_of_conduct'

        expect(response).to have_http_status(200)
        expect(json['data']['title']).to eq(code_of_conduct.title)
        expect(json['data']['content']).to eq(code_of_conduct.content)
        expect(json['data']['created_by']).to eq(code_of_conduct.created_by)
        expect(json['data']['created_on']).not_to be_nil
      end
    end
  end

  describe 'POST /api/v2/codes_of_conduct' do
    it 'creates a new code of conduct with 200 and returns it as JSON' do
      login_for_test(
        permissions: [
          Permission.new(resource: Permission::CODE_OF_CONDUCT, actions: [Permission::MANAGE])
        ]
      )

      params = {
        data: { title:  'Some Title', content: 'Some Content' }
      }

      post '/api/v2/codes_of_conduct', params: params

      code_of_conduct = CodeOfConduct.current

      expect(response).to have_http_status(200)
      expect(json['data']['title']).to eq(code_of_conduct.title)
      expect(json['data']['content']).to eq(code_of_conduct.content)
      expect(json['data']['created_by']).to eq(code_of_conduct.created_by)
      expect(json['data']['created_on']).not_to be_nil
    end

    it "returns 403 if user isn't authorized to create code of conducts" do
      login_for_test(permissions: [])

      params = {
        data: { title:  'Some Title', content: 'Some Content' }
      }

      post '/api/v2/codes_of_conduct', params: params

      expect(response).to have_http_status(403)
      expect(json['errors'].size).to eq(1)
      expect(json['errors'][0]['resource']).to eq('/api/v2/codes_of_conduct')
    end

    context 'when a code of conduct already exists' do
      it 'only updates the created_on and created_by fields if the content did not change' do
        date_time1 = DateTime.parse('2021/03/12 15:50:55')
        DateTime.stub(:now).and_return(date_time1)

        created_code_of_conduct = CodeOfConduct.create!(
          title: 'Some Title',
          content: 'Some Content',
          created_by: 'testuser'
        )

        login_for_test(
          permissions: [
            Permission.new(resource: Permission::CODE_OF_CONDUCT, actions: [Permission::MANAGE])
          ]
        )

        params = {
          data: { title: 'Some Title', content: 'Some Content' }
        }

        date_time2 = DateTime.parse('2021/03/12 15:50:55')
        DateTime.stub(:now).and_return(date_time2)

        post '/api/v2/codes_of_conduct', params: params

        current_code_of_conduct = CodeOfConduct.current

        expect(response).to have_http_status(200)
        expect(json['data']['title']).to eq(current_code_of_conduct.title)
        expect(json['data']['content']).to eq(current_code_of_conduct.content)
        expect(json['data']['created_by']).to eq(current_code_of_conduct.created_by)
        expect(DateTime.parse(json['data']['created_on'])).to eq(date_time2)
        expect(created_code_of_conduct.id).to eq(current_code_of_conduct.id)
      end
    end
  end
end
