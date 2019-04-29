require 'rails_helper'

describe ApprovalRequestJob, type: :job do
  include ActiveJob::TestHelper

  before do
    Lookup.all.each {|lookup| lookup.destroy}
    User.all.each {|user| user.destroy}
    @lookup = create :lookup, id: 'lookup-approval-type', name: 'approval type'
    @manager1 = create :user, is_manager: true, email: 'manager1@primero.dev', send_mail: false, user_name: 'manager1'
    @manager2 = create :user, is_manager: true, email: 'manager2@primero.dev', send_mail: true, user_name: 'manager2'
    @owner = create :user, user_name: 'jnelson', full_name: 'Jordy Nelson', email: 'owner@primero.dev'
    @child = child_with_created_by(@owner.user_name, :name => "child1", :module_id => PrimeroModule::CP, case_id_display: '12345')
  end

  describe "perform_later" do
    it "sends a notification to manager" do
      ActiveJob::Base.queue_adapter = :test
      ApprovalRequestJob.perform_later(@child.owner.id, @child.id, 'value1')
      expect(ActiveJob::Base.queue_adapter.enqueued_jobs.size).to eq(1)
    end
  end

  private

  def child_with_created_by(created_by, options = {})
    user = User.new({:user_name => created_by, :organization=> "UNICEF"})
    child = Child.new_with_user_name user, options
    child.save
  end
end