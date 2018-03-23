require 'rails_helper'

describe AuditLog do
  describe 'timestamp' do
    before do
      DateTime.stub(:now).and_return(Time.utc(2018, "mar", 23, 19, 5, 0))
    end

    it 'is set to the current time' do
      audit_log = AuditLog.new
      expect(audit_log.timestamp).to eq(DateTime.parse("2018-03-23 19:05:00UTC"))
    end
  end

  describe 'by_timestamp' do
    before do
      AuditLog.all.each(&:destroy)
      DateTime.stub(:now).and_return(3.days.ago)
      @audit_log1 = AuditLog.create!(user_name: 'tester_one', action_name: 'create', record_id: 111, record_type: 'case')
      DateTime.stub(:now).and_return(2.days.ago)
      @audit_log2 = AuditLog.create!(user_name: 'tester_two', action_name: 'update', record_id: 222, record_type: 'incident')
      DateTime.stub(:now).and_return(1.day.ago)
      @audit_log3 = AuditLog.create!(user_name: 'tester_three', action_name: 'destroy', record_id: 333, record_type: 'tracing_request')
    end

    it 'returns all entries sorted by timestamp' do
      expect(AuditLog.by_timestamp.all).to eq([@audit_log1, @audit_log2, @audit_log3])
    end

    describe 'descending' do
      it 'returns all entries sorted by timestamp in descending order' do
        expect(AuditLog.by_timestamp(descending: true).all).to eq([@audit_log3, @audit_log2, @audit_log1])
      end
    end
  end
end
