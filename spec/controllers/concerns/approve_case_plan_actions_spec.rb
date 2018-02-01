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

    @case1 = Child.create(:name => 'Test Case 1', :short_id => 'aaa111', :module_id => 'cp')
    @case2 = Child.create(:name => 'Test Case 2', :short_id => 'bbb222', :module_id => 'cp')
  end

  context 'with a user not having approval permission' do
    before do
      User.stub(:find_by_user_name).and_return(@user)
      permission_nonapproval = Permission.new(resource: Permission::CASE, actions: [Permission::READ])
      Role.create(id: 'nonapprover', name: 'nonapprover', permissions_list: [permission_nonapproval], group_permission: Permission::GROUP)
      @user = User.new(:user_name => 'non_approval_user', :role_ids => ['nonapprover'])
      @session = fake_login @user
    end

    it "does not allow approve case plan" do
      params = {
          :id => @case1.id,
          :approval => "yes",
          :approval_type => ApprovalActions::CASE_PLAN,
          :comments => "Test Comments"
      }
      post :approve_form, params
      expect(response.status).to eq(403)
    end
  end

  context 'with user having approval permission' do
    before do
      User.stub(:find_by_user_name).and_return(@user)
      permission_approval = Permission.new(resource: Permission::CASE, actions: [Permission::APPROVE_CASE_PLAN])
      Role.create(id: 'approver', name: 'approver', permissions_list: [permission_approval], group_permission: Permission::GROUP)
      @user2 = User.new(:user_name => 'approval_user', :role_ids => ['approver'])
      @session = fake_login @user2
    end

    it 'allows approve case plan' do
      params = {
        :id => @case1.id,
        :approval => "yes",
        :approval_type => ApprovalActions::CASE_PLAN,
        :comments => "Test Comments"
      }
      post :approve_form, params
      expect(response.status).not_to eq(403)
    end
  end

  context 'with user having approval permission' do
    before do
      FormSection.all.each &:destroy
      PrimeroModule.all.each &:destroy

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
          "description_all" => "Approval Subform",
          "collapsed_fields" => [
            "approval_requested_for",
            "approval_response_for",
            "approval_for_type",
            "approval_date",
            "approval_status"
          ]
      })

      approvals_section.save!

      approvals_fields = [
        Field.new({"name" => "approval_subforms",
          "type" => "subform",
          "subform_section_id" => approvals_section.unique_id,
          "display_name_all" => "Approval"
        }),
      ]

      form = FormSection.new({
        :unique_id => "approvals",
        :parent_form=>"case",
        :form_group_name => "Approvals",
        :fields => approvals_fields,
        "name_all" => "Approvals",
        "description_all" => "Approvals"
      })

      form.save!

      @primero_module = PrimeroModule.create!(
        program_id: "primeroprogram-primero",
        name: "CP",
        description: "Child Protection",
        associated_form_ids: ["approvals"],
        associated_record_types: ['case']
      )

      Child.refresh_form_properties

      User.stub(:find_by_user_name).and_return(@user)
      permission_approval = Permission.new(resource: Permission::CASE, actions: [Permission::APPROVE_CASE_PLAN])
      @user = User.new(:user_name => 'approval_user', :role_ids => ['approver'])
      @session = fake_login @user
    end

    it 'logs history of approved case plan' do
      params = {
        :id => @case1.id,
        :approval => "yes",
        :approval_type => ApprovalActions::CASE_PLAN,
        :comments => "Test Comments"
      }
      post :approve_form, params

      approval_history = assigns[:child][:approval_subforms].first
      expect(approval_history.approval_manager_comments).to eq(params[:comments])
      expect(approval_history.approval_status).to eq(ApprovalActions::REJECTED_STATUS)
      expect(approval_history.approved_by).to eq(@user.user_name)
    end
  end
end
