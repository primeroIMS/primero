# frozen_string_literal: true

require 'rails_helper'

describe BulkFlagService do
  before do
    clean_data(
      User, Role, PrimeroModule, PrimeroProgram, Field, FormSection, UserGroup, Agency, Incident, Child, Flag
    )
  end

  let(:primero_module) do
    create(:primero_module, name: 'CP')
  end

  let(:role) do
    create(:role, is_manager: true, primero_modules: [primero_module], group_permission: Permission::ALL)
  end

  let(:user) do
    create(:user, user_name: 'user', role:, full_name: 'Test User 1', email: 'owner@primero.dev')
  end

  let!(:child) do
    create(:child, name: 'Test', sex: 'female', owned_by: user.user_name, consent_for_services: true,
                   disclosure_other_orgs: true, module_id: PrimeroModule::CP)
  end

  let!(:child2) do
    create(:child, name: 'Test2', sex: 'male', owned_by: user.user_name, consent_for_services: true,
                   disclosure_other_orgs: true, module_id: PrimeroModule::CP)
  end

  let!(:child3) do
    create(:child, name: 'Test3', sex: 'female', owned_by: user.user_name, consent_for_services: true,
                   disclosure_other_orgs: true, module_id: PrimeroModule::CP)
  end

  describe '#flag_records!' do
    context 'when filtering by id' do
      let(:args) do
        { filters: { 'id' => [child.id, child2.id] }, message: 'Test flag', date: Date.today.to_s }
      end

      it 'flags the matching records' do
        BulkFlagService.new(Child, user, args).flag_records!

        expect(child.reload.flag_count).to eq(1)
        expect(child2.reload.flag_count).to eq(1)
        expect(child3.reload.flag_count).to eq(0)
      end

      it 'sets the flagged boolean to true on flagged records' do
        BulkFlagService.new(Child, user, args).flag_records!

        expect(child.reload.flagged).to eq(true)
        expect(child2.reload.flagged).to eq(true)
        expect(child3.reload.flagged).to eq(false)
      end

      it 'sets the correct message and date on each flag' do
        BulkFlagService.new(Child, user, args).flag_records!

        flag = child.reload.flags.first
        expect(flag.message).to eq('Test flag')
        expect(flag.date).to eq(Date.today)
        expect(flag.flagged_by).to eq(user.user_name)
      end

      context 'when a record raises an error' do
        it 'logs the error and does not raise' do
          allow_any_instance_of(Child).to receive(:add_flag!).and_raise(StandardError, 'Simulated failure')
          expect(Rails.logger).to receive(:error).with('Simulated failure').twice

          expect { BulkFlagService.new(Child, user, args).flag_records! }.not_to raise_error
        end
      end
    end

    context 'when filtering by sex' do
      let(:args) do
        { filters: { 'sex' => 'female' }, message: 'Female flag', date: Date.today.to_s }
      end

      it 'flags only records matching the filter' do
        BulkFlagService.new(Child, user, args).flag_records!

        expect(child.reload.flag_count).to eq(1)
        expect(child3.reload.flag_count).to eq(1)
        expect(child2.reload.flag_count).to eq(0)
      end
    end
  end

  describe '#search_records' do
    let(:args) do
      { filters: { 'id' => [child.id] }, message: 'flag', date: Date.today.to_s }
    end

    it 'returns records matching the filters' do
      result = BulkFlagService.new(Child, user, args).search_records

      expect(result.total).to eq(1)
    end
  end

  after :each do
    clean_data(
      User, Role, PrimeroModule, PrimeroProgram, Field, FormSection, UserGroup, Agency, Incident, Child, Flag
    )
  end
end
