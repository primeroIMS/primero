require 'rails_helper'

describe NotificationMailer, type: :mailer do
  describe "approvals" do
    before do
      Lookup.all.each {|lookup| lookup.destroy}
      User.all.each {|user| user.destroy}
      @lookup = create :lookup, id: 'lookup-approval-type', name: 'approval type'
      @manager1 = create :user, is_manager: true, email: 'manager1@primero.dev', send_mail: false, user_name: 'manager1'
      @manager2 = create :user, is_manager: true, email: 'manager2@primero.dev', send_mail: true, user_name: 'manager2'
      @owner = create :user, user_name: 'jnelson', full_name: 'Jordy Nelson', email: 'owner@primero.dev'
      @child = child_with_created_by(@owner.user_name, :name => "child1", :module_id => PrimeroModule::CP, case_id_display: '12345')
    end

    describe "manager_approval_request" do
      let(:mail) { NotificationMailer.manager_approval_request(@owner.id, @manager2.id, @child.id, 'value1', 'example.com') }

      it "renders the headers" do
        expect(mail.subject).to eq("Case: #{@child.short_id} - Approval Request")
        expect(mail.to).to eq(["manager2@primero.dev"])
      end

      it "renders the body" do
        expect(mail.body.encoded).to match("The user jnelson is requesting approval for value1 on case .*#{@child.short_id}")
      end
    end

    describe "manager_approval_response" do
      let(:mail) { NotificationMailer.manager_approval_response(@manager1.id, @child.id, 'value1', true, 'example.com', false) }

      it "renders the headers" do
        expect(mail.subject).to eq("Case: #{@child.short_id} - Approval Response")
        expect(mail.to).to eq(["owner@primero.dev"])
      end

      it "renders the body" do
        expect(mail.body.encoded).to match("manager1 has rejected the request for approval for value1 for case .*#{@child.short_id}")
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
      @role = Role.new(permissions_list: [@permission_assign_case])
      @role.save(validate: false)
      agency = Agency.create!(name: 'Test Agency', agency_code: 'TA')
      @group1 = UserGroup.create!(name: 'Group1')
      @user1 = User.new(
        user_name: 'user1', role: @role, user_groups: [@group1],
        modules: [@primero_module],
        agency: agency
      )
      @user1.save(validate: false)
      @group2 = UserGroup.create!(name: 'Group2')
      @user2 = User.new(
        user_name: 'user2', role: @role,
        user_groups: [@group2], modules: [@primero_module],
        email: 'uzer_to@test.com', send_mail: true,
        agency: agency
      )
      @user2.save(validate: false)
      @case = Child.create(
        data: {
          name: 'Test', owned_by: 'user1',
          module_id: @primero_module.unique_id,
          disclosure_other_orgs: true, consent_for_services: true
        }
      )
    end

    describe "referral" do
      before do
        @referral = Referral.create!(transitioned_by: 'user1', to_user_name: 'user2', record: @case)
      end

      let(:mail) { NotificationMailer.transition_notify(@referral.id) }

      it "renders the headers" do
        expect(mail.subject).to eq("Case: #{@case.short_id} - Referral")
        expect(mail.to).to eq(['uzer_to@test.com'])
      end

      it "renders the body" do
        expect(mail.body.encoded).to match("user1 from Test Agency has referred the following Case to you")
      end
    end

    describe "transfer" do
      before do
        @transfer = Transfer.create!(transitioned_by: 'user1', to_user_name: 'user2', record: @case)
      end

      let(:mail) { NotificationMailer.transition_notify(@transfer.id)}

      it "renders the headers" do
        expect(mail.subject).to eq("Case: #{@case.short_id} - Transfer")
        expect(mail.to).to eq(['uzer_to@test.com'])
      end

      it "renders the body" do
        expect(mail.body.encoded).to match("user1 has transferred the following Case to you")
      end
    end

    describe "assign" do
      before do
        @assign = Assign.create!(transitioned_by: 'user1', to_user_name: 'user2', record: @case)
      end

      let(:mail) { NotificationMailer.transition_notify(@assign.id) }

      it "renders the headers" do
        expect(mail.subject).to eq("Case: #{@case.short_id} - Assigned to you")
        expect(mail.to).to eq(['uzer_to@test.com'])
      end

      it "renders the body" do
        expect(mail.body.encoded).to match("user1 has assigned the following Case to you")
      end
    end

    after :each do
      PrimeroModule.destroy_all
      UserGroup.destroy_all
      Role.destroy_all
      User.destroy_all
      Child.destroy_all
      Transition.destroy_all
      Agency.destroy_all
    end
  end

  private

  def child_with_created_by(created_by, options = {})
    user = User.new({:user_name => created_by, :organization=> "UNICEF"})
    child = Child.new_with_user_name user, options
    child.save
  end
end
