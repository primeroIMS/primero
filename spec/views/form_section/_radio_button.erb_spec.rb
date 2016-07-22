require 'spec_helper'

describe "form_section/_radio_button.html.erb" do
  before :each do
    @child = Child.new("_id" => "id12345", "name" => "First Last", "new field" => "radio button group name")
    assigns[:child] = @child
  end

  it "should display radio button" do
    radio_button = Field.new :name => "new field",
        :display_name => "field name",
        :type => 'radio_button',
        :editable => true,
        :disabled => false,
        :option_strings => Array['M', 'F'],
        :help_text => "This is my help text"

    radio_button.should_receive(:form).exactly(3).times.and_return(FormSection.new("name" => "form_section"))
    render :partial => 'form_section/radio_button', :locals => { :radio_button => radio_button, :formObject => @child}, :formats => [:html], :handlers => [:erb]

    rendered.should match(/<input data-field-tags="\[\]" editable="true" id="formsection_child_new_field_m" name="child\[new field\]" type="radio" value="M" \/>/)
    rendered.should match(/<label for="formsection_child_new_field_m">M<\/label>/)
    rendered.should match(/<input data-field-tags="\[\]" editable="true" id="formsection_child_new_field_f" name="child\[new field\]" type="radio" value="F" \/>/)
    rendered.should match(/<label for="formsection_child_new_field_f">F<\/label>/)
    rendered.should match(/<p class="help">This is my help text<\/p>/)
  end

  #TODO remove this test case? for help field there is not image anymore.
  xit "should include image for tooltip when help text exists" do
    radio_button = Field.new :name => "new field",
    :display_name => "field name",
    :type => 'radio_button',
    :option_strings => Array['M', 'F'],
    :help_text => "This is my help text"

    radio_button.should_receive(:form).exactly(3).times.and_return(FormSection.new("name" => "form_section"))
    render :partial => 'form_section/radio_button', :locals => { :radio_button => radio_button, :formObject => @child}, :formats => [:html], :handlers => [:erb]
    rendered.should have_tag("img.vtip")
  end

  #TODO remove this test case? for help field there is not image anymore.
  xit "should not include image for tooltip when help text not exists" do
    radio_button = Field.new :name => "new field",
    :display_name => "field name",
    :type => 'radio_button',
    :option_strings => Array['M', 'F']

    radio_button.should_receive(:form).exactly(3).times.and_return(FormSection.new("name" => "form_section"))
    render :partial => 'form_section/radio_button', :locals => { :radio_button => radio_button, :formObject => @child}, :formats => [:html], :handlers => [:erb]
    rendered.should_not have_tag("img.vtip")
  end

end
