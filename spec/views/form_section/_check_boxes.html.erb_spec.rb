require 'spec_helper'

describe "form_section/_check_boxes.html.erb" do
  before :each do
    @child = Child.new("_id" => "id12345", "name" => "First Last", "new field" => "Yes")
    assigns[:child] = @child
  end

	it "should include image for tooltip when help text exists" do
    check_boxes = Field.new :name => "new field",
    :display_name => "field name",
    :type => Field::CHECK_BOXES,
    :help_text => "This is my help text",
    :option_strings => ["FOO", "BAR"]

    check_boxes.should_receive(:form).exactly(3).times.and_return(FormSection.new("name" => "form_section"))
    render :partial => 'form_section/check_boxes', :locals => { :check_boxes => check_boxes, :formObject => @child }, :formats => [:html], :handlers => [:erb]

    rendered.should have_tag("p.help")
  end

	it "should not include image for tooltip when help text does not exist" do
    check_boxes = Field.new :name => "new field",
    :display_name => "field name",
    :type => Field::CHECK_BOXES,
		:option_strings => ["FOO", "BAR"]

    check_boxes.should_receive(:form).exactly(3).times.and_return(FormSection.new("name" => "form_section"))
    render :partial => 'form_section/check_boxes', :locals => { :check_boxes => check_boxes, :formObject => @child }, :formats => [:html], :handlers => [:erb]

    rendered.should_not have_tag("p.help")
  end

end
