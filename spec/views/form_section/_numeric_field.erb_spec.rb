require 'rails_helper'

describe "form_section/_numeric_field.html.erb" do
  before :each do
    @child = Child.new("_id" => "id12345", "name" => "First Last", "new field" => "")
    assigns[:child] = @child
  end

  it "should include image for tooltip when help text when exists" do
    numeric_field = Field.new :name => "new field",
    :display_name => "field name",
    :type => 'numeric_field',
    :help_text => "This is my help text"

    numeric_field.should_receive(:form).and_return(FormSection.new("name" => "form_section"))
    render :partial => 'form_section/numeric_field', :locals => { :numeric_field => numeric_field, :formObject => @child }, :formats => [:html], :handlers => [:erb]
    rendered.should have_tag("p.help")
  end

  it "should not include image for tooltip when help text not exists" do
    numeric_field = Field.new :name => "new field",
    :display_name => "field name",
    :type => 'numeric_field'

    numeric_field.should_receive(:form).and_return(FormSection.new("name" => "form_section"))
    render :partial => 'form_section/numeric_field', :locals => { :numeric_field => numeric_field, :formObject => @child }, :formats => [:html], :handlers => [:erb]
    rendered.should_not have_tag("p.help")
  end

end
