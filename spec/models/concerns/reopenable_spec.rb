# frozen_string_literal: true

require 'rails_helper'

describe Reopenable do
  describe 'reopen log history' do
    it 'has empty log history on start' do
      test = Child.new

      expect(test.reopened_logs.count).to equal(0)
    end

    it 'adds log with current time' do
      test = Child.new
      date_time = DateTime.parse('2016/08/01 12:54:55 -0400')

      DateTime.stub(:now).and_return(date_time)

      test.add_reopened_log('')

      expect(test.reopened_logs.count).to equal(1)
      expect(test.reopened_logs.first['reopened_date']).to equal(date_time)
    end
  end

  describe 'updates to reopen logs' do
    before :each do
      @child = Child.create!(data: { 'status' => Record::STATUS_CLOSED })
      @child.update_properties(
        fake_user(user_name: 'reopen_user'),
        'status' => Record::STATUS_OPEN, 'case_status_reopened' => true
      )
      @child.save!
    end

    it 'logs the user responsible for the reopen in the reopen log' do
      expect(@child.reopened_logs.last['reopened_user']).to eq('reopen_user')
    end
  end

  describe 'automatic record reopens' do
    before :each do
      @child = Child.create!(data: { 'status' => Record::STATUS_CLOSED })
    end

    it 'keeps the record closed even if created with a service' do
      child_with_service = Child.create!(
        data: {
          'status' => Record::STATUS_CLOSED,
          'services_section' => [{ 'service_type' => 'service_1' }]
        }
      )

      expect(child_with_service.status).to eq(Record::STATUS_CLOSED)
      expect(child_with_service.case_status_reopened).to be_falsey
      expect(child_with_service.reopened_logs.size).to eq(0)
    end

    it 'does not reopen a record if it is disabled' do
      disabled_child = Child.create!(
        data: {
          'status' => Record::STATUS_CLOSED,
          'record_state' => false
        }
      )

      disabled_child.update_properties(
        fake_user(user_name: 'reopen_user'),
        'services_section' => [{ 'service_type' => 'nfi' }]
      )

      expect(disabled_child.status).to eq(Record::STATUS_CLOSED)
      expect(disabled_child.case_status_reopened).to be_falsey
      expect(disabled_child.reopened_logs.size).to eq(0)
    end

    it 'reopens a closed record if a service is added, logs and workflow' do
      @child.update_properties(
        fake_user(user_name: 'reopen_user'),
        'services_section' => [{ 'service_type' => 'nfi' }]
      )
      @child.save!

      expect(@child.status).to eq(Record::STATUS_OPEN)
      expect(@child.case_status_reopened).to eq(true)
      expect(@child.reopened_logs.last['reopened_user']).to eq('reopen_user')
      expect(@child.workflow).to eq(Workflow::WORKFLOW_REOPENED)
    end

    it 'reopens a closed record on incident update, logs and workflow' do
      @child.update_properties(
        fake_user(user_name: 'reopen_user'),
        'incident_details' => [{ 'description' => 'An incident is recorded' }]
      )
      @child.save!

      expect(@child.status).to eq(Record::STATUS_OPEN)
      expect(@child.case_status_reopened).to eq(true)
      expect(@child.reopened_logs.last['reopened_user']).to eq('reopen_user')
      expect(@child.workflow).to eq(Workflow::WORKFLOW_REOPENED)
    end

    it 'does not reopen a closed record if a service is updated' do
      child_with_service = Child.create!(
        data: {
          'status' => Record::STATUS_CLOSED,
          'services_section' => [{ 'service_type' => 'service_1' }]
        }
      )

      child_with_service.update_properties(
        fake_user(user_name: 'reopen_user'),
        'services_section' => [
          child_with_service.services_section.first.merge('service_implemented' => 'not_implemented')
        ]
      )

      child_with_service.save!
      child_with_service.reload

      expect(child_with_service.services_section.first['service_implemented']).to eq('not_implemented')
      expect(@child.status).to eq(Record::STATUS_CLOSED)
      expect(@child.case_status_reopened).to be_falsey
      expect(@child.reopened_logs.size).to eq(0)
    end

    it 'does not reopen an already open record if it is enabled' do
      child_open = Child.create!(data: { 'status' => Record::STATUS_OPEN })
      child_open.services_section = [{ service_type: 'new_service' }]
      child_open.record_state = true
      child_open.save!

      expect(child_open.status).to eq(Record::STATUS_OPEN)
      expect(child_open.case_status_reopened).to be_falsey
      expect(child_open.reopened_logs.size).to eq(0)
    end

    it 'does not reopen the record on arbitrary updates' do
      @child.update_properties(fake_user(user_name: 'reopen_user'), 'name' => 'Test 1')
      @child.save!

      expect(@child.status).to eq(Record::STATUS_CLOSED)
      expect(@child.case_status_reopened).to be_falsey
      expect(@child.reopened_logs.size).to eq(0)
    end
  end

  describe 'close record' do
    let(:child) { Child.create!(name: 'test') }

    it 'marks the closure date if the child is closed' do
      child.update(status: Record::STATUS_CLOSED)
      expect(child.date_closure.present?).to be_truthy
    end

    it 'keeps the closure date blank is the child is still open' do
      child.update(name: 'Test 1')
      expect(child.date_closure.present?).to be_falsey
    end
  end

  describe 'reopens a closed record that was reopened before' do
    let(:child) { Child.create!(name: 'test', status: Record::STATUS_CLOSED, case_status_reopened: true) }

    it 'reopens the record' do
      child.update(status: Record::STATUS_OPEN)
      expect(child.status).to eq(Record::STATUS_OPEN)
      expect(child.case_status_reopened).to eq(true)
    end
  end

  after :each do
    clean_data(Incident, Child)
  end
end
