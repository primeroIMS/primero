require 'rails_helper'

describe Reopenable do

  describe 'reopen log history' do
    it 'has empty log history on start' do
      test = Child.new()

      expect(test.reopened_logs.count).to equal(0)
    end

    it 'adds log with current time' do
      test = Child.new()
      date_time = DateTime.parse("2016/08/01 12:54:55 -0400")

      DateTime.stub(:now).and_return(date_time)

      test.add_reopened_log("")

      expect(test.reopened_logs.count).to equal(1)
      expect(test.reopened_logs.first['reopened_date']). to equal(date_time)
    end
  end

  describe 'updates to reopen logs' do
    before :each do
      @child = Child.create!(data: {'status' => Record::STATUS_CLOSED})
      @child.update_properties(
        {'status' => Record::STATUS_OPEN, 'case_status_reopened' => true},
        'reopen_user')
      @child.save!
    end

    it 'logs the user responsible for the reopen in the reopen log' do
      expect(@child.reopened_logs.last['reopened_user']).to eq('reopen_user')
    end
  end

  describe 'automatic record reopens' do

    before :each do
      @child = Child.create!(data: {'status' => Record::STATUS_CLOSED})
    end

    it 'reopens a closed record on incident update and logs' do
      @child.update_properties({'services_section' => [{
        'service_type' => 'nfi'
      }]}, 'reopen_user')
      @child.save!

      expect(@child.status).to eq(Record::STATUS_OPEN)
      expect(@child.case_status_reopened).to eq(true)
      expect(@child.reopened_logs.last['reopened_user']).to eq('reopen_user')
    end

    it 'reopens a closed record on service update and logs' do
      @child.update_properties({'incident_details' => [{
        'description' => 'An incident is recorded'
      }]}, 'reopen_user')
      @child.save!

      expect(@child.status).to eq(Record::STATUS_OPEN)
      expect(@child.case_status_reopened).to eq(true)
      expect(@child.reopened_logs.last['reopened_user']).to eq('reopen_user')
    end

    it "doesn't reopen the record on arbitrary updates" do
      @child.update_properties({'name' => 'Test 1'}, 'reopen_user')
      @child.save!

      expect(@child.status).to eq(Record::STATUS_CLOSED)
      expect(@child.case_status_reopened).to be_falsey
      expect(@child.reopened_logs.size).to eq(0)
    end
  end

  describe 'close record' do
    let(:child) { Child.create!(name: 'test') }

    it 'marks the closure date if the child is closed' do
      child.update_attributes(status: Record::STATUS_CLOSED)
      expect(child.date_closure.present?).to be_truthy
    end

    it 'keeps the closure date blank is the child is still open' do
      child.update_attributes(name: 'Test 1')
      expect(child.date_closure.present?).to be_falsey
    end
  end

  after :each do
    clean_data(Child)
  end

end