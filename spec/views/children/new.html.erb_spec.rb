require 'spec_helper'

describe "children/new.html.erb" do

  before :each do
    @form_section = FormSection.new({
        :unique_id => "section_name",
        :order_form_group => 40,
        :order => 80,
        :order_subform => 0,
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
end
