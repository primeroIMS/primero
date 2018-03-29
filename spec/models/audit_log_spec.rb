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
    @audit_log3 = AuditLog.create!(user_name: 'tester_one', action_name: 'create', record_id: 111, record_type: 'case')
    DateTime.stub(:now).and_return(70.hours.ago)
    @audit_log4 = AuditLog.create!(user_name: 'tester_one', action_name: 'logout')
    DateTime.stub(:now).and_return(50.hours.ago)
    @audit_log5 = AuditLog.create!(user_name: 'tester_two', action_name: 'login')
    DateTime.stub(:now).and_return(2.days.ago)
    @audit_log6 = AuditLog.create!(user_name: 'tester_two', action_name: 'update', record_id: 222, record_type: 'incident')
    DateTime.stub(:now).and_return(40.hours.ago)
    @audit_log7 = AuditLog.create!(user_name: 'tester_two', action_name: 'logout')
    DateTime.stub(:now).and_return(30.hours.ago)
    @audit_log8 = AuditLog.create!(user_name: 'tester_three', action_name: 'login')
    DateTime.stub(:now).and_return(1.day.ago)
    @audit_log9 = AuditLog.create!(user_name: 'tester_three', action_name: 'destroy', record_id: 333, record_type: 'tracing_request')
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
      expect(AuditLog.by_timestamp.all).to eq([@audit_log0, @audit_log1, @audit_log2, @audit_log3, @audit_log4,
                                               @audit_log5, @audit_log6, @audit_log7, @audit_log8, @audit_log9,
                                               @audit_log10, @audit_log11, @audit_log12, @audit_log13, @audit_log14])
    end

    describe 'descending' do
      it 'returns all entries sorted by timestamp in descending order' do
        expect(AuditLog.by_timestamp(descending: true).all).to eq([@audit_log14, @audit_log13, @audit_log12,
                                                                   @audit_log11, @audit_log10, @audit_log9, @audit_log8,
                                                                   @audit_log7, @audit_log6, @audit_log5, @audit_log4,
                                                                   @audit_log3, @audit_log2, @audit_log1, @audit_log0])
      end
    end
  end

  describe 'find_by_timestamp' do
    context 'when no parameters are passed in' do
      it 'returns all entries sorted by timestamp in descending order' do
        expect(AuditLog.find_by_timestamp).to eq([@audit_log14, @audit_log13, @audit_log12, @audit_log11, @audit_log10,
                                                  @audit_log9, @audit_log8, @audit_log7, @audit_log6, @audit_log5,
                                                  @audit_log4, @audit_log3, @audit_log2, @audit_log1, @audit_log0])
      end
    end
    context 'when only a from time is passed in' do
      it 'returns entries between the from time and the current time in descending order' do
        expect(AuditLog.find_by_timestamp(35.hours.ago)).to eq([@audit_log14, @audit_log13, @audit_log12, @audit_log11,
                                                                @audit_log10, @audit_log9, @audit_log8])
      end
    end
    context 'when only a to time is passed in' do
      it 'returns all entries up until the to time in descending order' do
        expect(AuditLog.find_by_timestamp(nil, 35.hours.ago)).to eq([@audit_log7, @audit_log6, @audit_log5, @audit_log4,
                                                                     @audit_log3, @audit_log2, @audit_log1, @audit_log0])
      end
    end
    context 'when from time and to time are passed in' do
      context 'and from time is less than to time' do
        it 'returns entries between the from time and the to time in descending order' do
          expect(AuditLog.find_by_timestamp(35.hours.ago, 15.hours.ago)).to eq([@audit_log11, @audit_log10, @audit_log9,
                                                                                @audit_log8])
        end
      end
      context 'and from time is greater than to time' do
        it 'retruns an empty array' do
          expect(AuditLog.find_by_timestamp(15.hours.ago, 35.hours.ago)).to eq([])
        end
      end
      context 'and from time is the same as to time' do
        it 'returns entries matching that exact time' do
          expect(AuditLog.find_by_timestamp(20.hours.ago, 20.hours.ago)).to eq([@audit_log10])
        end
      end
    end
  end

  describe 'find_by_user_name_and_timestamp' do
    context 'when search user name is blank' do
      it 'returns an empty array' do
        expect(AuditLog.find_by_user_name_and_timestamp('')).to eq([])
      end
    end
    context 'when search user name is an array' do
      #TODO - currently this returns empty array.  Need to change if we support multiple search users
      it 'retruns an empty array' do
        expect(AuditLog.find_by_user_name_and_timestamp(['tester_one'])).to eq([])
      end
    end
    context 'when search user name is an integer' do
      it 'retruns an empty array' do
        expect(AuditLog.find_by_user_name_and_timestamp(12345)).to eq([])
      end
    end
    context 'when search user name is a string' do
      context 'and user name does not exist in the audit log' do
        it 'retruns an empty array' do
          expect(AuditLog.find_by_user_name_and_timestamp('tester_does_not_exist')).to eq([])
        end
      end
      context 'and user name does exist in the audit log' do
        context 'and no timestamps are passed in' do
          it 'returns all entries for search user sorted by timestamp in descending order' do
            expect(AuditLog.find_by_user_name_and_timestamp('tester_two')).to eq([@audit_log12, @audit_log11,
                                                                                  @audit_log7, @audit_log6, @audit_log5])
          end
        end
        context 'and only a from time is passed in' do
          it 'returns entries for search user between the from time and the current time in descending order' do
            expect(AuditLog.find_by_user_name_and_timestamp('tester_three', 35.hours.ago)).to eq([@audit_log14,
                                                                                                  @audit_log13,
                                                                                                  @audit_log10,
                                                                                                  @audit_log9,
                                                                                                  @audit_log8])
          end
        end
        context 'and only a to time is passed in' do
          it 'returns all entries for search user up until the to time in descending order' do
            expect(AuditLog.find_by_user_name_and_timestamp('tester_three', nil, 35.hours.ago)).to eq([@audit_log1,
                                                                                                       @audit_log0])
          end
        end
        context 'and from time and to time are passed in' do
          context 'and from time is less than to time' do
            it 'returns entries for search user between the from time and the to time in descending order' do
              expect(AuditLog.find_by_user_name_and_timestamp('tester_three', 35.hours.ago, 15.hours.ago)).to eq([@audit_log10,
                                                                                                                  @audit_log9,
                                                                                                                  @audit_log8])
            end
          end
          context 'and from time is greater than to time' do
            it 'retruns an empty array' do
              expect(AuditLog.find_by_user_name_and_timestamp('tester_three', 15.hours.ago, 35.hours.ago)).to eq([])
            end
          end
          context 'and from time is the same as to time' do
            it 'returns entries for search user matching that exact time' do
              expect(AuditLog.find_by_user_name_and_timestamp('tester_three', 20.hours.ago, 20.hours.ago)).to eq([@audit_log10])
            end
          end
        end
      end
    end
  end

  describe 'find_by_action_name_and_timestamp' do
    context 'when search action name is blank' do
      it 'returns an empty array' do
        expect(AuditLog.find_by_action_name_and_timestamp('')).to eq([])
      end
    end
    context 'when search action name is an array' do
      #TODO - currently this returns empty array.  Need to change if we support multiple search actions
      it 'retruns an empty array' do
        expect(AuditLog.find_by_action_name_and_timestamp(['login'])).to eq([])
      end
    end
    context 'when search action name is an integer' do
      it 'retruns an empty array' do
        expect(AuditLog.find_by_action_name_and_timestamp(12345)).to eq([])
      end
    end
    context 'when search action name is a string' do
      context 'and action name does not exist in the audit log' do
        it 'retruns an empty array' do
          expect(AuditLog.find_by_action_name_and_timestamp('action_does_not_exist')).to eq([])
        end
      end
      context 'and action name does exist in the audit log' do
        context 'and no timestamps are passed in' do
          it 'returns all entries for search action sorted by timestamp in descending order' do
            expect(AuditLog.find_by_action_name_and_timestamp('login')).to eq([@audit_log13, @audit_log11, @audit_log8,
                                                                               @audit_log5, @audit_log2, @audit_log0])
          end
        end
        context 'and only a from time is passed in' do
          it 'returns entries for search action between the from time and the current time in descending order' do
            expect(AuditLog.find_by_action_name_and_timestamp('login', 35.hours.ago)).to eq([@audit_log13, @audit_log11,
                                                                                             @audit_log8])
          end
        end
        context 'and only a to time is passed in' do
          it 'returns all entries for search action up until the to time in descending order' do
            expect(AuditLog.find_by_action_name_and_timestamp('login', nil, 35.hours.ago)).to eq([@audit_log5,
                                                                                                  @audit_log2,
                                                                                                  @audit_log0])
          end
        end
        context 'and from time and to time are passed in' do
          context 'and from time is less than to time' do
            it 'returns entries for search action between the from time and the to time in descending order' do
              expect(AuditLog.find_by_action_name_and_timestamp('login', 35.hours.ago, 15.hours.ago)).to eq([@audit_log11,
                                                                                                             @audit_log8])
            end
          end
          context 'and from time is greater than to time' do
            it 'retruns an empty array' do
              expect(AuditLog.find_by_action_name_and_timestamp('login', 15.hours.ago, 35.hours.ago)).to eq([])
            end
          end
          context 'and from time is the same as to time' do
            it 'returns entries for search user matching that exact time' do
              expect(AuditLog.find_by_action_name_and_timestamp('login', 1.hour.ago, 1.hour.ago)).to eq([@audit_log13])
            end
          end
        end
      end
    end
  end
end
