# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe IndicatorQueryService, search: true do
  before :each do
    SystemSettings.create!(reporting_location_config: { admin_level: 2, field_key: 'owned_by_location' })

    SystemSettings.current(true)

    permission_case = Permission.new(
      resource: Permission::CASE, actions: [Permission::READ]
    )
    role_self = Role.new(group_permission: Permission::SELF, permissions: [permission_case])
    role_self.save(validate: false)
    role_group = Role.new(group_permission: Permission::GROUP, permissions: [permission_case])
    role_group.save(validate: false)
    @group1 = UserGroup.create!(unique_id: 'usergroup-group1', name: 'Group1')
    group2 = UserGroup.create!(unique_id: 'usergroup-group2', name: 'Group2')

    @foo = User.new(user_name: 'foo', role: role_self, user_groups: [@group1])
    @foo.save(validate: false)
    @bar = User.new(user_name: 'bar', role: role_group, user_groups: [@group1])
    @bar.save(validate: false)
    @baz = User.new(user_name: 'baz', role: role_self, user_groups: [group2])
    @baz.save(validate: false)

    # TODO: Add back indicators once the pivoted/faceted indicators are migrated to SQL
    @indicators =
      Dashboard::CASE_OVERVIEW.indicators # +
    # Dashboard::WORKFLOW.indicators +
    # Dashboard::WORKFLOW_TEAM.indicators

    Child.create!(
      data: {
        record_state: true, status: 'open', owned_by: 'foo', workflow: 'new',
        owned_by_groups: %w[usergroup-group1]
      }
    )
    Child.create!(data: {
                    record_state: true, status: 'open', owned_by: 'foo',
                    last_updated_by: 'bar', workflow: 'assessment', owned_by_groups: %w[usergroup-group1]
                  })
    Child.create!(data: { record_state: false, status: 'open', owned_by: 'foo', workflow: 'new' })
    Child.create!(data: {
                    record_state: true, status: 'closed', owned_by: 'foo',
                    date_closure: 1.day.ago, workflow: 'closed', owned_by_groups: %w[usergroup-group1]
                  })
    Child.create!(data: {
                    record_state: true, status: 'closed', owned_by: 'foo',
                    date_closure: 2.days.ago, workflow: 'closed', owned_by_groups: %w[usergroup-group1]
                  })
    Child.create!(data: {
                    record_state: true, status: 'closed', owned_by: 'foo',
                    date_closure: 15.days.ago, workflow: 'closed', owned_by_groups: %w[usergroup-group1]
                  })
    Child.create!(
      data: {
        record_state: true, status: 'open', owned_by: 'bar', owned_by_groups: %w[usergroup-group1], workflow: 'new',
        assigned_user_names: %w[user_service],
        services_section: [
          { 'service_response_day_time' => 5.day.ago, 'service_response_timeframe' => '3_hours' }
        ]
      }
    )
    Child.create!(data: { record_state: true, status: 'open', owned_by: 'baz', workflow: 'new' })
    Child.create!(data: { record_state: true, status: 'closed', owned_by: 'baz', workflow: 'closed' })

    Sunspot.commit
  end

  describe 'individual user scope' do
    let(:stats) do
      IndicatorQueryService.query(@indicators, @foo)
    end

    it 'shows the number of all open cases' do
      expect(stats['case']['total']['total']['count']).to eq(2)
    end

    it 'shows the string queries to get all open cases' do
      expected_query = %w[record_state=true status=open]
      expect(stats['case']['total']['total']['query']).to match_array(expected_query)
    end

    it 'shows the number of updated cases' do
      expect(stats['case']['new_or_updated']['new_or_updated']['count']).to eq(1)
    end

    it 'shows the string queries to get all updated cases' do
      expected_query = %w[record_state=true status=open not_edited_by_owner=true]
      expect(stats['case']['new_or_updated']['new_or_updated']['query']).to match_array(expected_query)
    end

    xit 'shows the workflows breakdown' do
      expect(stats['case']['workflow']['new']['count']).to eq(1)
      expect(stats['case']['workflow']['assessment']['count']).to eq(1)
      expect(stats['case']['workflow']['closed']['count']).to eq(3)
    end

    xit 'shows the string queries to get the workflow breakdown' do
      expected_query_new = %w[record_state=true status=open,closed owned_by=foo workflow=new]
      expect(stats['case']['workflow']['new']['query']).to match_array(expected_query_new)
      expected_query_assessment = %w[record_state=true status=open,closed owned_by=foo workflow=assessment]
      expect(stats['case']['workflow']['assessment']['query']).to match_array(expected_query_assessment)
    end
  end

  xdescribe 'team user scope' do
    let(:stats) do
      IndicatorQueryService.query(@indicators, @bar)
    end

    it 'shows the team workflow breakdown' do
      expect(stats['case']['workflow_team']['foo']['new']['count']).to eq(1)
      expect(stats['case']['workflow_team']['foo']['assessment']['count']).to eq(1)
      expect(stats['case']['workflow_team']['bar']['new']['count']).to eq(1)
      expect(stats['case']['workflow_team']['bar']['assessment']['count']).to eq(0)
    end

    it 'does not return out of scope results' do
      expect(stats['case']['workflow_team']['baz']).to be_nil
    end

    it 'shows the string queries to get the workflow breakdown by user' do
      expected_query_foo_new = %w[
        record_state=true status=open,closed owned_by=foo workflow=new owned_by_groups=usergroup-group1
      ]
      expect(stats['case']['workflow_team']['foo']['new']['query']).to match_array(expected_query_foo_new)

      expected_query_foo_assessment = %w[
        record_state=true status=open,closed owned_by=foo workflow=assessment owned_by_groups=usergroup-group1
      ]
      expect(stats['case']['workflow_team']['foo']['assessment']['query']).to match_array(expected_query_foo_assessment)

      expected_query_bar_new = %w[
        record_state=true status=open,closed owned_by=bar workflow=new owned_by_groups=usergroup-group1
      ]
      expect(stats['case']['workflow_team']['bar']['new']['query']).to match_array(expected_query_bar_new)

      expected_query_bar_assessment = %w[
        record_state=true status=open,closed owned_by=bar workflow=assessment owned_by_groups=usergroup-group1
      ]
      expect(stats['case']['workflow_team']['bar']['assessment']['query']).to match_array(expected_query_bar_assessment)
    end

    it 'Get the real present date time' do
      role_overdue_services = Role.new(
        group_permission: Permission::GROUP,
        permissions: [Permission.new(
          resource: Permission::DASHBOARD,
          actions: [Permission::DASH_CASES_BY_TASK_OVERDUE_SERVICES]
        )]
      )
      user_services = User.new(user_name: 'user_service', role: role_overdue_services, user_groups: [@group1])
      user_services.save(validate: false)

      indicators = user_services.role.dashboards.map(&:indicators).flatten
      indicator_stats = IndicatorQueryService.query(indicators, user_services)
      present_date_a = indicator_stats['case']['tasks_overdue_services']['bar']['query'][2].split('..').last
      sleep(2) # To get a diferent present date time

      indicators = user_services.role.dashboards.map(&:indicators).flatten
      indicator_stats = IndicatorQueryService.query(indicators, user_services)
      present_date_b = indicator_stats['case']['tasks_overdue_services']['bar']['query'][2].split('..').last

      expect(present_date_a).not_to eq(present_date_b)
    end
  end

  after :each do
    clean_data(User, UserGroup, Role, Child, SystemSettings)
    Sunspot.commit
  end
end
