require "spec_helper"

describe NotificationMailer, :type => :mailer do
  before do
    Lookup.all.each {|lookup| lookup.destroy}
    User.all.each {|user| user.destroy}
    @lookup = create :lookup, id: 'lookup-approval-type', name: 'approval type'
    @manager1 = create :user, is_manager: true, email: 'manager1@primero.dev', send_mail: false, user_name: 'manager1'
    @manager2 = create :user, is_manager: true, email: 'manager2@primero.dev', send_mail: true, user_name: 'manager2'
    @owner = create :user, user_name: 'jnelson', full_name: 'Jordy Nelson', email: 'owner@primero.dev'
    @child = create_child_with_created_by(@owner.user_name, :name => "child1", :module_id => PrimeroModule::CP, case_id_display: '12345')
  end

  describe "manager_approval_request" do
    let(:mail) { NotificationMailer.manager_approval_request(@owner.id, @manager2.id, @child.id, 'value1', 'example.com') }

    it "renders the headers" do
      expect(mail.subject).to eq("Jordy Nelson - Approval Request")
      expect(mail.to).to eq(["manager2@primero.dev"])
    end

    it "renders the body" do
      expect(mail.body.encoded).to match("The user jnelson is requesting approval for value1 on case .*12345")
    end
  end

  describe "manager_approval_response" do
    let(:mail) { NotificationMailer.manager_approval_response(@manager1.id, @child.id, 'value1', true, 'example.com') }

    it "renders the headers" do
      expect(mail.subject).to eq("Case: 12345 - Approval Response")
      expect(mail.to).to eq(["owner@primero.dev"])
    end

    it "renders the body" do
      expect(mail.body.encoded).to match("manager1 has rejected the request for approval for value1 for case .*12345")
    end
  end

  private

  def create_child_with_created_by(created_by,options = {})
    user = User.new({:user_name => created_by, :organization=> "UNICEF"})
    child = Child.new_with_user_name user, options
    child.save
  end
end
