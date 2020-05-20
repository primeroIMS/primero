# frozen_string_literal: true

require 'rails_helper'

describe Alertable do
  context 'when a transfer_request alert exists' do
    before do
      clean_data(
        SystemSettings, Role, Agency, User, Child, Alert, UserGroup,
        PrimeroProgram, PrimeroModule, Referral, FormSection
      )
      program = PrimeroProgram.create!(
        unique_id: 'primeroprogram-primero',
        name: 'Primero',
        description: 'Default Primero Program'
      )
      form_section = FormSection.create!(
        unique_id: 'test_form',
        name: 'Test Form',
        fields: [
          Field.new(name: 'national_id_no', type: 'text_field', display_name: 'National ID No'),
        ]
      )
      cp = PrimeroModule.create!(
        unique_id: PrimeroModule::CP,
        name: 'CP',
        description: 'Child Protection',
        associated_record_types: %w[case tracing_request incident],
        primero_program: program,
        form_sections: [form_section]
      )
      role = Role.create!(
        name: 'Test Role 1',
        unique_id: 'test-role-1',
        group_permission: Permission::AGENCY,
        permissions: [
          Permission.new(
            resource: Permission::CASE,
            actions: [Permission::MANAGE, Permission::REFERRAL, Permission::RECEIVE_REFERRAL]
          )
        ],
        modules: [cp]
      )
      role_group = Role.create!(
        name: 'Test Role 2',
        unique_id: 'test-role-2',
        group_permission: Permission::GROUP,
        permissions: [
          Permission.new(
            resource: Permission::CASE,
            actions: [Permission::MANAGE, Permission::REFERRAL, Permission::RECEIVE_REFERRAL]
          )
        ],
        modules: [cp]
      )
      role_self = Role.create!(
        name: 'Test Role 3',
        unique_id: 'test-role-3',
        group_permission: Permission::SELF,
        permissions: [
          Permission.new(
            resource: Permission::CASE,
            actions: [Permission::MANAGE, Permission::REFERRAL, Permission::RECEIVE_REFERRAL]
          )
        ],
        modules: [cp]
      )
      agency_a = Agency.create!(name: 'Agency 1', agency_code: 'agency1')
      agency_b = Agency.create!(name: 'Agency 2', agency_code: 'agency2')
      @group_a = UserGroup.create!(name: 'Group1')
      @group_b = UserGroup.create!(name: 'Group2')
      @group_c = UserGroup.create!(name: 'Group3')
      @user_a = User.create!(
        full_name: 'Test User 1',
        user_name: 'test_user_1',
        password: 'a12345678',
        password_confirmation: 'a12345678',
        email: 'test_user_1@localhost.com',
        agency_id: agency_a.id,
        role: role_self,
        user_groups: [@group_b, @group_c]
      )
      @user_b = User.create!(
        full_name: 'Test User 2',
        user_name: 'test_user_2',
        password: 'a12345632',
        password_confirmation: 'a12345632',
        email: 'test_user_2@localhost.com',
        agency_id: agency_a.id,
        user_groups: [@group_a, @group_b],
        role: role
      )
      @user_c = User.create!(
        full_name: 'Test User 3',
        user_name: 'test_user_3',
        password: 'a12345623',
        password_confirmation: 'a12345623',
        email: 'test_user_3@localhost.com',
        agency_id: agency_b.id,
        role: role_group,
        user_groups: [@group_a]
      )
      @user_d = User.create!(
        full_name: 'Test User 4',
        user_name: 'test_user_4',
        password: 'b12345623',
        password_confirmation: 'b12345623',
        email: 'test_user_4@localhost.com',
        agency_id: agency_a.id,
        role: role_self,
        user_groups: [@group_a, @group_b, @group_c]
      )
      @test_class = Child.create(
        name: 'bar',
        data: { owned_by: @user_a.user_name, module_id: 'primeromodule-cp' },
        alerts: [Alert.create(type: 'transfer_request', alert_for: 'transfer_request', user_id: @user_a.id)]
      )
      @test_class_b = Child.create(
        name: 'foo',
        data: { owned_by: @user_b.user_name, module_id: 'primeromodule-cp' },
        alerts: [Alert.create(type: 'transfer_request', alert_for: 'transfer_request', user_id: @user_b.id)]
      )
      @test_class_c = Child.create(
        name: 'foo',
        data: { owned_by: @user_b.user_name, record_state: false },
        alerts: [Alert.create(type: 'transfer_request', alert_for: 'transfer_request', user_id: @user_b.id)]
      )
      @test_class_d = Child.create(
        name: 'foo',
        data: { owned_by: @user_b.user_name, status: Record::STATUS_CLOSED },
        alerts: [Alert.create(type: 'transfer_request', alert_for: 'transfer_request', user_id: @user_b.id)]
      )
    end

    context 'and current user is not the record owner' do
      before do
        Child.any_instance.stub(:last_updated_by).and_return('not_the_owner')
      end

      context 'and the record is edited' do
        before do
          @test_class.name = 'blah'
          @test_class.save
        end

        it 'does not remove the alert' do
          expect(@test_class.alerts).to be_present
          expect(@test_class.alerts.first.type).to eq('transfer_request')
        end

        it 'count alerts by record' do
          expect(@test_class.alert_count).to eq(1)
        end

        it 'count alerts by user' do
          expect(Child.alert_count(@user_a)).to eq(1)
          expect(Child.alert_count(@user_b)).to eq(2)
          expect(Child.alert_count(@user_c)).to eq(1)
          expect(Child.alert_count(@user_d)).to eq(0)
        end

        it 'show only the open enabled recod for the open_enabled_records method' do
          expect(Child.all.count).to eq(4)
          expect(Child.open_enabled_records.count).to eq(2)
        end
      end
    end

    context 'and current user is the record owner' do
      before do
        Child.any_instance.stub(:last_updated_by).and_return('the_owner')
        Child.any_instance.stub(:owned_by).and_return('the_owner')
      end

      context 'and the record is edited' do
        before do
          @test_class.name = 'asdfadfadfa'
          @test_class.save
        end

        it 'removes the alert' do
          expect(@test_class.alerts).not_to be_present
        end

        it 'count alerts by record' do
          expect(@test_class.alert_count).to eq(0)
        end

        it 'count alerts by user' do
          expect(Child.alert_count(@user_a)).to eq(0)
        end
      end
    end

    context 'Count alert from referrals cases' do
      before do
        Referral.create!(
          transitioned_by: 'test_user_2', transitioned_to: 'test_user_4', record: @test_class,
          type: Referral.name, consent_overridden: true
        )
        child_referral = Child.create(
          name: 'bar',
          data: { owned_by: @user_c.user_name, module_id: 'primeromodule-cp' },
          alerts: [Alert.create(type: 'transfer_request', alert_for: 'transfer_request', user_id: @user_c.id)]
        )
        Referral.create!(
          transitioned_by: 'test_user_3', transitioned_to: 'test_user_1', record: child_referral,
          type: Referral.name, consent_overridden: true
        )
      end

      it 'count alert from self permissions users' do
        expect(Child.alert_count(@user_d)).to eq(1)
      end

      it 'count alert from user group' do
        expect(Child.alert_count(@user_c)).to eq(3)
      end

      it 'count alert from user agency' do
        expect(Child.alert_count(@user_b)).to eq(3)
      end
    end
  end

  describe 'alert on record update' do
    before :each do
      SystemSettings.create!(
        changes_field_to_form: { notes_section: 'notes' }
      )
      SystemSettings.stub(:current).and_return(SystemSettings.first)

      @case1 = Child.create(
        name: 'test case',
        data: { owned_by: 'foo', notes_section: [] }
      )
    end

    it 'creates an alert when a non-record-owner updates the notes field' do
      @case1.update_properties(
        { notes_section: [{ note_subject: 'test', note_text: 'this' }] }, 'bar'
      )
      @case1.save!

      expect(@case1.alerts.count).to eq(1)

      alert = @case1.alerts[0]
      expect(alert.alert_for).to eq(Alertable::FIELD_CHANGE)
      expect(alert.type).to eq('notes')
      expect(alert.form_sidebar_id).to eq('notes')
    end
  end

  after :each do
    clean_data(
      SystemSettings, Role, Agency, User, Child, Alert, UserGroup,
      PrimeroProgram, PrimeroModule, Referral, FormSection
    )
  end
end
