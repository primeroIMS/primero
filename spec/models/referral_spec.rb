# frozen_string_literal: true

require 'rails_helper'

describe Referral do
  before :each do
    @module_cp = PrimeroModule.new(name: 'CP')
    @module_cp.save(validate: false)
    @module_gbv = PrimeroModule.new(name: 'GBV')
    @module_gbv.save(validate: false)
    permission_case = Permission.new(
      resource: Permission::CASE,
      actions: [Permission::READ, Permission::WRITE, Permission::CREATE, Permission::RECEIVE_REFERRAL]
    )
    @role = Role.new(permissions: [permission_case], modules: [@module_cp])
    @role.save(validate: false)
    @group1 = UserGroup.create!(name: 'Group1')
    @user1 = User.new(user_name: 'user1', role: @role, user_groups: [@group1])
    @user1.save(validate: false)
    @group2 = UserGroup.create!(name: 'Group2')
    @user2 = User.new(user_name: 'user2', role: @role, user_groups: [@group2])
    @user2.save(validate: false)
    @service1 = { 'unique_id' => 'service_1_123' }
    @service2 = { 'unique_id' => 'service_2_345', 'service_implemented_day_time' => '2021-01-15T16:46:53.701Z' }
    @case = Child.create(data:
      {
        name: 'Test',
        owned_by: 'user1',
        module_id: @module_cp.unique_id,
        consent_for_services: true,
        disclosure_other_orgs: true,
        services_section: [@service1, @service2]
      })
    @case2 = Child.create(data:
      {
        name: 'Test 2',
        owned_by: 'user1',
        module_id: @module_cp.unique_id,
        consent_for_services: true,
        disclosure_other_orgs: true,
        services_section: [@service1, @service2]
      })
  end

  describe 'consent' do
    it 'denies consent for referring records if consent properties are not set' do
      @case.update(consent_for_services: nil, disclosure_other_orgs: nil)
      referral = Referral.new(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)

      expect(referral.consent_given?).to be_falsey
    end

    it 'consents for referring GBV records if referral_for_other_services is set to true' do
      @case.update(module_id: @module_gbv.unique_id)
      referral = Referral.new(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)

      expect(referral.consent_given?).to be_truthy
    end

    it 'consents for referring CP records if referral_for_other_services and disclosure_other_orgs are set to true' do
      referral = Referral.new(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)

      expect(referral.consent_given?).to be_truthy
    end
  end

  describe 'perform' do
    context 'in-system' do
      it 'adds the target user to the assigned users list for this record' do
        referral = Referral.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)
        expect(referral.status).to eq(Referral::STATUS_INPROGRESS)
        expect(@case.assigned_user_names).to include(referral.transitioned_to)
      end

      it 'does not perform the referral if the receiving user is not allowed to receive referrals' do
        permission_case = Permission.new(
          resource: Permission::CASE,
          actions: [Permission::READ, Permission::WRITE, Permission::CREATE]
        )
        @role.permissions = [permission_case]
        @role.save(validate: false)
        referral = Referral.create(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)

        expect(referral.valid?).to be_falsey
        expect(@case.assigned_user_names.present?).to be_falsey
      end
    end
  end

  describe 'revoke' do
    before :each do
      @revoke_referral = Referral.create!(
        transitioned_by: 'user1',
        transitioned_to: 'user2',
        record: @case,
        service_record_id: @service1['unique_id']
      )
    end

    it 'revokes the referral and does not mark any service as implemented' do
      @revoke_referral.revoke!
      service_object = @case.services_section.find { |current| current['unique_id'] == @service1['unique_id'] }

      expect(@revoke_referral.status).to eq(Referral::STATUS_DONE)
      expect(@case.assigned_user_names).not_to include(@revoke_referral.transitioned_to)
      expect(service_object['service_implemented']).to be_nil
    end

    after :each do
      Transition.destroy_all
    end
  end

  describe 'done!' do
    before :each do
      @done_referral = Referral.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)
      @done_referral.status = Transition::STATUS_ACCEPTED
    end

    it 'changes the status to DONE and removes the referred user' do
      @done_referral.done!
      @done_referral.reload

      expect(@done_referral.status).to eq(Transition::STATUS_DONE)
      expect(@case.assigned_user_names).not_to include('user2')
    end

    it 'mark the service object as implemented' do
      json_date_time = '2021-01-20T16:46:53.701Z'
      date_time = DateTime.parse(json_date_time)
      Time.stub(:now).and_return(date_time)

      referral = Referral.create!(
        transitioned_by: 'user1',
        transitioned_to: 'user2',
        record: @case,
        service_record_id: @service1['unique_id']
      )
      referral.status = Transition::STATUS_ACCEPTED
      referral.done!

      @case.reload
      service_object = @case.services_section.find { |current| current['unique_id'] == @service1['unique_id'] }

      expect(service_object['service_implemented_day_time']).to eq(json_date_time)
      expect(service_object['service_implemented']).to eq(Serviceable::SERVICE_IMPLEMENTED)
    end

    it 'does not set the implemented_day_time if already set' do
      referral = Referral.create!(
        transitioned_by: 'user1',
        transitioned_to: 'user2',
        record: @case,
        service_record_id: @service2['unique_id']
      )
      referral.status = Transition::STATUS_ACCEPTED
      referral.done!

      @case.reload
      service_object = @case.services_section.find { |current| current['unique_id'] == @service2['unique_id'] }

      expect(service_object['service_implemented_day_time']).to eq(@service2['service_implemented_day_time'])
      expect(service_object['service_implemented']).to eq(Serviceable::SERVICE_IMPLEMENTED)
    end

    it 'sets the notes from provider in the referral and the service object if specified' do
      referral = Referral.create!(
        transitioned_by: 'user1',
        transitioned_to: 'user2',
        record: @case,
        service_record_id: @service1['unique_id']
      )
      referral.status = Transition::STATUS_ACCEPTED
      rejection_note = 'This is a test'
      referral.done!(rejection_note)

      @case.reload
      service_object = @case.services_section.find { |current| current['unique_id'] == @service1['unique_id'] }

      expect(service_object['note_on_referral_from_provider']).to eq(rejection_note)
      expect(referral.rejection_note).to eq(rejection_note)
    end

    context 'when the user has an in progress referral for another case' do
      before :each do
        Referral.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case2)
      end

      it 'changes the status to DONE and removes the referred user' do
        @done_referral.done!
        @done_referral.reload

        expect(@done_referral.status).to eq(Transition::STATUS_DONE)
        expect(@case.assigned_user_names).not_to include('user2')
      end
    end

    context 'when there is a transfer for the transitioned_to user' do
      before :each do
        permission_case = Permission.new(
          resource: Permission::CASE,
          actions: [
            Permission::READ,
            Permission::WRITE,
            Permission::CREATE,
            Permission::RECEIVE_REFERRAL,
            Permission::RECEIVE_TRANSFER
          ]
        )
        @role.permissions = [permission_case]
        @role.save(validate: false)

        @transfer = Transfer.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)
      end

      it 'does not remove the transitioned_to from assigned_user_names if the transfer is in progress' do
        @transfer.status = Transition::STATUS_INPROGRESS
        @transfer.save!

        @done_referral.done!
        @done_referral.reload

        expect(@done_referral.status).to eq(Transition::STATUS_DONE)
        expect(@case.assigned_user_names).to include('user2')
      end

      it 'does not remove the transitioned_to from assigned_user_names if the transfer is accepted' do
        @transfer.status = Transition::STATUS_ACCEPTED
        @transfer.save!

        @done_referral.done!
        @done_referral.reload

        expect(@done_referral.status).to eq(Transition::STATUS_DONE)
        expect(@case.assigned_user_names).not_to include('user2')
      end

      it 'removes the transitioned_to from assigned_user_names if the transfer is rejected' do
        @transfer.status = Transition::STATUS_REJECTED
        @transfer.save!

        @done_referral.done!
        @done_referral.reload

        expect(@done_referral.status).to eq(Transition::STATUS_DONE)
        expect(@case.assigned_user_names).not_to include('user2')
      end

      it 'removes the transitioned_to from assigned_user_names if the transfer is done' do
        @transfer.status = Transition::STATUS_DONE
        @transfer.save!

        @done_referral.done!
        @done_referral.reload

        expect(@done_referral.status).to eq(Transition::STATUS_DONE)
        expect(@case.assigned_user_names).not_to include('user2')
      end
    end

    context 'when there is another referral for the transitioned_to user' do
      before :each do
        @referral = Referral.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)
      end

      it 'does not remove the transitioned_to from assigned_user_names if the referral is in progress' do
        @referral.status = Transition::STATUS_INPROGRESS
        @referral.save!

        @done_referral.done!
        @done_referral.reload

        expect(@done_referral.status).to eq(Transition::STATUS_DONE)
        expect(@case.assigned_user_names).to include('user2')
      end

      it 'does not remove the transitioned_to from assigned_user_names if the referral is accepted' do
        @referral.status = Transition::STATUS_ACCEPTED
        @referral.save!

        @done_referral.done!
        @done_referral.reload

        expect(@done_referral.status).to eq(Transition::STATUS_DONE)
        expect(@case.assigned_user_names).to include('user2')
      end

      it 'removes the transitioned_to from assigned_user_names if the referral is rejected' do
        @referral.status = Transition::STATUS_REJECTED
        @referral.save!

        @done_referral.done!
        @done_referral.reload

        expect(@done_referral.status).to eq(Transition::STATUS_DONE)
        expect(@case.assigned_user_names).not_to include('user2')
      end

      it 'removes the transitioned_to from assigned_user_names if the referral is done' do
        @referral.status = Transition::STATUS_DONE
        @referral.save!

        @done_referral.done!
        @done_referral.reload

        expect(@done_referral.status).to eq(Transition::STATUS_DONE)
        expect(@case.assigned_user_names).not_to include('user2')
      end
    end

    after :each do
      Transition.destroy_all
    end
  end

  describe 'accept' do
    it 'changes the referral status to ACCEPTED' do
      now = DateTime.parse('2020-10-05T04:05:06')
      DateTime.stub(:now).and_return(now)

      @case.update(consent_for_services: true, disclosure_other_orgs: true)
      referral = Referral.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)
      referral.accept!
      referral.reload

      expect(referral.status).to eq(Transition::STATUS_ACCEPTED)
      expect(referral.responded_at).to eq(now)
      expect(@case.assigned_user_names).to include('user2')
    end
  end

  describe 'reject' do
    before :each do
      @rejected_referral = Referral.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)
      @rejected_reason = 'rejected for some specific reason'
      @now = DateTime.parse('2020-10-05T04:05:06')
      DateTime.stub(:now).and_return(@now)
    end

    it 'changes the referral status to REJECTED and removes the referred user' do
      @rejected_referral.reject!(@rejected_reason)
      @rejected_referral.reload

      expect(@rejected_referral.status).to eq(Transition::STATUS_REJECTED)
      expect(@rejected_referral.rejected_reason).to eq(@rejected_reason)
      expect(@rejected_referral.responded_at).to eq(@now)
      expect(@case.assigned_user_names).not_to include('user2')
    end

    context 'when the user has a referral in progress for another case' do
      before :each do
        Referral.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case2)
      end

      it 'changes the status to REJECTED and removes the referred user' do
        @rejected_referral.reject!
        @rejected_referral.reload

        expect(@rejected_referral.status).to eq(Transition::STATUS_REJECTED)
        expect(@case.assigned_user_names).not_to include('user2')
      end
    end

    context 'when there is a transfer for the transitioned_to user' do
      before :each do
        permission_case = Permission.new(
          resource: Permission::CASE,
          actions: [
            Permission::READ,
            Permission::WRITE,
            Permission::CREATE,
            Permission::RECEIVE_REFERRAL,
            Permission::RECEIVE_TRANSFER
          ]
        )
        @role.permissions = [permission_case]
        @role.save(validate: false)

        @transfer = Transfer.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)
      end

      it 'does not remove the transitioned_to from assigned_user_names if the transfer is in progress' do
        @transfer.status = Transition::STATUS_INPROGRESS
        @transfer.save!

        @rejected_referral.reject!(@rejected_reason)
        @rejected_referral.reload

        expect(@rejected_referral.status).to eq(Transition::STATUS_REJECTED)
        expect(@rejected_referral.rejected_reason).to eq(@rejected_reason)
        expect(@rejected_referral.responded_at).to eq(@now)
        expect(@case.assigned_user_names).to include('user2')
      end

      it 'removes the transitioned_to from assigned_user_names if the transfer is accepted' do
        @transfer.status = Transition::STATUS_ACCEPTED
        @transfer.save!

        @rejected_referral.reject!(@rejected_reason)
        @rejected_referral.reload

        expect(@rejected_referral.status).to eq(Transition::STATUS_REJECTED)
        expect(@rejected_referral.rejected_reason).to eq(@rejected_reason)
        expect(@rejected_referral.responded_at).to eq(@now)
        expect(@case.assigned_user_names).not_to include('user2')
      end

      it 'removes the transitioned_to from assigned_user_names if the transfer is rejected' do
        @transfer.status = Transition::STATUS_REJECTED
        @transfer.save!

        @rejected_referral.reject!(@rejected_reason)
        @rejected_referral.reload

        expect(@rejected_referral.status).to eq(Transition::STATUS_REJECTED)
        expect(@rejected_referral.rejected_reason).to eq(@rejected_reason)
        expect(@rejected_referral.responded_at).to eq(@now)
        expect(@case.assigned_user_names).not_to include('user2')
      end

      it 'removes the transitioned_to from assigned_user_names if the transfer is done' do
        @transfer.status = Transition::STATUS_DONE
        @transfer.save!

        @rejected_referral.reject!(@rejected_reason)
        @rejected_referral.reload

        expect(@rejected_referral.status).to eq(Transition::STATUS_REJECTED)
        expect(@rejected_referral.rejected_reason).to eq(@rejected_reason)
        expect(@rejected_referral.responded_at).to eq(@now)
        expect(@case.assigned_user_names).not_to include('user2')
      end
    end

    context 'when there is another referral for the transitioned_to user' do
      before :each do
        @referral = Referral.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)
      end

      it 'does not remove the transitioned_to from assigned_user_names if the referral is in progress' do
        @referral.status = Transition::STATUS_INPROGRESS
        @referral.save!

        @rejected_referral.reject!(@rejected_reason)
        @rejected_referral.reload

        expect(@rejected_referral.status).to eq(Transition::STATUS_REJECTED)
        expect(@rejected_referral.rejected_reason).to eq(@rejected_reason)
        expect(@rejected_referral.responded_at).to eq(@now)
        expect(@case.assigned_user_names).to include('user2')
      end

      it 'does not remove the transitioned_to from assigned_user_names if the referral is accepted' do
        @referral.status = Transition::STATUS_ACCEPTED
        @referral.save!

        @rejected_referral.reject!(@rejected_reason)
        @rejected_referral.reload

        expect(@rejected_referral.status).to eq(Transition::STATUS_REJECTED)
        expect(@rejected_referral.rejected_reason).to eq(@rejected_reason)
        expect(@rejected_referral.responded_at).to eq(@now)
        expect(@case.assigned_user_names).to include('user2')
      end

      it 'removes the transitioned_to from assigned_user_names if the referral is rejected' do
        @referral.status = Transition::STATUS_REJECTED
        @referral.save!

        @rejected_referral.reject!(@rejected_reason)
        @rejected_referral.reload

        expect(@rejected_referral.status).to eq(Transition::STATUS_REJECTED)
        expect(@rejected_referral.rejected_reason).to eq(@rejected_reason)
        expect(@rejected_referral.responded_at).to eq(@now)
        expect(@case.assigned_user_names).not_to include('user2')
      end

      it 'removes the transitioned_to from assigned_user_names if the referral is done' do
        @referral.status = Transition::STATUS_DONE
        @referral.save!

        @rejected_referral.reject!(@rejected_reason)
        @rejected_referral.reload

        expect(@rejected_referral.status).to eq(Transition::STATUS_REJECTED)
        expect(@rejected_referral.rejected_reason).to eq(@rejected_reason)
        expect(@rejected_referral.responded_at).to eq(@now)
        expect(@case.assigned_user_names).not_to include('user2')
      end
    end

    after :each do
      Transition.destroy_all
    end
  end

  after :each do
    PrimeroModule.destroy_all
    UserGroup.destroy_all
    Role.destroy_all
    User.destroy_all
    Child.destroy_all
    Transition.destroy_all
  end
end
