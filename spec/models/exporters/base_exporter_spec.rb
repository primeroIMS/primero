# frozen_string_literal: true

# Copyright (c) 2014 - 2025 UNICEF. All rights reserved.

require 'rails_helper'

module Exporters
  describe BaseExporter do
    before :each do
      clean_data(Alert, User, Role, Agency, Child, FormSection, PrimeroModule, PrimeroProgram, Referral)

      @agency = Agency.create!(name: 'Test Agency', agency_code: 'test_agency', unique_id: 'agency_test_1')
      role = create(:role)

      @user1 = User.create!(
        user_name: 'user1',
        full_name: 'Test User 1',
        password: 'password123',
        password_confirmation: 'password123',
        email: 'user1@example.com',
        agency_id: @agency.id,
        role_id: role.id
      )

      @user2 = User.create!(
        user_name: 'user2',
        full_name: 'Test User 2',
        password: 'password123',
        password_confirmation: 'password123',
        email: 'user2@example.com',
        agency_id: @agency.id,
        role_id: role.id
      )

      @child1 = Child.create!(data: { name: 'Child 1', age: 10, sex: 'male', consent_for_services: true, disclosure_other_orgs: true })
      @child2 = Child.create!(data: { name: 'Child 2', age: 12, sex: 'female', consent_for_services: true, disclosure_other_orgs: true })
      @child3 = Child.create!(data: { name: 'Child 3', age: 8, sex: 'male', consent_for_services: true, disclosure_other_orgs: true })
    end

    describe '#preload_referrals' do
      it 'preloads referred record ids for the user' do
        Referral.create!(
          record: @child1,
          transitioned_to: @user1.user_name,
          transitioned_by: @user2.user_name,
          status: Transition::STATUS_INPROGRESS,
          consent_overridden: true
        )

        Referral.create!(
          record: @child2,
          transitioned_to: @user1.user_name,
          transitioned_by: @user2.user_name,
          status: Transition::STATUS_ACCEPTED,
          consent_overridden: true
        )

        exporter = BaseExporter.new(nil, { user: @user1, record_type: 'Child' })
        records = [@child1, @child2, @child3]
        exporter.send(:preload_referrals, records)

        expect(exporter.instance_variable_get(:@referred_record_ids)).to be_a(Set)
        expect(exporter.instance_variable_get(:@referred_record_ids)).to include(@child1.id, @child2.id)
        expect(exporter.instance_variable_get(:@referred_record_ids)).not_to include(@child3.id)
      end

      it 'does not preload when user is not present' do
        exporter = BaseExporter.new(nil, { record_type: 'Child' })
        records = [@child1, @child2]
        exporter.send(:preload_referrals, records)

        expect(exporter.instance_variable_get(:@referred_record_ids)).to be_nil
      end

      it 'does not preload when records array is empty' do
        exporter = BaseExporter.new(nil, { user: @user1, record_type: 'Child' })
        exporter.send(:preload_referrals, [])

        expect(exporter.instance_variable_get(:@referred_record_ids)).to be_nil
      end
    end

    describe '#referred_to_record?' do
      context 'when @referred_record_ids cache exists' do
        it 'uses the cache to determine if record is referred' do
          exporter = BaseExporter.new(nil, { user: @user1, record_type: 'Child' })
          exporter.instance_variable_set(:@referred_record_ids, Set.new([@child1.id, @child2.id]))

          expect(exporter.referred_to_record?(@child1)).to be true
          expect(exporter.referred_to_record?(@child2)).to be true
          expect(exporter.referred_to_record?(@child3)).to be false
        end

        it 'does not query the database when cache exists' do
          exporter = BaseExporter.new(nil, { user: @user1, record_type: 'Child' })
          exporter.instance_variable_set(:@referred_record_ids, Set.new([@child1.id]))

          expect(@user1).not_to receive(:referred_to_record?)
          expect(exporter.referred_to_record?(@child1)).to be true
        end
      end

      context 'when @referred_record_ids cache does not exist' do
        it 'falls back to user.referred_to_record?' do
          Referral.create!(
            record: @child1,
            transitioned_to: @user1.user_name,
            transitioned_by: @user2.user_name,
            status: Transition::STATUS_INPROGRESS,
            consent_overridden: true
          )

          exporter = BaseExporter.new(nil, { user: @user1, record_type: 'Child' })

          expect(exporter.referred_to_record?(@child1)).to be true
          expect(exporter.referred_to_record?(@child2)).to be false
        end

        it 'returns false when user is nil' do
          exporter = BaseExporter.new(nil, { record_type: 'Child' })

          expect(exporter.referred_to_record?(@child1)).to be_falsey
        end
      end
    end


    after :each do
      clean_data(Alert, User, Role, Agency, Child, FormSection, PrimeroModule, PrimeroProgram, Referral)
    end
  end
end
