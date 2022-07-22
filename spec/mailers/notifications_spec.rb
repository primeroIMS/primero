# frozen_string_literal: true

require 'rails_helper'

describe NotificationMailer, type: :mailer do
  before do
    clean_data(SystemSettings)
    SystemSettings.create(default_locale: 'en', notification_email_enabled: true, unhcr_needs_codes_mapping: {},
                          changes_field_to_form: {})
  end

  describe 'approvals' do
    before do
      clean_data(PrimeroProgram, PrimeroModule, Field, FormSection, Lookup, User, UserGroup, Role)
      @lookup = Lookup.create!(id: 'lookup-approval-type', unique_id:'lookup-approval-type', name: 'approval type',
                               lookup_values_en: [{'id' => 'value1', 'display_text' => 'value1'}])
      role = create(:role, is_manager: true)
      @manager1 = create(:user, role: role, email: 'manager1@primero.dev', send_mail: false, user_name: 'manager1')
      @manager2 = create(:user, role: role, email: 'manager2@primero.dev', send_mail: true, user_name: 'manager2')
      @manager3 = create(:user, role: role, email: 'manager3@primero.dev', send_mail: true, user_name: 'manager3', locale: 'ar-LB')
      @owner = create(:user, user_name: 'jnelson', full_name: 'Jordy Nelson', email: 'owner@primero.dev')
      @arabic_owner = create(:user, user_name: 'jdoe', full_name: 'Jhon Doe', email: 'arabic_owner@primero.dev', locale: 'ar-LB')
      @child = child_with_created_by(@owner.user_name, name: 'child1', module_id: PrimeroModule::CP,
                                                       case_id_display: '12345')
      @arabic_child = child_with_created_by(@arabic_owner.user_name, name: 'arabic_child1', module_id: PrimeroModule::CP,
                                                        case_id_display: '67890')
    end

    describe 'manager_approval_request' do
      let(:mail) do
        NotificationMailer.manager_approval_request(@child.id, 'value1', @manager2.user_name)
      end

      it 'renders the headers' do
        expect(mail.subject).to eq("Case: #{@child.short_id} - Approval Request")
        expect(mail.to).to eq(['manager2@primero.dev'])
      end

      it 'renders the body' do
        expect(mail.body.encoded)
          .to match("The user jnelson is requesting approval for value1 on case .*#{@child.short_id}")
      end
    end

    describe 'manager_approval_request with diferent locale' do
      let(:mail) do
        NotificationMailer.manager_approval_request(@child.id, 'value1', @manager3.user_name)
      end

      it 'renders the headers in arabic locale' do
        expect(mail.subject).to eq("الملفّ: #{@child.short_id} - طلب الموافقة")
        expect(mail.to).to eq(['manager3@primero.dev'])
      end

      it 'renders the body in arabic locale' do
        expect(mail.text_part.body.encoded)
          .to match("يطلب المستخدم jnelson الموافقة value1 للملفّ .*#{@child.short_id}")
      end
    end

    describe 'manager_approval_response' do
      let(:mail) { NotificationMailer.manager_approval_response(@child.id, false, 'value1', @manager1.user_name) }

      it 'renders the headers' do
        expect(mail.subject).to eq("Case: #{@child.short_id} - Approval Response")
        expect(mail.to).to eq(['owner@primero.dev'])
      end

      it 'renders the body' do
        expect(mail.body.encoded)
          .to match("manager1 has rejected the request for approval for value1 for case .*#{@child.short_id}")
      end
    end

    describe 'manager_approval_response with diferent locale' do
      let(:mail) { NotificationMailer.manager_approval_response(@arabic_child, false, 'value1', @manager1.user_name) }

      it 'renders the headers in arabic locale' do
        expect(mail.subject).to eq("الملفّ: #{@arabic_child.short_id} - إستجابة حول الموافقة")
        expect(mail.to).to eq(['arabic_owner@primero.dev'])
      end

      it 'renders the body in arabic locale' do
        expect(mail.text_part.body.encoded)
          .to match("طلب manager1 تم رفضه الموافقة value1 للملفّ .*#{@arabic_child.short_id}")
      end
    end
  end

  describe 'Transitions' do
    before :each do
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
        agency: agency
      )
      @user1.save(validate: false)
      @group2 = UserGroup.create!(name: 'Group2')
      @user2 = User.new(
        user_name: 'user2', role: @role,
        user_groups: [@group2],
        email: 'uzer_to@test.com', send_mail: true,
        agency: agency
      )
      @user2.save(validate: false)
      @user3 = User.new(
        user_name: 'user3', role: @role,
        user_groups: [@group2],
        email: 'ar_uzer_to@test.com', send_mail: true,
        agency: agency,
        locale: 'ar-LB'
      )
      @user3.save(validate: false)
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

      let(:mail) { NotificationMailer.transition_notify(@referral.id) }

      it 'renders the headers' do
        expect(mail.subject).to eq("Case: #{@case.short_id} - Referral")
        expect(mail.to).to eq(['uzer_to@test.com'])
      end

      it 'renders the body' do
        expect(mail.body.encoded).to match('user1 from Test Agency has referred the following Case to you')
      end
    end

    describe 'referral with diferent locale' do
      before do
        @referral = Referral.create!(transitioned_by: 'user1', transitioned_to: 'user3', record: @case)
      end

      let(:mail) { NotificationMailer.transition_notify(@referral.id) }

      it 'renders the headers' do
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

      let(:mail) { NotificationMailer.transition_notify(@transfer.id) }

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

      let(:mail) { NotificationMailer.transition_notify(@transfer.id) }

      it 'renders the headers' do
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

      let(:mail) { NotificationMailer.transition_notify(@assign.id) }

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

      let(:mail) { NotificationMailer.transition_notify(@assign.id) }

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

      let(:mail) { NotificationMailer.transition_notify(@transfer_request.id) }

      it 'renders the headers' do
        expect(mail.subject).to eq('Transfer request for one of your cases')
        expect(mail.to).to eq(['uzer1@test.com'])
      end

      it 'renders the body' do
        expect(mail.body.encoded)
          .to match('Primero user user2 from Test Agency is requesting that you transfer ownership')
      end
    end

    describe 'transition request with diferent locale' do
      before do
        @user1.locale = 'ar-LB'
        @user1.save(validate: false)
        @transfer_request = TransferRequest.create!(transitioned_by: 'user2', transitioned_to: 'user1', record: @case)
      end

      let(:mail) { NotificationMailer.transition_notify(@transfer_request.id) }

      it 'renders the headers' do
        expect(mail.subject).to eq('طلب تحويل لحالة من حالاتك')
        expect(mail.to).to eq(['uzer1@test.com'])
      end

      it 'renders the body' do
        expect(mail.text_part.body.encoded)
          .to match('مستخدم بريميرو user2 من مؤسسة Test Agency يطلب أن تنقل ملكية هذا السجل من نوع Case ومعرّف')
      end
    end

    after :each do
      clean_data(
        PrimeroProgram, PrimeroModule, Field, FormSection,
        Lookup, User, UserGroup, Role, Child, Transition, Agency
      )
    end
  end

  private

  def child_with_created_by(created_by, options = {})
    user = User.new(user_name: created_by)
    child = Child.new_with_user user, options
    child.save && child
  end
end
