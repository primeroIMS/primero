  require 'rails_helper'

describe "tracing_requests/edit.html.erb" do

  before :each do
    FormSection.all.each &:destroy
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
    @form_section = FormSection.create!({
        :parent_form=>"tracing_request",
        "name_all" => "Record Owner",
        :unique_id => "record_ownwer",
        :order_form_group => 40,
        :order => 80,
        :order_subform => 0,
        :fields => record_owner_fields,
        :form_group_name => "Test Group"
      })
    TracingRequest.any_instance.stub(:field_definitions).and_return(record_owner_fields)
    TracingRequest.refresh_form_properties

    assign(:form_sections,[@form_section].group_by{|e| e.form_group_name})

    @tracing_request = TracingRequest.new
    @tracing_request['owned_by'] = "me"
    @tracing_request['created_by'] = "me"
    @tracing_request['previously_owned_by'] = "other",
    @tracing_request['module_id'] = "primeromodule-cp"
    @tracing_request.save!

    assign(:referral_roles, [])
    assign(:transfer_roles, [])

    User.stub(:find_by_user_name).with("me").and_return(double(:organization => "stc"))
    @user = User.new
    @user.stub(:permissions => [Permission::READ, Permission::WRITE, Permission::CREATE, Permission::USER])
    controller.stub(:current_user).and_return(@user)
    controller.stub(:model_class).and_return(TracingRequest)
    controller.should_receive(:can?).with(:flag, @tracing_request).and_return(false)
    controller.should_receive(:can?).with(:import, @tracing_request).and_return(true)
    controller.should_receive(:can?).with(:edit, @tracing_request).and_return(true)
    controller.should_receive(:can?).with(:export, TracingRequest).and_return(false)
    controller.should_receive(:can?).with(:export_custom, @tracing_request).and_return(false)
    controller.should_receive(:can?).with(:remove_assigned_users, TracingRequest).and_return(false)
  end

  after :all do
    FormSection.all.each &:destroy
    TracingRequest.remove_form_properties
  end

  it "should have record owner fields hidden and disabled" do
    render
    #At save form, required field to be hidden.
    rendered.should have_tag("input[type='hidden'][name='tracing_request[base_revision]']")
    rendered.should have_tag("input[type='hidden'][name='tracing_request[record_state]'][value='true']")
    rendered.should have_tag("input[type='hidden'][name='tracing_request[owned_by]']")
    rendered.should have_tag("input[type='hidden'][name='tracing_request[created_by]']")
    rendered.should have_tag("input[type='hidden'][name='tracing_request[previously_owned_by]']")
    rendered.should have_tag("input[type='hidden'][name='tracing_request[module_id]'][value='primeromodule-cp']")

    #Inspect disabled fields.
    rendered.should have_tag("select[disabled='disabled'][name='tracing_request[owned_by]']")
    rendered.should have_tag("input[type='text'][disabled='disabled'][name='tracing_request[created_by]']")
    rendered.should have_tag("input[type='text'][disabled='disabled'][name='tracing_request[previously_owned_by]']")
    rendered.should have_tag("input[type='text'][disabled='disabled'][name='tracing_request[module_id]'][value='primeromodule-cp']")
    #Inspect editable fields.
    rendered.should have_tag("select.chosen-select[name='tracing_request[assigned_user_names][]']")
  end
end
