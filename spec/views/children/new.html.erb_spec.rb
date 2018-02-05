require 'rails_helper'

describe "children/new.html.erb" do

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
    @child = Child.new
    assign(:form_sections,[@form_section].group_by{|e| e.form_group_name})
  end

  it "renders a form that posts to the cases url" do
    render
    rendered.should have_tag("form[action='#{children_path}']")
  end

  xit "renders the children/form_section partial" do
    # This should be a controller spec
    render
    rendered.should render_template(:partial => "_form_section", :collection => [@form_section])
  end

	it "renders a hidden field for the posted_from attribute" do
		render
		rendered.should have_tag("input[name='child[posted_from]'][value='Browser']")
	end

  it "should have record owner fields hidden and disabled" do
    @child['module_id'] = "primeromodule-cp"
    render
    #At new form, the module is the only required field to be hidden.
    rendered.should have_tag("input[type='hidden'][name='child[posted_from]'][value='Browser']")
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
    rendered.should have_tag("select[class='chosen-select'][name='child[assigned_user_names][]']")
  end
end
