# frozen_string_literal: true

require 'rails_helper'

describe Ownable do
  before do
    clean_data(User, Child, PrimeroModule, UserGroup, Agency)

    @primero_module = PrimeroModule.new(name: 'CP')
    @primero_module.save(validate: false)
    permission_case = Permission.new(resource: Permission::CASE, actions: [Permission::READ, Permission::WRITE])
    @role = Role.new(permissions: [permission_case], modules: [@primero_module])
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

  describe 'save' do
    context 'when record is new' do
      before do
        @case = Child.create(data: { 'name' => 'Test', 'owned_by' => 'user1', module_id: @primero_module.unique_id })
      end

      it 'sets owned_by' do
        expect(@case.owned_by).to eq('user1')
      end

      it 'sets owned_by_full_name' do
        expect(@case.owned_by_full_name).to eq('Test User One')
      end

      it 'sets owned_by_location' do
        expect(@case.owned_by_location).to eq('loc012345')
      end

      it 'sets owned_by_agency' do
        expect(@case.owned_by_agency).to eq(@agency1.agency_code)
      end

      it 'does not set previously_owned_by' do
        expect(@case.previously_owned_by).to be_nil
      end

      it 'does not set previously_owned_by_full_name' do
        expect(@case.previously_owned_by_full_name).to be_nil
      end

      it 'does not set previously_owned_by_location' do
        expect(@case.previously_owned_by_location).to be_nil
      end

      it 'does not set previously_owned_by_agency' do
        expect(@case.previously_owned_by_agency).to be_nil
      end
    end

    context 'when record is updated' do
      context 'and owned_by changes' do
        before do
          @case = Child.create(data: { 'name' => 'Test', 'owned_by' => 'user1', module_id: @primero_module.unique_id })
        end

        context 'and new user does not exist' do
          before do
            @case = reloaded_model(@case)
            @case.owned_by = 'non-existent-user'
            @case.save!
          end

          it 'does not change owned_by' do
            expect(@case.owned_by).to eq('user1')
          end

          it 'does not change owned_by_full_name' do
            expect(@case.owned_by_full_name).to eq('Test User One')
          end

          it 'does not change owned_by_location' do
            expect(@case.owned_by_location).to eq('loc012345')
          end

          it 'does not change owned_by_agency' do
            expect(@case.owned_by_agency).to eq(@agency1.agency_code)
          end

          it 'does not set previously_owned_by' do
            expect(@case.previously_owned_by).to be_nil
          end

          it 'does not set previously_owned_by_full_name' do
            expect(@case.previously_owned_by_full_name).to be_nil
          end

          it 'does not set previously_owned_by_location' do
            expect(@case.previously_owned_by_location).to be_nil
          end

          it 'does not set previously_owned_by_agency' do
            expect(@case.previously_owned_by_agency).to be_nil
          end
        end

        context 'and new user does exist' do
          before do
            @case = reloaded_model(@case)
            @case.owned_by = 'user2'
            @case.save!
          end

          it 'changes owned_by' do
            expect(@case.owned_by).to eq('user2')
          end

          it 'changes owned_by_full_name' do
            expect(@case.owned_by_full_name).to eq('Test User Two')
          end

          it 'changes owned_by_location' do
            expect(@case.owned_by_location).to eq('loc8675309')
          end

          it 'changes owned_by_agency' do
            expect(@case.owned_by_agency).to eq(@agency2.agency_code)
          end

          it 'changes previously_owned_by' do
            expect(@case.previously_owned_by).to eq('user1')
          end

          it 'changes previously_owned_by_full_name' do
            expect(@case.previously_owned_by_full_name).to eq('Test User One')
          end

          it 'changes previously_owned_by_location' do
            expect(@case.previously_owned_by_location).to eq('loc012345')
          end

          it 'changes previously_owned_by_agency' do
            expect(@case.previously_owned_by_agency).to eq(@agency1.unique_id)
          end

          it 'changes associated_user_names' do
            expect(@case.associated_user_names).to eq(%w[user2])
          end

          describe 'record history' do
            before do
              @record_histories = @case.record_histories
            end

            it 'is updated' do
              expect(@record_histories.size).to eq(2)
              expect(@record_histories.map(&:action)).to match_array(%w[update create])
              expect(@record_histories.map(&:record_type)).to match_array(%w[Child Child])
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

      context 'and owned_by does not change' do
        before do
          @case = Child.create(data: { 'name' => 'Test', 'owned_by' => 'user1', module_id: @primero_module.unique_id })
          @case = reloaded_model(@case)
          @case.name = 'Another Name'
          @case.save!
        end

        it 'does not change owned_by' do
          expect(@case.owned_by).to eq('user1')
        end

        it 'does not change owned_by_full_name' do
          expect(@case.owned_by_full_name).to eq('Test User One')
        end

        it 'does not change owned_by_location' do
          expect(@case.owned_by_location).to eq('loc012345')
        end

        it 'does not change owned_by_agency' do
          expect(@case.owned_by_agency).to eq(@agency1.agency_code)
        end

        it 'does not set previously_owned_by' do
          expect(@case.previously_owned_by).to be_nil
        end

        it 'does not set previously_owned_by_full_name' do
          expect(@case.previously_owned_by_full_name).to be_nil
        end

        it 'does not set previously_owned_by_location' do
          expect(@case.previously_owned_by_location).to be_nil
        end

        it 'does not set previously_owned_by_agency' do
          expect(@case.previously_owned_by_agency).to be_nil
        end

        it 'changes associated_user_names' do
          expect(@case.associated_user_names).to eq(%w[user1])
        end
      end
    end
  end

  describe 'scopes' do
    before :each do
      clean_data(FormSection, Field, PrimeroProgram)
      create(:user, user_name: 'test_user')
      create(:user, user_name: 'test_user2')
      create(:user, user_name: 'test_user3')
      @case1 = Child.create!(name: 'Case1', owned_by: 'test_user')
      @case2 = Child.create!(name: 'Case2', owned_by: 'test_user2', assigned_user_names: ['test_user'])
      @case3 = Child.create!(name: 'Case3', owned_by: 'test_user2', assigned_user_names: ['test_user3'])
    end

    describe '.owned_by' do
      it 'fetches records owned by this user' do
        cases = Child.owned_by('test_user')
        expect(cases.size).to eq(1)
        expect(cases[0].name).to eq('Case1')
      end
    end

    describe '.associated_with' do
      it 'fetches record associated with this user' do
        cases = Child.associated_with('test_user')
        expect(cases.size).to eq(2)
        expect(cases.map(&:name)).to match_array(%w[Case1 Case2])
      end
    end
  end

  describe '#owner?' do
    before :each do
      @user_a = User.new(user_name: 'userA')
      @user_a.save(validate: false)
      @user_b = User.new(user_name: 'userB')
      @user_b.save(validate: false)
      @case1 = Child.create!(name: 'Case1', owned_by: 'userA')
    end
    it 'return false when user is not the owner' do
      expect(@case1.owner?(@user_a)).to be false
    end
    it 'return true when user is the owner' do
      expect(@case1.owner?(@user_b)).to be false
    end
  end

  after do
    clean_data(User, Child, PrimeroModule, UserGroup, Agency, Role, FormSection, Field, PrimeroProgram)
  end
end
