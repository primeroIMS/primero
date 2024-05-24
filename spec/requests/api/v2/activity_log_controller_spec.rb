# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe Api::V2::ActivityLogController, type: :request do
  before :each do
    clean_data(UserGroup, User, Child, RecordHistory)

    group1 = UserGroup.create!(name: 'Group1')

    @foo = User.new(user_name: 'foo', user_groups: [group1], location: 'CTY')
    @foo.save(validate: false)

    @child = Child.create!(
      data: { record_state: true, status: 'open', owned_by: 'foo', last_updated_by: 'bar' }
    )

    RecordHistory.create!(
      record: @child,
      record_changes: {
        transfer_status: { from: Transition::STATUS_INPROGRESS, to: Transition::STATUS_ACCEPTED },
        owned_by: { from: 'foo', to: 'other' }
      },
      datetime: Time.zone.now
    )
    RecordHistory.create!(
      record: @child,
      record_changes: {
        transfer_status: { from: Transition::STATUS_INPROGRESS, to: Transition::STATUS_REJECTED },
        assigned_user_names: { from: %w[foo other], to: ['foo'] }
      },
      datetime: Time.zone.now - 3.days
    )
  end

  let(:json) { JSON.parse(response.body) }

  describe 'GET /api/v2/activity_log' do
    it 'return transfer activities if a user has the activity_log - transfer permission' do
      login_for_test(
        user_name: 'foo',
        group_permission: Permission::SELF,
        permissions: [
          Permission.new(
            resource: Permission::ACTIVITY_LOG,
            actions: [Permission::TRANSFER]
          )
        ]
      )

      get '/api/v2/activity_log'

      expect(response).to have_http_status(200)
      expect(json['data'].size).to eq(2)
      expect(json['data'][0]['type']).to eq('transfer')
      expect(json['data'][0]['data']['status']['to']).to eq(Transition::STATUS_ACCEPTED)
      expect(json['data'][1]['type']).to eq('transfer')
      expect(json['data'][1]['data']['status']['to']).to eq(Transition::STATUS_REJECTED)
    end

    it 'returns 403 if user is not authorized to access' do
      login_for_test(permissions: [])
      get '/api/v2/activity_log'

      expect(response).to have_http_status(403)
    end
  end
end
