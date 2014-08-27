  require 'spec_helper'

describe "children/edit.html.erb" do

  before :each do
    @form_section = FormSection.new({
        :unique_id => "section_name",
        :visible => "true",
        :order_form_group => 40,
        :order => 80,
        :order_subform => 0,
        :form_group_name => "Test Group"
      })
    assign(:form_sections,[@form_section].group_by{|e| e.form_group_name})
    User.stub(:find_by_user_name).with("me").and_return(double(:organisation => "stc"))
    @child = Child.create(:name => "name", :unique_identifier => '12341234123', :created_by => "me")
    assign(:child, @child)
    @user = User.new
    @user.stub(:permissions => Permission::USERS[:create_and_edit])
    controller.stub(:current_user).and_return(@user)
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
end
