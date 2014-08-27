require 'spec_helper'

describe "form_section/_select_box.html.erb" do
  before :each do
    @child = Child.new("_id" => "id12345", "name" => "First Last", "new field" => "")
    assigns[:child] = @child
  end

  it "should include image for tooltip when help text exists" do
    select_box = Field.new :name => "new field",
    :display_name => "field name",
    :type => 'select_box',
    :option_strings => Array['M', 'F'],
    :help_text => "This is my help text"

    select_box.should_receive(:form).and_return(FormSection.new("name" => "form_section"))
    render :partial => 'form_section/select_box', :locals => { :select_box => select_box, :formObject => @child}, :formats => [:html], :handlers => [:erb]
    rendered.should have_tag("img.vtip")
  end

  it "should not include image for tooltip when help text not exists" do
    select_box = Field.new :name => "new field",
    :display_name => "field name",
    :type => 'select_box',
    :option_strings => Array['M', 'F']

    select_box.should_receive(:form).and_return(FormSection.new("name" => "form_section"))
    render :partial => 'form_section/select_box', :locals => { :select_box => select_box, :formObject => @child}, :formats => [:html], :handlers => [:erb]
    rendered.should_not have_tag("img.vtip")
  end

end
