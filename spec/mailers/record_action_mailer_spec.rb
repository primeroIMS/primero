# frozen_string_literal: true

require 'rails_helper'

describe RecordActionMailer, type: :mailer do
  before do
    clean_data(SystemSettings)
    SystemSettings.create(default_locale: 'en', unhcr_needs_codes_mapping: {}, changes_field_to_form: {})
  end

  describe 'approvals' do
    before do
      clean_data(User, Role, PrimeroModule, PrimeroProgram, Field, FormSection, Lookup, UserGroup, Agency, Transition)

      @lookup = Lookup.create!(id: 'lookup-approval-type', unique_id: 'lookup-approval-type', name: 'approval type',
                               lookup_values_en: [{ 'id' => 'value1', 'display_text' => 'value1' }])
      role = create(:role, is_manager: true)
      @manager1 = create(:user, role:, email: 'manager1@primero.dev', send_mail: false, user_name: 'manager1')
      @owner = create(:user, user_name: 'jnelson', full_name: 'Jordy Nelson', email: 'owner@primero.dev')
      @disabled_user = create(
        :user, user_name: 'duser', full_name: 'Disabled User', email: 'duser@primero.dev', disabled: true
      )
      @arabic_owner = create(:user, user_name: 'jdoe', full_name: 'Jhon Doe', email: 'arabic_owner@primero.dev',
                                    locale: 'ar-LB')
      @child = child_with_created_by(@owner.user_name, name: 'child1', module_id: PrimeroModule::CP,
                                                       case_id_display: '12345')
      @referral = Referral.new(transitioned_by: 'manager1', transitioned_to: 'duser', record: @child)
      @referral.save(validate: false)
    end

    describe 'transition_notify' do
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
          create(:user, user_name: 'user2', full_name: 'User random', email: 'user2@primero.dev', send_mail: true)
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

  after do
    clean_data(User, Role, PrimeroModule, PrimeroProgram, Field, FormSection, Lookup, UserGroup, Agency, Transition)
  end

  private

  def child_with_created_by(created_by, options = {})
    user = User.new(user_name: created_by)
    child = Child.new_with_user user, options
    child.save && child
  end
end
