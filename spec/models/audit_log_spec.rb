require 'rails_helper'

describe AuditLog do
  before do
    Timecop.freeze(Time.local(2018, 3, 13, 8, 30, 0))
    AuditLog.all.each(&:destroy)

    DateTime.stub(:now).and_return(90.hours.ago)
    @audit_log0 = AuditLog.create!(user_name: 'tester_three', action_name: 'login')
    DateTime.stub(:now).and_return(85.hours.ago)
    @audit_log1 = AuditLog.create!(user_name: 'tester_three', action_name: 'logout')
    DateTime.stub(:now).and_return(80.hours.ago)
    @audit_log2 = AuditLog.create!(user_name: 'tester_one', action_name: 'login')
    DateTime.stub(:now).and_return(3.days.ago)
    @audit_log3 = AuditLog.create!(user_name: 'tester_one', action_name: 'create', record_id: 111, record_type: 'case', owned_by: 'owner_one')
    DateTime.stub(:now).and_return(70.hours.ago)
    @audit_log4 = AuditLog.create!(user_name: 'tester_one', action_name: 'logout')
    DateTime.stub(:now).and_return(50.hours.ago)
    @audit_log5 = AuditLog.create!(user_name: 'tester_two', action_name: 'login')
    DateTime.stub(:now).and_return(2.days.ago)
    @audit_log6 = AuditLog.create!(user_name: 'tester_two', action_name: 'update', record_id: 222, record_type: 'incident', owned_by: 'owner_one')
    DateTime.stub(:now).and_return(40.hours.ago)
    @audit_log7 = AuditLog.create!(user_name: 'tester_two', action_name: 'logout')
    DateTime.stub(:now).and_return(30.hours.ago)
    @audit_log8 = AuditLog.create!(user_name: 'tester_three', action_name: 'login')
    DateTime.stub(:now).and_return(1.day.ago)
    @audit_log9 = AuditLog.create!(user_name: 'tester_three', action_name: 'destroy', record_id: 333, record_type: 'tracing_request', owned_by: 'owner_two')
    DateTime.stub(:now).and_return(20.hours.ago)
    @audit_log10 = AuditLog.create!(user_name: 'tester_three', action_name: 'logout')
    DateTime.stub(:now).and_return(15.hours.ago)
    @audit_log11 = AuditLog.create!(user_name: 'tester_two', action_name: 'login')
    DateTime.stub(:now).and_return(10.hours.ago)
    @audit_log12 = AuditLog.create!(user_name: 'tester_two', action_name: 'logout')
    DateTime.stub(:now).and_return(1.hour.ago)
    @audit_log13 = AuditLog.create!(user_name: 'tester_three', action_name: 'login')
    DateTime.stub(:now).and_return(45.minutes.ago)
    @audit_log14 = AuditLog.create!(user_name: 'tester_three', action_name: 'logout')
  end

  after do
    Timecop.return
  end

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
    it 'returns all entries sorted by timestamp' do
      expect(AuditLog.all).to eq([@audit_log0, @audit_log1, @audit_log2, @audit_log3, @audit_log4,
                                  @audit_log5, @audit_log6, @audit_log7, @audit_log8, @audit_log9,
                                  @audit_log10, @audit_log11, @audit_log12, @audit_log13, @audit_log14])
    end

    describe 'descending' do
      it 'returns all entries sorted by timestamp in descending order' do
        expect(AuditLog.order(timestamp: :desc).all).to eq([@audit_log14, @audit_log13, @audit_log12,
                                                            @audit_log11, @audit_log10, @audit_log9, @audit_log8,
                                                            @audit_log7, @audit_log6, @audit_log5, @audit_log4,
                                                            @audit_log3, @audit_log2, @audit_log1, @audit_log0])
      end
    end
  end

end
