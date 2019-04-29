  require 'rails_helper'

describe "children/edit.html.erb" do
  before :all do
    PrimeroModule.all.each &:destroy
    @mod ||= PrimeroModule.create!(_id: 'primeromodule-cp', program_id: 'fakeprogram',
                                   name: 'CP', associated_record_types: ['case'],
                                   form_section_ids: ['xxxxx'],
                                   module_options: { workflow_status_indicator: false })
  end
  before :each do
    record_owner_fields = [
      Field.new({"name" => "owned_by",
                 "type" =>"select_box" ,
                 "display_name_all" => "Caseworker Code",
                 "option_strings_source" => "User",
                 "editable" => false,
                 "disabled" => true
              }),
      Field.new({"name" => "assigned_user_names",
                 "type" =>"select_box",
                 "multi_select" => true,
                 "display_name_all" => "Other Assigned Users",
                 "option_strings_source" => "User"
                }),
      Field.new({"name" => "created_by",
              "type" => "text_field",
              "display_name_all" => "Record created by",
              "editable" => false,
              "disabled" => true
              }),
      Field.new({"name" => "previously_owned_by",
              "type" => "text_field",
              "display_name_all" => "Previous Owner",
              "editable" => false,
              "disabled" => true
              }),
      Field.new({"name" => "module_id",
              "type" => "text_field",
              "display_name_all" => "Module",
              "editable" => false,
              "disabled" => true
              })
    ]
    @form_section = FormSection.new({
        :parent_form=>"case",
        "name_all" => "Record Owner",
        :unique_id => "record_ownwer",
        :order_form_group => 40,
        :order => 80,
        :order_subform => 0,
        :fields => record_owner_fields,
        :form_group_name => "Test Group"
      })

    assign(:form_sections,[@form_section].group_by{|e| e.form_group_name})

    @child = Child.new
    @child['owned_by'] = "me"
    @child['created_by'] = "me"
    @child['previously_owned_by'] = "other",
    @child['module_id'] = "primeromodule-cp"
    @child.save!

    assign(:referral_roles, [])
    assign(:transfer_roles, [])

    User.stub(:find_by_user_name).with("me").and_return(double(:organization => "stc"))
    @user = User.new
    @user.stub(:permissions => [Permission::READ, Permission::WRITE, Permission::CREATE, Permission::USER])
    controller.stub(:current_user).and_return(@user)
    controller.stub(:model_class).and_return(Child)
    controller.should_receive(:can?).with(:flag, @child).and_return(false)
    controller.should_receive(:can?).with(:update, @child).and_return(true)
    controller.should_receive(:can?).with(:import, Child).and_return(true)
    controller.should_receive(:can?).with(:edit, @child).and_return(true)
    controller.should_receive(:can?).with(:export, Child).and_return(false)
    controller.should_receive(:can?).with(:export_custom, Child).and_return(false)
    controller.should_receive(:can?).with(:referral, Child).and_return(false)
    controller.should_receive(:can?).with(:transfer, Child).and_return(false)
    controller.should_receive(:can?).with(:enable_disable_record, Child).and_return(false)
    controller.should_receive(:can?).with(:sync_mobile, Child).and_return(false)
    controller.should_receive(:can?).with(:remove_assigned_users, Child).and_return(false)
    controller.should_receive(:can?).with(:request_approval_bia, Child).and_return(false)
    controller.should_receive(:can?).with(:request_approval_case_plan, Child).and_return(false)
    controller.should_receive(:can?).with(:request_approval_closure, Child).and_return(false)
    controller.should_receive(:can?).with(:approve_bia, Child).and_return(false)
    controller.should_receive(:can?).with(:approve_case_plan, Child).and_return(false)
    controller.should_receive(:can?).with(:approve_closure, Child).and_return(false)
  end

  xit "renders a form that posts to the children url" do
    render
    rendered.should have_tag("form[action='#{child_path(@child)}']")
  end

  xit "renders the children/form_section partial" do
    # This should be a controller spec
    render
    rendered.should render_template(:partial =>  "_form_section",:collection => [@form_section])
  end

  xit "renders a form whose discard button links to the child listing page" do
    render
    rendered.should have_tag("a[href='#{children_path}']")
  end

  it "should have record owner fields hidden and disabled" do
    render
    #At save form, required field to be hidden.
    rendered.should have_tag("input[type='hidden'][name='child[base_revision]']")
    rendered.should have_tag("input[type='hidden'][name='child[record_state]'][value='true']")
    rendered.should have_tag("input[type='hidden'][name='child[owned_by]']")
    rendered.should have_tag("input[type='hidden'][name='child[created_by]']")
    rendered.should have_tag("input[type='hidden'][name='child[previously_owned_by]']")
    rendered.should have_tag("input[type='hidden'][name='child[module_id]'][value='primeromodule-cp']")

    #Inspect disabled fields.
    rendered.should have_tag("select[disabled='disabled'][name='child[owned_by]']")
    rendered.should have_tag("input[type='text'][disabled='disabled'][name='child[created_by]']")
    rendered.should have_tag("input[type='text'][disabled='disabled'][name='child[previously_owned_by]']")
    rendered.should have_tag("input[type='text'][disabled='disabled'][name='child[module_id]'][value='primeromodule-cp']")
    #Inspect editable fields.
    rendered.should have_tag("select.chosen-select[name='child[assigned_user_names][]']")
  end
end
