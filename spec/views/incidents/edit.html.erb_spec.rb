  require 'rails_helper'

describe "incidents/edit.html.erb" do

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
        :parent_form=>"incident",
        "name_all" => "Record Owner",
        :unique_id => "record_ownwer",
        :order_form_group => 40,
        :order => 80,
        :order_subform => 0,
        :fields => record_owner_fields,
        :form_group_name => "Test Group"
      })
    assign(:form_sections,[@form_section].group_by{|e| e.form_group_name})
    Incident.any_instance.stub(:field_definitions).and_return(record_owner_fields)

    @incident = Incident.new
    @incident['owned_by'] = "me"
    @incident['created_by'] = "me"
    @incident['previously_owned_by'] = "other",
    @incident['module_id'] = "primeromodule-cp"
    @incident.save!

    assign(:referral_roles, [])
    assign(:transfer_roles, [])

    User.stub(:find_by_user_name).with("me").and_return(double(:organization => "stc"))
    @user = User.new
    @user.stub(:permissions => [Permission::READ, Permission::WRITE, Permission::USER])
    controller.stub(:current_user).and_return(@user)
    controller.stub(:model_class).and_return(Incident)
    controller.should_receive(:can?).with(:flag, @incident).and_return(false)
    controller.should_receive(:can?).with(:import, @incident).and_return(true)
    controller.should_receive(:can?).with(:edit, @incident).and_return(true)
    controller.should_receive(:can?).with(:export, Incident).and_return(false)
    controller.should_receive(:can?).with(:sync_mobile, Incident).and_return(true)
  end

  it "should have record owner fields hidden and disabled" do
    render
    #At save form, required field to be hidden.
    rendered.should have_tag("input[type='hidden'][name='incident[base_revision]']")
    rendered.should have_tag("input[type='hidden'][name='incident[record_state]'][value='true']")
    rendered.should have_tag("input[type='hidden'][name='incident[owned_by]']")
    rendered.should have_tag("input[type='hidden'][name='incident[created_by]']")
    rendered.should have_tag("input[type='hidden'][name='incident[previously_owned_by]']")
    rendered.should have_tag("input[type='hidden'][name='incident[module_id]'][value='primeromodule-cp']")

    #Inspect disabled fields.
    rendered.should have_tag("select[disabled='disabled'][name='incident[owned_by]']")
    rendered.should have_tag("input[type='text'][disabled='disabled'][name='incident[created_by]']")
    rendered.should have_tag("input[type='text'][disabled='disabled'][name='incident[previously_owned_by]']")
    rendered.should have_tag("input[type='text'][disabled='disabled'][name='incident[module_id]'][value='primeromodule-cp']")
    #Inspect editable fields.
    rendered.should have_tag("select[class='chosen-select'][name='incident[assigned_user_names][]']")
  end
end
