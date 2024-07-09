# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe RecalculateAge, type: :job do
  include ActiveJob::TestHelper

  before :each do
    clean_data(Child)
    @case1 = Child.create(data: { name: 'case1', date_of_birth: Date.new(2010, 10, 11) })
    @case2 = Child.create(data: { name: 'case2', date_of_birth: Date.new(2008, 10, 11) })
    @case3 = Child.create(data: { name: 'case3', date_of_birth: Date.new(2008, 3, 13) })
    @case4 = Child.create(data: { name: 'case4', date_of_birth: Date.new(1998, 11, 11) })
    @case5 = Child.create(data: { name: 'case5', date_of_birth: Date.new(2014, 10, 12) })
    @case6 = Child.create(data: { name: 'case6', date_of_birth: Date.new(2012, 2, 29) }) # leap year
    @case7 = Child.create(data: { name: 'case7', date_of_birth: Date.new(2012, 2, 14) }) # leap year
    @case8 = Child.create(data: { name: 'case8', date_of_birth: Date.new(2012, 10, 11) }) # leap year
    @case9 = Child.create(data: { name: 'case9', date_of_birth: Date.new(2015, 3, 1) })
    @case10 = Child.create(data: { name: 'case10', date_of_birth: Date.new(2014, 10, 10) })
    @case11 = Child.create(data: { name: 'case11', date_of_birth: Date.new(2010, 2, 28) }) # leap year
    allow(Date).to receive(:current).and_return(today)
  end

  context 'when current date is non-leap year 2015' do
    let(:today) { Date.new(2015, 10, 11) }
    let(:yesterday) { Date.new(2015, 10, 10) }

    describe '.cases_by_date_of_birth_range' do
      it 'should find cases with birthdays today' do
        expect(RecalculateAge.new.cases_by_date_of_birth_range(today, today)).to include(@case1, @case2, @case8)
      end

      it 'should not find cases with birthdays not today' do
        expect(RecalculateAge.new.cases_by_date_of_birth_range(today, today)).not_to include(
          @case3, @case4, @case5, @case6, @case7
        )
      end

      it 'should find cases within a date range' do
        expect(RecalculateAge.new.cases_by_date_of_birth_range(yesterday, today)).to include(
          @case1, @case2, @case8, @case10
        )
      end

      it 'should not find cases that fall outside the given date range' do
        expect(RecalculateAge.new.cases_by_date_of_birth_range(yesterday, today)).not_to include(
          @case3, @case4, @case5, @case6, @case7
        )
      end
    end

    describe '.recalculate!' do
      before do
        RecalculateAge.new.recalculate!(yesterday, today)
      end

      it 'should calculate age with birthday not on leap day' do
        expect(@case1.reload.age).to eq(5)
      end
    end
  end

  context 'when current date is March 1 on non-leap year' do
    let(:today) { Date.new(2015, 3, 1) }
    let(:yesterday) { Date.new(2015, 2, 28) }

    describe '.cases_by_date_of_birth_range' do
      it 'should find cases with birthdays today' do
        expect(RecalculateAge.new.cases_by_date_of_birth_range(today, today)).to include(@case9)
      end

      it 'should not find cases with birthdays not today' do
        expect(RecalculateAge.new.cases_by_date_of_birth_range(today, today)).not_to include(
          @case1, @case2, @case3, @case4, @case5, @case7, @case8, @case10, @case11
        )
      end

      it 'should find cases within a date range, including leap day' do
        expect(RecalculateAge.new.cases_by_date_of_birth_range(yesterday, today)).to include(@case6, @case9, @case11)
      end

      it 'should not find cases that fall outside the given date range' do
        expect(RecalculateAge.new.cases_by_date_of_birth_range(yesterday, today)).not_to include(
          @case1, @case2, @case3, @case4, @case5, @case7, @case8, @case10
        )
      end
    end

    describe '.recalculate!' do
      before do
        RecalculateAge.new.recalculate!(Date.new(2015, 2, 28), Date.new(2015, 3, 1))
      end

      it 'should calculate age with birthday today' do
        expect(@case9.reload.age).to eq(0)
      end

      it 'should calculate age with birthday on leap day' do
        expect(@case6.reload.age).to eq(3)
      end
    end
  end

  context 'when current date is leap year 2016' do
    let(:today) { Date.new(2016, 2, 29) }
    let(:yesterday) { Date.new(2016, 2, 28) }

    describe '.cases_by_date_of_birth_range' do
      it 'should find cases with birthdays today' do
        expect(RecalculateAge.new.cases_by_date_of_birth_range(today, today)).to include(@case6)
      end

      it 'should not find cases with birthdays not today' do
        expect(RecalculateAge.new.cases_by_date_of_birth_range(today, today)).not_to include(
          @case1, @case2, @case3, @case4, @case5, @case7, @case8, @case9
        )
      end

      it 'should find cases within a date range' do
        expect(RecalculateAge.new.cases_by_date_of_birth_range(yesterday, today)).to include(@case6, @case11)
      end

      it 'should not find cases that fall outside the given date range' do
        expect(RecalculateAge.new.cases_by_date_of_birth_range(yesterday, today)).not_to include(
          @case1, @case2, @case3, @case4, @case5, @case7, @case8, @case9, @case10
        )
      end
    end

    describe '.recalculate!' do
      before do
        RecalculateAge.new.recalculate!(yesterday, today)
      end

      it 'should calculate age with birthday on leap day' do
        expect(@case6.reload.age).to eq(4)
      end
    end

    describe '#recalculate!' do
      before do
        RecalculateAge.recalculate!
      end

      it 'should calculate age with birthday' do
        expect(@case6.reload.age).to eq(4)
      end
    end
  end

  context 'when there is more than 20 records' do
    let(:today) { Date.new(2022, 2, 23) }
    describe '.recalculate!' do
      before do
        clean_data(Child)
        25.times do |index|
          Child.create(data: { name: "case#{index}'", date_of_birth: Date.current - index.years })
        end
        @case31 = Child.create(data: { name: "case21'", date_of_birth: Date.current - 5.days })
        @case32 = Child.create(data: { name: "case22'", date_of_birth: Date.current - 5.months })
        Sunspot.commit if Rails.configuration.solr_enabled
      end

      it 'should return total pages and total_count' do
        search = RecalculateAge.new.cases_by_date_of_birth_range(Date.current, Date.current)
        expect(search.count).to eq(25)
      end
      it 'should not find cases with birthdays not today' do
        expect(RecalculateAge.new.cases_by_date_of_birth_range(Date.current, Date.current)).not_to include(
          @case31, @case32
        )
      end
    end
  end

  describe '.perform_job?' do
    let(:today) { Date.new(2015, 10, 11) }
    context 'when there are Records in delayed_job table' do
      before do
        10.times do |time|
          Delayed::Job.create(
            handler: "--- !ruby/object:ActiveJob::QueueAdapters::DelayedJobAdapter::JobWrapper \n
                        job_data:\n    job_class: RecalculateAge",
            run_at: Time.now + time.hour
          )
        end
      end

      it 'should return false wheb' do
        expect(RecalculateAge.perform_job?).to be_falsey
      end

      after do
        clean_data(Delayed::Job)
      end
    end
  end
end
