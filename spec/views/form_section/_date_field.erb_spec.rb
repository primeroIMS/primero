require 'spec_helper'

describe "form_section/_date_field.html.erb" do
  before :each do
    @child = Child.new("_id" => "id12345", "name" => "First Last", "new field" => "")
    assigns[:child] = @child
  end

  xit "should include image for tooltip when help text exists" do
    date_field = Field.new :name => "new field",
    :display_name => "field name",
    :type => 'date_field',
    :help_text => "This is my help text"

    date_field.should_receive(:form).and_return(FormSection.new("name" => "form_section"))
    render :partial => 'form_section/date_field', :locals => { :date_field => date_field, :formObject => @child  }, :formats => [:html], :handlers => [:erb]
    rendered.should have_tag("p.help")
  end

  it "should have 'is_disabled=true' when is disabled" do
    date_field = Field.new :name => "new field",
    :display_name => "field name",
    :type => 'date_field'
    date_field.disabled = true

    date_field.should_receive(:form).and_return(FormSection.new("name" => "form_section"))
    render :partial => 'form_section/date_field', :locals => { :date_field => date_field, :formObject => @child, :is_subform => true }, :formats => [:html], :handlers => [:erb]
    expect(rendered).to include('is_disabled="true"')
  end

  it "should have 'is_disabled=false' when is not disabled" do
    date_field = Field.new :name => "new field",
    :display_name => "field name",
    :type => 'date_field'
    date_field.disabled = false

    date_field.should_receive(:form).and_return(FormSection.new("name" => "form_section"))
    render :partial => 'form_section/date_field', :locals => { :date_field => date_field, :formObject => @child, :is_subform => true }, :formats => [:html], :handlers => [:erb]
    expect(rendered).to include('is_disabled="false"')
  end

  it "should have 'disable' attribute when is_subform even if disabled is false" do
    date_field = Field.new :name => "new field",
    :display_name => "field name",
    :type => 'date_field'
    date_field.disabled = false

    date_field.should_receive(:form).and_return(FormSection.new("name" => "form_section"))
    render :partial => 'form_section/date_field', :locals => { :date_field => date_field, :formObject => @child, :is_subform => true }, :formats => [:html], :handlers => [:erb]
    expect(rendered).to include('disabled="disabled"')
  end

  # Date fields now default to help text with format if no help text is provided, so date field will always have tag img.vtip
  # it "should not include image for tooltip when help text not exists" do
  #   date_field = Field.new :name => "new field",
  #   :display_name => "field name",
  #   :type => 'date_field'
  #   render :partial => 'form_section/date_field', :locals => { :date_field => date_field, :formObject => @child  }, :formats => [:html], :handlers => [:erb]
  #   rendered.should_not have_tag("img.vtip")
  # end


  ## This was moved to a js file
  # it "should configure the date picker date format" do
  #   date_field = Field.new :name => "new field",
  #                          :display_name => "field name",
  #                          :type => 'date_field',
  #                          :help_text => "This is my help text"
  #
  #   render :partial => 'form_section/date_field', :locals => { :date_field => date_field }, :formats => [:html], :handlers => [:erb]
  #   rendered.should be_include("dateFormat: 'dd/M/yy'")
  #
  # end
end
