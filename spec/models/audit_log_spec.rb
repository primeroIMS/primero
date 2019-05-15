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

  describe 'find_by_timestamp' do
    context 'when per_page is greater than number of records' do
      let(:per_page) { 100 }

      context 'and no time parameters are passed in' do
        let(:audit_log_result) { AuditLog.order(timestamp: :desc).try(:paginate, page: 1, per_page: per_page) }

        it 'returns all entries sorted by timestamp in descending order' do
          expect(audit_log_result.try(:all)).to eq([@audit_log14, @audit_log13, @audit_log12, @audit_log11, @audit_log10,
                                                    @audit_log9, @audit_log8, @audit_log7, @audit_log6, @audit_log5,
                                                    @audit_log4, @audit_log3, @audit_log2, @audit_log1, @audit_log0])
        end

        it 'returns count of total records fetched by the query' do
          expect(audit_log_result.count).to eq(15)
        end
      end
      context 'and only a to time is passed in' do
        let(:audit_log_result) { AuditLog.where("timestamp IS NULL or timestamp < ?", 35.hours.ago).order(timestamp: :desc).try(:paginate, page: 1, per_page: per_page) }

        it 'returns all entries up until the to time in descending order' do
          expect(audit_log_result.try(:all)).to eq([@audit_log7, @audit_log6, @audit_log5, @audit_log4,
                                                    @audit_log3, @audit_log2, @audit_log1, @audit_log0])
        end
        it 'returns count of total records fetched by the query' do
          expect(audit_log_result.count).to eq(8)
        end
      end
      context 'and from time and to time are passed in' do
        context 'and from time is less than to time' do
          let(:audit_log_result) { AuditLog.where("timestamp BETWEEN ? AND ?", 35.hours.ago, 15.hours.ago).order(timestamp: :desc).try(:paginate, page: 1, per_page: per_page) }

          it 'returns entries between the from time and the to time in descending order' do
            expect(audit_log_result.try(:all)).to eq([@audit_log11, @audit_log10, @audit_log9, @audit_log8])
          end
          it 'returns count of total records fetched by the query' do
            expect(audit_log_result.count).to eq(4)
          end
        end
        context 'and from time is greater than to time' do
          let(:audit_log_result) {  AuditLog.where("timestamp BETWEEN ? AND ?", 15.hours.ago, 35.hours.ago) }

          it 'returns nil' do
            expect(audit_log_result).to eq([])
          end
        end
        context 'and from time is the same as to time' do
          let(:audit_log_result) { AuditLog.where("timestamp BETWEEN ? AND ?", 20.hours.ago, 20.hours.ago).page(1).per_page(per_page) }

          it 'returns entries matching that exact time' do
            expect(audit_log_result.try(:all)).to eq([@audit_log10])
          end
          it 'returns count of total records fetched by the query' do
            expect(audit_log_result.count).to eq(1)
          end
        end
        context 'and from time is not a date/time' do
          it 'retruns nil' do
            expect { AuditLog.find_by_timestamp('abc', 1.hour.ago) }.to raise_exception(ArgumentError)
          end
        end
        context 'and to time is not a date/time' do
          it 'retruns nil' do
            expect { AuditLog.find_by_timestamp(1.day.ago, 'def') }.to raise_exception(ArgumentError)
          end
        end
      end
    end

    context 'when per_page is less than number of records' do
      let(:per_page) { 10 }

      context 'and page is 1' do
        let(:page) { 1 }
        let(:audit_log_result) { AuditLog.order(timestamp: :desc).try(:paginate, page: page, per_page: per_page) }

        it 'returns the first page of entries sorted by timestamp in descending order' do
          expect(audit_log_result.try(:all)).to eq([@audit_log14, @audit_log13, @audit_log12, @audit_log11, @audit_log10,
                                                    @audit_log9, @audit_log8, @audit_log7, @audit_log6, @audit_log5])
        end

        it 'returns count of total records fetched by the query' do
          expect(audit_log_result.count).to eq(15)
        end
      end

      context 'and page is 2' do
        let(:page) { 2 }
        let(:audit_log_result) { AuditLog.order(timestamp: :desc).try(:paginate, page: page, per_page: per_page) }

        it 'returns the second page of entries sorted by timestamp in descending order' do
          expect(audit_log_result.try(:all)).to eq([@audit_log4, @audit_log3, @audit_log2, @audit_log1, @audit_log0])
        end

        it 'returns count of total records fetched by the query' do
          expect(audit_log_result.count).to eq(15)
        end
      end
    end
  end

  describe 'find_by_user_name' do
    let(:per_page) { 10 }

    context 'with an existing user' do
      let(:audit_log_result) { AuditLog.where(user_name: 'tester_one').try(:paginate, page: 1, per_page: per_page) }

      it 'returns all paginated entries of tester_one user' do
        expect(audit_log_result).to eq([@audit_log2, @audit_log3, @audit_log4])
      end

      it 'returns count of total records fetched by the query' do
        expect(audit_log_result.count).to eq(3)
      end
    end
    context 'without an existing user' do
      let(:audit_log_result) { AuditLog.where(user_name: 'non').try(:paginate, page: 1, per_page: per_page) }

      it 'returns all paginated entries of tester_one user' do
        expect(audit_log_result).to eq([])
      end

      it 'returns count of total records fetched by the query' do
        expect(audit_log_result.count).to eq(0)
      end
    end
  end

end
