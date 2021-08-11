# frozen_string_literal: true

require 'rails_helper'

describe Transfer do
  before do
    clean_data(User, Role, PrimeroModule, UserGroup, Agency, Transition, Child, Incident)

    @module_cp = PrimeroModule.new(name: 'CP')
    @module_cp.save(validate: false)
    @module_gbv = PrimeroModule.new(name: 'GBV')
    @module_gbv.save(validate: false)
    permission_case = Permission.new(
      resource: Permission::CASE,
      actions: [Permission::READ, Permission::WRITE, Permission::CREATE, Permission::RECEIVE_TRANSFER]
    )
    @role = Role.new(permissions: [permission_case], modules: [@module_cp])
    @role.save(validate: false)
    @group1 = UserGroup.create!(name: 'Group1')
    @agency1 = Agency.create!(name: 'Agency One', agency_code: 'agency1')
    @user1 = User.new(user_name: 'user1', full_name: 'Test User One', location: 'loc012345', role: @role,
                      user_groups: [@group1], agency_id: @agency1.id)
    @user1.save(validate: false)
    @group2 = UserGroup.create!(name: 'Group2')
    @agency2 = Agency.create!(name: 'Agency Two', agency_code: 'agency2')
    @user2 = User.new(user_name: 'user2', full_name: 'Test User Two', location: 'loc8675309', role: @role,
                      user_groups: [@group2], agency_id: @agency2.id)
    @user2.save(validate: false)
  end

  let(:case1) { @case.reload }

  describe 'consent' do
    context 'when consent properties are not set' do
      before do
        @case = Child.create(data: { name: 'Test', owned_by: 'user1', module_id: @module_cp.unique_id,
                                     disclosure_other_orgs: nil })
      end

      it 'denies consent for transferring records' do
        transfer = Transfer.new(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)

        expect(transfer.consent_given?).to be_falsey
      end
    end

    context 'when GBV' do
      context 'and referral_for_other_services is set to true' do
        before do
          @case = Child.create(data: { name: 'Test', owned_by: 'user1', module_id: @module_gbv.unique_id,
                                       disclosure_other_orgs: true, consent_for_services: true })
        end

        it 'consents for transferring' do
          transfer = Transfer.new(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)

          expect(transfer.consent_given?).to be_truthy
        end
      end
    end

    context 'when CP' do
      context 'and referral_for_other_services and disclosure_other_orgs are set to true' do
        before do
          @case = Child.create(data: { name: 'Test', owned_by: 'user1', module_id: @module_cp.unique_id,
                                       disclosure_other_orgs: true, consent_for_services: true })
        end

        it 'consents for referring' do
          transfer = Transfer.new(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)

          expect(transfer.consent_given?).to be_truthy
        end
      end
    end
  end

  describe 'perform' do
    context 'when receiving user has permission to receive transfers' do
      before do
        @case = Child.create(data: { name: 'Test', owned_by: 'user1', module_id: @module_cp.unique_id,
                                     disclosure_other_orgs: true })
        @transfer = Transfer.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)
      end

      it 'allows the targeted user to have access to this record' do
        expect(@transfer.status).to eq(Transition::STATUS_INPROGRESS)
        expect(case1.assigned_user_names).to include(@transfer.transitioned_to)
      end

      it 'does not change ownership of the record' do
        expect(case1.owned_by).to eq('user1')
        expect(case1.owned_by_full_name).to eq('Test User One')
        expect(case1.owned_by_location).to eq('loc012345')
        expect(case1.owned_by_agency).to eq(@agency1.agency_code)
      end
    end

    context 'when receiving user does not have permission to receive transfers' do
      before do
        permission_case = Permission.new(resource: Permission::CASE,
                                         actions: [Permission::READ, Permission::WRITE, Permission::CREATE])
        @role.permissions = [permission_case]
        @role.save(validate: false)
        @case = Child.create(data: { name: 'Test', owned_by: 'user1', module_id: @module_cp.unique_id,
                                     disclosure_other_orgs: true })
      end

      it 'does not perform the transfer' do
        transfer = Transfer.create(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)

        expect(transfer.valid?).to be_falsey
        expect(case1.assigned_user_names.present?).to be_falsey
      end
    end
  end

  describe 'accept' do
    before do
      @now = DateTime.parse('2020-10-05T04:05:06')
      DateTime.stub(:now).and_return(@now)
      @case = Child.create(data: { name: 'Test', owned_by: 'user1', module_id: @module_cp.unique_id,
                                   disclosure_other_orgs: true })
      @transfer = Transfer.create(transitioned_by: 'user1', transitioned_to: 'user2', record: @case.reload)
      @transfer.reload.accept!
    end

    it 'sets status to Accepted' do
      expect(@transfer.status).to eq(Transition::STATUS_ACCEPTED)
      expect(@transfer.responded_at).to eq(@now)
      expect(case1.transfer_status).to eq(Transition::STATUS_ACCEPTED)
      expect(case1.status).to eq(Record::STATUS_OPEN)
    end

    describe 'change ownership' do
      it 'changes owned_by' do
        expect(case1.owned_by).to eq('user2')
        expect(case1.previously_owned_by).to eq('user1')
      end

      it 'changes owned_by_full_name' do
        expect(case1.owned_by_full_name).to eq('Test User Two')
        expect(case1.previously_owned_by_full_name).to eq('Test User One')
      end

      it 'changes owned_by_location' do
        expect(case1.owned_by_location).to eq('loc8675309')
        expect(case1.previously_owned_by_location).to eq('loc012345')
      end

      it 'changes owned_by_agency' do
        expect(case1.owned_by_agency).to eq(@agency2.unique_id)
        expect(case1.previously_owned_by_agency).to eq(@agency1.unique_id)
      end

      describe 'record history' do
        before do
          @record_histories = case1.record_histories
        end

        it 'is updated' do
          expect(@record_histories.size).to eq(3)
          expect(@record_histories.map(&:action)).to match_array(%w[update update create])
          expect(@record_histories.map(&:record_type)).to match_array(%w[Child Child Child])
        end

        describe 'owned_by' do
          before do
            @update_action = @record_histories.select { |h| h.action == 'update' && h.record_changes['owned_by'] }.first
          end

          it 'is updated' do
            expect(@update_action.record_changes['owned_by']).to be
            expect(@update_action.record_changes['owned_by']['to']).to eq('user2')
            expect(@update_action.record_changes['owned_by']['from']).to eq('user1')
          end
        end
      end

      context 'when the case has incidents' do
        before do
          case_with_incidents = Child.new(data: { name: 'Test', owned_by: 'user1', module_id: @module_cp.unique_id,
                                                  disclosure_other_orgs: true })
          incident1 = IncidentCreationService.incident_from_case(case_with_incidents, {}, nil)
          incident2 = IncidentCreationService.incident_from_case(case_with_incidents, {}, nil)
          case_with_incidents.incidents << incident1
          case_with_incidents.incidents << incident2
          case_with_incidents.save!
          @transfer = Transfer.create(
            transitioned_by: 'user1', transitioned_to: 'user2', record: case_with_incidents.reload
          )
          @transfer.reload.accept!
          @incident1 = case_with_incidents.incidents.first
          @incident2 = case_with_incidents.incidents.last
        end

        describe 'on the incidents' do
          it 'changes owned_by' do
            expect(@incident1.owned_by).to eq('user2')
            expect(@incident1.previously_owned_by).to eq('user1')
            expect(@incident2.owned_by).to eq('user2')
            expect(@incident2.previously_owned_by).to eq('user1')
          end

          it 'changes owned_by_full_name' do
            expect(@incident1.owned_by_full_name).to eq('Test User Two')
            expect(@incident1.previously_owned_by_full_name).to eq('Test User One')
            expect(@incident2.owned_by_full_name).to eq('Test User Two')
            expect(@incident2.previously_owned_by_full_name).to eq('Test User One')
          end

          it 'changes owned_by_location' do
            expect(@incident1.owned_by_location).to eq('loc8675309')
            expect(@incident1.previously_owned_by_location).to eq('loc012345')
            expect(@incident2.owned_by_location).to eq('loc8675309')
            expect(@incident2.previously_owned_by_location).to eq('loc012345')
          end

          it 'changes owned_by_agency' do
            expect(@incident1.owned_by_agency).to eq(@agency2.unique_id)
            expect(@incident1.previously_owned_by_agency).to eq(@agency1.unique_id)
            expect(@incident2.owned_by_agency).to eq(@agency2.unique_id)
            expect(@incident2.previously_owned_by_agency).to eq(@agency1.unique_id)
          end

          describe 'record history' do
            before do
              @record_histories = @incident1.record_histories
            end

            it 'is updated' do
              expect(@record_histories.size).to eq(2)
              expect(@record_histories.map(&:action)).to match_array(%w[update create])
              expect(@record_histories.map(&:record_type)).to match_array(%w[Incident Incident])
            end

            describe 'owned_by' do
              before do
                @update_action = @record_histories.select { |h| h.action == 'update' }.first
              end

              it 'is updated' do
                expect(@update_action.record_changes['owned_by']).to be
                expect(@update_action.record_changes['owned_by']['to']).to eq('user2')
                expect(@update_action.record_changes['owned_by']['from']).to eq('user1')
              end
            end
          end
        end
      end
    end
  end

  describe 'reject' do
    before do
      @now = DateTime.parse('2020-10-05T04:05:06')
      DateTime.stub(:now).and_return(@now)
      @case = Child.create(data: { name: 'Test', owned_by: 'user1', module_id: @module_cp.unique_id,
                                   disclosure_other_orgs: true })
      @case2 = Child.create(data: { name: 'Test 2', owned_by: 'user1', module_id: @module_cp.unique_id,
                                    disclosure_other_orgs: true })
      @rejected_transfer = Transfer.create(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)
    end

    it 'revokes access to this record for the target user' do
      @rejected_transfer.reject!

      expect(@rejected_transfer.status).to eq(Transition::STATUS_REJECTED)
      expect(@rejected_transfer.responded_at).to eq(@now)
      expect(@case.assigned_user_names.present?).to be_falsey
      expect(@case.transfer_status).to eq(Transition::STATUS_REJECTED)
      expect(@case.status).to eq(Record::STATUS_OPEN)
    end

    it 'does not change ownership of the record' do
      @rejected_transfer.reject!

      expect(@case.owned_by).to eq('user1')
      expect(@case.owned_by_full_name).to eq('Test User One')
      expect(@case.owned_by_location).to eq('loc012345')
      expect(@case.owned_by_agency).to eq(@agency1.agency_code)
    end

    context 'when the user has an in progress transfer for another case' do
      before :each do
        Transfer.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case2)
      end

      it 'changes the status to REJECTED and removes the referred user' do
        @rejected_transfer.reject!
        @rejected_transfer.reload

        expect(@rejected_transfer.status).to eq(Transition::STATUS_REJECTED)
        expect(@case.assigned_user_names).not_to include('user2')
      end
    end

    context 'when there is a referral for the transitioned_to user' do
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

        @case.update(consent_for_services: true, disclosure_other_orgs: true)

        @referral = Referral.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)
      end

      it 'does not remove the transitioned_to from assigned_user_names if the referral is in progress' do
        @referral.status = Transition::STATUS_INPROGRESS
        @referral.save!

        @rejected_transfer.reject!
        @rejected_transfer.reload

        expect(@rejected_transfer.status).to eq(Transition::STATUS_REJECTED)
        expect(@rejected_transfer.responded_at).to eq(@now)
        expect(@case.assigned_user_names).to include('user2')
      end

      it 'does not remove the transitioned_to from assigned_user_names if the referral is accepted' do
        @referral.status = Transition::STATUS_ACCEPTED
        @referral.save!

        @rejected_transfer.reject!
        @rejected_transfer.reload

        expect(@rejected_transfer.status).to eq(Transition::STATUS_REJECTED)
        expect(@rejected_transfer.responded_at).to eq(@now)
        expect(@case.assigned_user_names).to include('user2')
      end

      it 'removes the transitioned_to from assigned_user_names if the referral is rejected' do
        @referral.status = Transition::STATUS_REJECTED
        @referral.save!

        @rejected_transfer.reject!
        @rejected_transfer.reload

        expect(@rejected_transfer.status).to eq(Transition::STATUS_REJECTED)
        expect(@rejected_transfer.responded_at).to eq(@now)
        expect(@case.assigned_user_names).not_to include('user2')
      end

      it 'removes the transitioned_to from assigned_user_names if the referral is done' do
        @referral.status = Transition::STATUS_DONE
        @referral.save!

        @rejected_transfer.reject!
        @rejected_transfer.reload

        expect(@rejected_transfer.status).to eq(Transition::STATUS_REJECTED)
        expect(@rejected_transfer.responded_at).to eq(@now)
        expect(@case.assigned_user_names).not_to include('user2')
      end
    end

    context 'when there is another transfer for the transitioned_to user' do
      before :each do
        @transfer = Transfer.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)
      end

      it 'does not remove the transitioned_to from assigned_user_names if the transfer is in progress' do
        @transfer.status = Transition::STATUS_INPROGRESS
        @transfer.save!

        @rejected_transfer.reject!
        @rejected_transfer.reload

        expect(@rejected_transfer.status).to eq(Transition::STATUS_REJECTED)
        expect(@rejected_transfer.responded_at).to eq(@now)
        expect(@case.assigned_user_names).to include('user2')
      end

      it 'removes the transitioned_to from assigned_user_names if the transfer is accepted' do
        @transfer.status = Transition::STATUS_ACCEPTED
        @transfer.save!

        @rejected_transfer.reject!
        @rejected_transfer.reload

        expect(@rejected_transfer.status).to eq(Transition::STATUS_REJECTED)
        expect(@rejected_transfer.responded_at).to eq(@now)
        expect(@case.assigned_user_names).not_to include('user2')
      end

      it 'removes the transitioned_to from assigned_user_names if the transfer is rejected' do
        @transfer.status = Transition::STATUS_REJECTED
        @transfer.save!

        @rejected_transfer.reject!
        @rejected_transfer.reload

        expect(@rejected_transfer.status).to eq(Transition::STATUS_REJECTED)
        expect(@rejected_transfer.responded_at).to eq(@now)
        expect(@case.assigned_user_names).not_to include('user2')
      end

      it 'removes the transitioned_to from assigned_user_names if the transfer is done' do
        @transfer.status = Transition::STATUS_DONE
        @transfer.save!

        @rejected_transfer.reject!
        @rejected_transfer.reload

        expect(@rejected_transfer.status).to eq(Transition::STATUS_REJECTED)
        expect(@rejected_transfer.responded_at).to eq(@now)
        expect(@case.assigned_user_names).not_to include('user2')
      end
    end
  end

  after :each do
    clean_data(PrimeroModule, UserGroup, Role, User, Child, Incident, Transition, Agency)
  end
end
