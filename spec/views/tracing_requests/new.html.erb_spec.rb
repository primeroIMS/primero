require 'rails_helper'

describe "tracing_requests/new.html.erb" do

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
        :parent_form=>"tracing_request",
        "name_all" => "Record Owner",
        :unique_id => "record_ownwer",
        :order_form_group => 40,
        :order => 80,
        :order_subform => 0,
        :fields => record_owner_fields,
        :form_group_name => "Test Group"
      })
    @tracing_request = TracingRequest.new

    controller.should_receive(:can?).with(:remove_assigned_users, TracingRequest).and_return(false)

    assign(:form_sections,[@form_section].group_by{|e| e.form_group_name})
  end

  it "renders a hidden field for the posted_from attribute" do
    render
    rendered.should have_tag("input[name='tracing_request[posted_from]'][value='Browser']")
  end

  it "should have record owner fields hidden and disabled" do
    @tracing_request['module_id'] = "primeromodule-cp"
    render
    #At new form, the module is the only required field to be hidden.
    rendered.should have_tag("input[type='hidden'][name='tracing_request[posted_from]'][value='Browser']")
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
    rendered.should have_selector("select.chosen-select[name='tracing_request[assigned_user_names][]']")
  end
end
