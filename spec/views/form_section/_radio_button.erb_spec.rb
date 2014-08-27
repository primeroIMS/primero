require 'spec_helper'

describe "form_section/_radio_button.html.erb" do
  before :each do
    @child = Child.new("_id" => "id12345", "name" => "First Last", "new field" => "radio button group name")
    assigns[:child] = @child
  end

  it "should include image for tooltip when help text exists" do
    radio_button = Field.new :name => "new field",
    :display_name => "field name",
    :type => 'radio_button',
    :option_strings => Array['M', 'F'],
    :help_text => "This is my help text"

    radio_button.should_receive(:form).exactly(3).times.and_return(FormSection.new("name" => "form_section"))
    render :partial => 'form_section/radio_button', :locals => { :radio_button => radio_button, :formObject => @child}, :formats => [:html], :handlers => [:erb]
    rendered.should have_tag("img.vtip")
  end

  it "should not include image for tooltip when help text not exists" do
    radio_button = Field.new :name => "new field",
    :display_name => "field name",
    :type => 'radio_button',
    :option_strings => Array['M', 'F']

    radio_button.should_receive(:form).exactly(3).times.and_return(FormSection.new("name" => "form_section"))
    render :partial => 'form_section/radio_button', :locals => { :radio_button => radio_button, :formObject => @child}, :formats => [:html], :handlers => [:erb]
    rendered.should_not have_tag("img.vtip")
  end

end
