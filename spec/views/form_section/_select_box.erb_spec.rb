require 'rails_helper'

describe "form_section/_select_box.html.erb" do
  before :each do
    @child = Child.new("_id" => "id12345", "name" => "First Last", "new field" => "")
    assigns[:child] = @child
  end

  it "should include image for tooltip when help text exists" do
    select_box = Field.new :name => "new field",
    :display_name => "field name",
    :type => 'select_box',
    :option_strings_text_all => Array['Male Test', 'Female Test'],
    :help_text => "This is my help text"

    select_box.should_receive(:form).and_return(FormSection.new("name" => "form_section"))
    render :partial => 'form_section/select_box', :locals => { :select_box => select_box, :formObject => @child}, :formats => [:html], :handlers => [:erb]

    expect(rendered).to match(/<label class="key inline" for="formsection_child_new_field">field name<\/label>/)
    expect(rendered).to match(/<select class="chosen-select " data-abide-ignore="" data-field-tags="\[\]" data-placeholder="\(Select...\)" data-populate="null" data-value="" id="formsection_child_new_field" is_disabled="false" name="child\[new field\]">/)
    expect(rendered).to match(/<option value="male_test">Male Test<\/option>/)
    expect(rendered).to match(/<option value="female_test">Female Test<\/option>/)
    expect(rendered).to match(/<p class="help">This is my help text<\/p>/)
  end

  it "should have 'is_disabled=true' when is disabled" do
    select_box = Field.new :name => "new field",
    :display_name => "field name",
    :type => 'select_box'
    select_box.disabled = true

    select_box.should_receive(:form).and_return(FormSection.new("name" => "form_section"))
    render :partial => 'form_section/select_box', :locals => { :select_box => select_box, :formObject => @child, :is_subform => true }, :formats => [:html], :handlers => [:erb]
    expect(rendered).to include('is_disabled="true"')
  end

  it "should have 'is_disabled=false' when is not disabled" do
    select_box = Field.new :name => "new field",
    :display_name => "field name",
    :type => 'select_box'
    select_box.disabled = false

    select_box.should_receive(:form).and_return(FormSection.new("name" => "form_section"))
    render :partial => 'form_section/select_box', :locals => { :select_box => select_box, :formObject => @child, :is_subform => true }, :formats => [:html], :handlers => [:erb]
    expect(rendered).to include('is_disabled="false"')
  end

  it "should have 'disable' attribute when is_subform even if disabled is false" do
    select_box = Field.new :name => "new field",
    :display_name => "field name",
    :type => 'select_box'
    select_box.disabled = false

    select_box.should_receive(:form).and_return(FormSection.new("name" => "form_section"))
    render :partial => 'form_section/select_box', :locals => { :select_box => select_box, :formObject => @child, :is_subform => true }, :formats => [:html], :handlers => [:erb]
    expect(rendered).to include('disabled="disabled"')
  end

end
