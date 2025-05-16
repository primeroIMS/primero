# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

require 'rails_helper'

describe RecordActionMailer, type: :mailer do
  before do
    clean_data(SystemSettings)
    SystemSettings.create(
      default_locale: 'en',
      unhcr_needs_codes_mapping: {},
      changes_field_to_form: {
        'email_alertable_field' => {
          form_section_unique_id: 'some_formsection_name',
          alert_strategy: Alertable::AlertStrategy::ASSOCIATED_USERS
        }
      },
      approvals_labels_i18n: {
        'en' => {
          'closure' => 'Closure',
          'case_plan' => 'Case Plan',
          'assessment' => 'Assessment',
          'action_plan' => 'Action Plan',
          'gbv_closure' => 'Case Closure'
        }
      }
    )
  end

  let(:notification_settings) do
    {
      notifications: {
        send_mail: {
          Transition::NOTIFICATION_ACTION => true, Approval::NOTIFICATION_ACTIONS_REQUEST => true,
          Approval::NOTIFICATION_ACTIONS_RESPONSE => true, Transfer::NOTIFICATION_ACTION => true
        }
      }
    }
  end

  describe 'approvals' do
    before do
      clean_data(Alert, User, Role, PrimeroModule, PrimeroProgram, Field, FormSection, Lookup, UserGroup, Agency,
                 Referral)

      @lookup = Lookup.create!(id: 'lookup-approval-type', unique_id: 'lookup-approval-type', name: 'approval type',
                               lookup_values_en: [{ 'id' => 'value1', 'display_text' => 'value1' }])
      role = create(:role, is_manager: true)
      @manager1 = create(:user, role:, email: 'manager1@primero.dev', send_mail: false, user_name: 'manager1',
                                full_name: 'manager1')
      @manager2 = create(:user, role:, email: 'manager2@primero.dev', send_mail: true, user_name: 'manager2',
                                settings: notification_settings, full_name: 'manager2')
      @manager3 = create(
        :user, role:, email: 'manager3@primero.dev', send_mail: true, user_name: 'manager3', locale: 'ar-LB',
               settings: notification_settings, full_name: 'manager3'
      )
      @manager4 = create(
        :user, role:, email: 'manager4@primero.dev', send_mail: true, user_name: 'manager4', disabled: true,
               full_name: 'manager1'
      )
      @owner = create(:user, user_name: 'jnelson', full_name: 'Jordy Nelson', email: 'owner@primero.dev',
                             settings: notification_settings)
      @disabled_user = create(
        :user, user_name: 'duser', full_name: 'Disabled User', email: 'duser@primero.dev', disabled: true
      )
      @arabic_owner = create(:user, user_name: 'jdoe', full_name: 'Jhon Doe', email: 'arabic_owner@primero.dev',
                                    locale: 'ar-LB', settings: notification_settings)
      @child = child_with_created_by(@owner.user_name, name: 'child1', module_id: PrimeroModule::CP,
                                                       case_id_display: '12345')
      @arabic_child = child_with_created_by(
        @arabic_owner.user_name,
        name: 'arabic_child1',
        module_id: PrimeroModule::CP,
        ase_id_display: '67890'
      )
      @referral = Referral.new(transitioned_by: 'manager1', transitioned_to: 'duser', record: @child)
      @referral.save(validate: false)
    end

    describe '.manager_approval_request' do
      let(:approval_notification) do
        ApprovalRequestNotificationService.new(@child.id, 'case_plan', @manager2.user_name)
      end

      let(:mail) do
        RecordActionMailer.manager_approval_request(approval_notification)
      end

      it 'renders the headers' do
        expect(mail.subject).to eq("Case: #{@child.short_id} - Approval Request")
        expect(mail.to).to eq(['manager2@primero.dev'])
      end

      it 'renders the body' do
        expect(mail.body.encoded)
          .to match("jnelson is requesting a Case Plan approval on case .*#{@child.short_id}")
      end
    end

    describe 'manager_approval_request with diferent locale' do
      let(:approval_notification) do
        ApprovalRequestNotificationService.new(@child.id, 'closure', @manager3.user_name)
      end

      let(:mail) do
        RecordActionMailer.manager_approval_request(approval_notification)
      end

      it 'renders the headers in arabic locale' do
        expect(mail.subject).to eq("الملفّ: #{@child.short_id} - طلب الموافقة")
        expect(mail.to).to eq(['manager3@primero.dev'])
      end
      # TODO: Skipping this test till translated in Transifex
      xit 'renders the body in arabic locale' do
        expect(mail.text_part.body.encoded)
          .to match("يطلب المستخدم jnelson الموافقة Closure للملفّ .*#{@child.short_id}")
      end
    end

    describe 'manager_approval_response' do
      let(:approval_notification) do
        ApprovalResponseNotificationService.new(@child.id, 'case_plan', @manager1.user_name, false)
      end

      let(:mail) do
        RecordActionMailer.manager_approval_response(approval_notification)
      end

      it 'renders the headers' do
        expect(mail.subject).to eq("Case: #{@child.short_id} - Approval Response")
        expect(mail.to).to eq(['owner@primero.dev'])
      end

      it 'renders the body' do
        expect(mail.body.encoded)
          .to match("manager1 has updated the status of your case plan approval request on Case.*#{@child.short_id}")
      end
    end

    describe 'manager_approval_response with diferent locale' do
      let(:approval_notification) do
        ApprovalResponseNotificationService.new(@arabic_child.id, 'case_plan', @manager1.user_name, false)
      end

      let(:mail) do
        RecordActionMailer.manager_approval_response(approval_notification)
      end

      it 'renders the headers in arabic locale' do
        expect(mail.subject).to eq("الملفّ: #{@arabic_child.short_id} - إستجابة حول الموافقة")
        expect(mail.to).to eq(['arabic_owner@primero.dev'])
      end

      # TODO: Skipping this test till translated in Transifex
      xit 'renders the body in arabic locale' do
        expect(mail.text_part.body.encoded)
          .to match("طلب manager1 تم رفضه الموافقة case plan للملفّ .*#{@arabic_child.short_id}")
      end
    end

    describe 'when a  manager is disabled' do
      let(:mail) do
        RecordActionMailer.manager_approval_request(@child.id, 'value1', @manager4.user_name)
      end

      it 'does not render the headers' do
        expect(mail.subject).to be_nil
        expect(mail.to).to be_nil
      end

      it 'does not render the body' do
        expect(mail.body).to be_empty
      end
    end

    describe '.transition_notify' do
      describe 'when a  user is disabled' do
        let(:mail) do
          RecordActionMailer.transition_notify(TransitionNotificationService.new(@referral.id))
        end

        it 'does not render the headers' do
          expect(mail.subject).to be_nil
          expect(mail.to).to be_nil
        end

        it 'does not render the body' do
          expect(mail.body).to be_empty
        end
      end

      context 'when user permit is enabled' do
        let(:role) do
          create(:role, is_manager: true)
        end

        let(:user2) do
          create(:user, user_name: 'user2', full_name: 'User random', email: 'user2@primero.dev', send_mail: true,
                        settings: notification_settings)
        end
        let(:assign1) do
          Assign.create!(transitioned_by: 'jnelson', transitioned_to_user: user2, record: @child)
        end

        let(:mail) do
          RecordActionMailer.transition_notify(TransitionNotificationService.new(assign1.id))
        end

        it 'renders the headers' do
          expect(mail.subject).to eq("Case: #{@child.short_id} - Assigned to you")
          expect(mail.to).to eq(['user2@primero.dev'])
        end
      end
    end
  end

  describe 'Transitions' do
    before :each do
      clean_data(
        Alert, User, Role, PrimeroModule, PrimeroProgram, Field, FormSection, Lookup, UserGroup, Agency, Incident, Child
      )
      @primero_module = PrimeroModule.new(name: 'CP')
      @primero_module.save(validate: false)
      @permission_assign_case = Permission.new(
        resource: Permission::CASE,
        actions: [
          Permission::READ, Permission::WRITE,
          Permission::CREATE, Permission::ASSIGN,
          Permission::TRANSFER, Permission::RECEIVE_TRANSFER,
          Permission::REFERRAL, Permission::RECEIVE_REFERRAL
        ]
      )
      @role = Role.new(permissions: [@permission_assign_case], modules: [@primero_module])
      @role.save(validate: false)
      agency = Agency.create!(name: 'Test Agency', agency_code: 'TA')
      @group1 = UserGroup.create!(name: 'Group1')
      @user1 = User.new(
        user_name: 'user1', role: @role, user_groups: [@group1],
        email: 'uzer1@test.com', send_mail: true,
        agency:,
        settings: notification_settings,
        full_name: 'user1'
      )
      @user1.save(validate: false)
      @group2 = UserGroup.create!(name: 'Group2')
      @user2 = User.new(
        user_name: 'user2', role: @role,
        user_groups: [@group2],
        email: 'uzer_to@test.com', send_mail: true,
        agency:,
        settings: notification_settings,
        full_name: 'user2'
      )
      @user2.save(validate: false)
      @user3 = User.new(
        user_name: 'user3', role: @role,
        user_groups: [@group2],
        email: 'ar_uzer_to@test.com', send_mail: true,
        agency:,
        locale: 'ar-LB',
        settings: notification_settings,
        full_name: 'user3'
      )
      @user3.save(validate: false)
      @user4 = User.new(
        user_name: 'user4',
        role: @role,
        user_groups: [@group2],
        email: 'user4@test.com',
        send_mail: false,
        agency:,
        full_name: 'user4'
      )
      @user4.save(validate: false)
      @user5 = User.new(
        user_name: 'user5', role: @role,
        full_name: 'user5',
        user_groups: [@group2],
        email: 'user5@test.com', send_mail: true,
        agency:,
        locale: 'ar-LB',
        settings: {
          notifications: {
            send_mail: {
              Approval::NOTIFICATION_ACTIONS_REQUEST => true
            }
          }
        }
      )
      @user5.save(validate: false)
      @case = Child.create(
        data: {
          name: 'Test', owned_by: 'user1',
          module_id: @primero_module.unique_id,
          disclosure_other_orgs: true, consent_for_services: true
        }
      )
    end

    describe 'referral' do
      before do
        @referral = Referral.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)
      end

      let(:mail) { RecordActionMailer.transition_notify(TransitionNotificationService.new(@referral.id)) }

      it 'renders the headers' do
        expect(mail.subject).to eq("Case: #{@case.short_id} - Referral Request")
        expect(mail.to).to eq(['uzer_to@test.com'])
      end

      it 'renders the body' do
        expect(mail.body.encoded).to match('user1 from Test Agency has referred the following Case to you')
      end
    end

    describe 'when user has send_mail false' do
      before do
        @referral = Referral.create!(transitioned_by: 'user1', transitioned_to: 'user4', record: @case)
      end

      let(:mail) { RecordActionMailer.transition_notify(TransitionNotificationService.new(@referral.id)) }
      it 'mail should be nil' do
        expect(mail.parent.class.name).to eq('NilClass')
      end
    end

    describe 'referral with diferent locale' do
      before do
        @referral = Referral.create!(transitioned_by: 'user1', transitioned_to: 'user3', record: @case)
      end

      let(:mail) { RecordActionMailer.transition_notify(TransitionNotificationService.new(@referral.id)) }

      # TODO: Skipping this test till translated in Transifex
      xit 'renders the headers' do
        expect(mail.subject).to eq("حالة/ملفّ: #{@case.short_id} - إحالة")
        expect(mail.to).to eq(['ar_uzer_to@test.com'])
      end

      it 'renders the body' do
        expect(mail.text_part.body.encoded).to match('أحال إليك user1 من Test Agency Case')
      end
    end

    describe 'transfer' do
      before do
        @transfer = Transfer.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)
      end

      let(:mail) { RecordActionMailer.transition_notify(TransitionNotificationService.new(@transfer.id)) }

      it 'renders the headers' do
        expect(mail.subject).to eq("Case: #{@case.short_id} - Transfer")
        expect(mail.to).to eq(['uzer_to@test.com'])
      end

      it 'renders the body' do
        expect(mail.body.encoded).to match('user1 has transferred the following Case to you')
      end
    end

    describe 'transfer with diferent locale' do
      before do
        @transfer = Transfer.create!(transitioned_by: 'user1', transitioned_to: 'user3', record: @case)
      end

      let(:mail) { RecordActionMailer.transition_notify(TransitionNotificationService.new(@transfer.id)) }

      # TODO: Skipping this test till translated in Transifex
      xit 'renders the headers' do
        expect(mail.subject).to eq("حالة/ملفّ: #{@case.short_id} - نقل/تحويل")
        expect(mail.to).to eq(['ar_uzer_to@test.com'])
      end

      it 'renders the body' do
        expect(mail.text_part.body.encoded).to match('حوّل لك user1 Case التالي')
      end
    end

    describe 'assign' do
      before do
        @assign = Assign.create!(transitioned_by: 'user1', transitioned_to: 'user2', record: @case)
      end

      let(:mail) { RecordActionMailer.transition_notify(TransitionNotificationService.new(@assign.id)) }

      it 'renders the headers' do
        expect(mail.subject).to eq("Case: #{@case.short_id} - Assigned to you")
        expect(mail.to).to eq(['uzer_to@test.com'])
      end

      it 'renders the body' do
        expect(mail.body.encoded).to match('user1 has assigned the following Case to you')
      end
    end

    describe 'assign with diferent locale' do
      before do
        @assign = Assign.create!(transitioned_by: 'user1', transitioned_to: 'user3', record: @case)
      end

      let(:mail) { RecordActionMailer.transition_notify(TransitionNotificationService.new(@assign.id)) }

      it 'renders the headers' do
        expect(mail.subject).to eq("حالة/ملفّ: #{@case.short_id} - مُعيّن لك")
        expect(mail.to).to eq(['ar_uzer_to@test.com'])
      end

      it 'renders the body' do
        expect(mail.text_part.body.encoded).to match('لمستخدم user1 قد عيّن السجل التالي Case لك')
      end
    end

    describe 'transition request' do
      before do
        @transfer_request = TransferRequest.create!(transitioned_by: 'user2', transitioned_to: 'user1', record: @case)
      end

      let(:mail) { RecordActionMailer.transfer_request(TransitionNotificationService.new(@transfer_request.id)) }

      it 'renders the headers' do
        expect(mail.subject).to eq('Transfer request for one of your cases')
        expect(mail.to).to eq(['uzer1@test.com'])
      end

      it 'renders the body' do
        expect(mail.body.encoded)
          .to match('Primero user user2 from Test Agency is requesting that you transfer ownership')
      end
    end

    describe 'transition request with different locale' do
      before do
        @user1.locale = 'ar-LB'
        @user1.save(validate: false)
        @transfer_request = TransferRequest.create!(transitioned_by: 'user2', transitioned_to: 'user1', record: @case)
      end

      let(:mail) { RecordActionMailer.transfer_request(TransitionNotificationService.new(@transfer_request.id)) }

      it 'renders the headers' do
        expect(mail.subject).to eq('طلب تحويل لحالة من حالاتك')
        expect(mail.to).to eq(['uzer1@test.com'])
      end

      it 'renders the body' do
        expect(mail.text_part.body.encoded)
          .to include(
            %(مستخدم بريميرو user2 من الهيئة Test Agency يطلب أن تنقل ملكية هذا السجل من نوع Case ومعرّف
              #{@case.short_id} \(https://localhost:3000/v2/cases/#{@case.id}\)
              بحيث يتمكنون من تقديم خدمات إدارة للشخص في منطقتهم. إذا كان التحويل مقبولا من طرفك، يرجى النقر على رابط معرف نوع السجل
              Case في هذا الايميل لفتح نوع السجل Case في بريميرو والبدء بعملية التحويل.).squish
            )
      end
    end

    after :each do
      clean_data(
        Alert, User, Role, PrimeroModule, PrimeroProgram, Field, FormSection,
        Lookup, UserGroup, Incident, Child, Transition, Agency
      )
    end
  end

  describe 'Emailable Alert' do
    before do
      clean_data(Alert, User, Role, PrimeroModule, PrimeroProgram, Field, FormSection, UserGroup, Agency)
      FormSection.create!(unique_id: 'some_formsection_name', name: 'some_formsection_name',
                          name_en: 'Form Section Name', name_fr: 'Nom de la section du formulaire')
      @owner = create :user, user_name: 'owner', full_name: 'Owner', email: 'owner@primero.dev'
      @provider = create :user, user_name: 'provider', full_name: 'Provider', email: 'provider@primero.dev'
      @child = Child.new_with_user(@owner, { name: 'child', module_id: PrimeroModule::CP, case_id_display: '12345' })
      @child.save!
      @child.assigned_user_names = [@provider.user_name]
      @child.save!
      @child.associated_users(true)
      @child.data = { 'email_alertable_field' => 'some_value' }
      @child.save!
      @alert_notification = AlertNotificationService.new(@child.id, @child.alerts.first.id, @owner.user_name)
    end

    let(:mail) { RecordActionMailer.alert_notify(@alert_notification) }

    describe 'alert' do
      it 'renders the headers' do
        expect(mail.subject).to eq("Case: #{@child.short_id} - Form Section Name Updated")
        expect(mail.to).to eq(['owner@primero.dev'])
      end

      it 'renders the body' do
        expect(mail.text_part.body.encoded).to match(
          "Case #{@child.short_id} - Form Section Name has been updated. " \
          'Please log in to Primero to review the changes.'
        )
      end
    end

    after do
      clean_data(
        Alert, User, Role, PrimeroModule, PrimeroProgram, Field, FormSection,
        Lookup, UserGroup, Agency, Transition, Child
      )
    end
  end

  private

  def child_with_created_by(created_by, options = {})
    user = User.new(user_name: created_by, full_name: 'James Joy')
    child = Child.new_with_user user, options
    child.save && child
  end
end
