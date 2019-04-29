require 'rails_helper'

describe ApprovalActions, type: :controller do

  controller(ApplicationController) do
    include RecordActions
    include ApprovalActions

    def model_class
      Child
    end

    def redirect_to *args
      super(:action => :index, :controller => :home)
    end
  end

  before do
    routes.draw {
      post 'approve_form' => 'anonymous#approve_form'
    }

    FormSection.all.each &:destroy
    PrimeroModule.all.each &:destroy
    Role.all.each &:destroy
    User.all.each &:destroy

    approvals_fields_subform = [
        Field.new({"name" => "approval_manager_comments",
                   "type" => "textarea",
                   "display_name_all" => "Manager Comments",
                   "editable"=> false,
                   "disabled"=> true,
                  }),
        Field.new({"name" => "approval_status",
                   "type" => "select_box",
                   "display_name_all" => "Approval Status",
                   "editable"=> false,
                   "disabled"=> true,
                   "option_strings_source" => "lookup lookup-approval-status"
                  }),
        Field.new({"name" => "approved_by",
                   "type" => "select_box",
                   "display_name_all" => "Approved by",
                   "editable"=> false,
                   "disabled"=> true,
                   "option_strings_source" => "User"
                  })
    ]

    approvals_section = FormSection.new({
                                            "visible"=>false,
                                            "is_nested"=>true,
                                            :order_form_group => 999,
                                            :order => 999,
                                            :order_subform => 1,
                                            :unique_id=>"approval_subforms",
                                            :parent_form=>"case",
                                            "editable"=>true,
                                            :fields => approvals_fields_subform,
                                            :initial_subforms => 0,
                                            "name_all" => "Approval Subform",
                                            "description_all" => "Approval Subform"
                                        })
    approvals_section.save!

    approvals_fields = [
        Field.new({"name" => "approval_subforms",
                   "type" => "subform",
                   "subform_section_id" => approvals_section.id,
                   "display_name_all" => "Approval"
                  }),
    ]

    form = FormSection.new({
                               :unique_id => "approvals",
                               :parent_form=>"case",
                               :fields => approvals_fields,
                               "name_all" => "Approvals",
                               "description_all" => "Approvals"
                           })

    form.save!

    @primero_module = PrimeroModule.create!(
        program_id: "primeroprogram-primero",
        name: "CP",
        description: "Child Protection",
        form_section_ids: ["approvals"],
        associated_record_types: ['case']
    )

    Child.refresh_form_properties

    @case1 = Child.create(:name => 'Test Case 1', :short_id => 'aaa111', :module_id => 'cp')
    @case2 = Child.create(:name => 'Test Case 2', :short_id => 'bbb222', :module_id => 'cp')


  end

  context 'with a user not having approval permission' do
    before do
      User.stub(:find_by_user_name).with('nonapprover').and_return(@user)
      permission_nonapproval = Permission.new(resource: Permission::CASE, actions: [Permission::READ])
      Role.create(id: 'nonapprover', name: 'nonapprover', permissions_list: [permission_nonapproval], group_permission: Permission::GROUP)
      @user = User.new(:user_name => 'non_approval_user', :role_ids => ['nonapprover'])
      @session = fake_login @user

      @params = {id: @case1.id, approval: "yes", approval_type: Approvable::CASE_PLAN, comments: "Test Comments"}
    end

    it "does not allow approve case plan" do
      post :approve_form, params: @params
      expect(response.status).to eq(403)
    end
  end

  context 'with user having approval permission' do
    before do
      User.stub(:find_by_user_name).with('approver').and_return(@user)
      User.stub(:find_by_user_name).with(nil).and_return(@user)
      permission_approval = Permission.new(resource: Permission::CASE, actions: [Permission::APPROVE_CASE_PLAN])
      Role.create(id: 'approver', name: 'approver', permissions_list: [permission_approval], group_permission: Permission::GROUP)
      @manager1 = User.new(user_name: 'approval_user', role_ids: ['approver'], is_manager: true, email: 'manager1@primero.dev', send_mail: true)
      @session = fake_login @manager1

      @params = {id: @case1.id, approval: "yes", approval_type: Approvable::CASE_PLAN, comments: "Test Comments"}
    end

    it 'allows approve case plan' do
      post :approve_form, params: @params
      expect(response.status).not_to eq(403)
    end

    it 'logs history of approved case plan' do
      post :approve_form, params: @params

      approval_history = assigns[:child][:approval_subforms].first
      expect(approval_history[:approval_manager_comments]).to eq(@params[:comments])
      expect(approval_history[:approval_status]).to eq(Approvable::APPROVAL_STATUS_REJECTED)
      expect(approval_history[:approved_by]).to eq(@manager1.user_name)
    end

    describe 'Approval Response Email' do
      before do
        SystemSettings.all.each &:destroy
        Lookup.all.each &:destroy
        @system_settings = SystemSettings.create(default_locale: "en")
        @lookup = Lookup.create!(id: 'lookup-approval-type', name: 'approval type',
                                 lookup_values: [{id: "case_plan", display_text: "Case Plan"}.with_indifferent_access,
                                                 {id: "action_plan", display_text: "Action Plan"}.with_indifferent_access,
                                                 {id: "service_provision", display_text: "Service Provision"}.with_indifferent_access
                                 ])

        User.stub(:find_by_user_name).with('test_owner').and_return nil
        @owner = create :user, user_name: 'test_owner', full_name: 'Test Owner', email: 'owner@primero.dev', organization: 'UNICEF'
        @case3 = Child.new_with_user_name @owner, :name => "child1", :module_id => PrimeroModule::CP, case_id_display: '12345'
        p_module = PrimeroModule.new(:id => "primeromodule-cp", :associated_record_types => ["case"])
        @case3.stub(:module).and_return p_module
        @case3.save
        User.stub(:find).with(@owner.id).and_return @owner
        @owner.stub(:managers).and_return [@manager1]
        ActiveJob::Base.queue_adapter = :inline
        @params = {id: @case3.id, approval: "true", approval_type: Approvable::CASE_PLAN, comments: "Test Comments"}
      end

      context 'when notification emails are enabled' do
        before do
          @system_settings.notification_email_enabled = true
          @system_settings.save
        end

        it 'sends an approval email' do
          expect { post :approve_form, params: @params }.to change { ActionMailer::Base.deliveries.count }.by(1)
        end
      end

      context 'when notification emails are disabled' do
        before do
          @system_settings.notification_email_enabled = false
          @system_settings.save
        end

        it 'does not send an approval email' do
          expect { post :approve_form, params: @params }.to change { ActionMailer::Base.deliveries.count }.by(0)
        end
      end
    end

  end
end
