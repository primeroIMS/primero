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

  it "should have 'is_disabled=true' when is disabled" do
    check_boxes = Field.new :name => "new field",
    :display_name => "field name",
    :type => 'check_boxes',
    :option_strings => ["FOO", "BAR"]
    check_boxes.disabled = true

    check_boxes.should_receive(:form).exactly(3).times.and_return(FormSection.new("name" => "form_section"))
    render :partial => 'form_section/check_boxes', :locals => { :check_boxes => check_boxes, :formObject => @child, :is_subform => true }, :formats => [:html], :handlers => [:erb]
    expect(rendered).to include('is_disabled="true"')
  end

  it "should have 'is_disabled=false' when is not disabled" do
    check_boxes = Field.new :name => "new field",
    :display_name => "field name",
    :type => 'check_boxes',
    :option_strings => ["FOO", "BAR"]
    check_boxes.disabled = false

    check_boxes.should_receive(:form).exactly(3).times.and_return(FormSection.new("name" => "form_section"))
    render :partial => 'form_section/check_boxes', :locals => { :check_boxes => check_boxes, :formObject => @child, :is_subform => true }, :formats => [:html], :handlers => [:erb]
    expect(rendered).to include('is_disabled="false"')
  end

  it "should have 'disable' attribute when is_subform even if disabled is false" do
    check_boxes = Field.new :name => "new field",
    :display_name => "field name",
    :type => 'check_boxes',
    :option_strings => ["FOO", "BAR"]
    check_boxes.disabled = false

    check_boxes.should_receive(:form).exactly(3).times.and_return(FormSection.new("name" => "form_section"))
    render :partial => 'form_section/check_boxes', :locals => { :check_boxes => check_boxes, :formObject => @child, :is_subform => true }, :formats => [:html], :handlers => [:erb]
    expect(rendered).to include('disabled="disabled"')
  end

end
