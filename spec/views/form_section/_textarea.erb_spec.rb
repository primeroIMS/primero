require 'spec_helper'

describe "form_section/_textarea.html.erb" do
  before :each do
    @child = Child.new("_id" => "id12345", "name" => "First Last", "new field" => "")
    assigns[:child] = @child
  end

  it "should include image for tooltip when help text exists" do
    textarea = Field.new :name => "new field",
    :display_name => "field name",
    :type => 'textarea',
    :guiding_questions => ["What details can you give?"]

    textarea.should_receive(:form).and_return(FormSection.new("name" => "form_section"))
    render :partial => 'form_section/textarea', :locals => { :textarea => textarea, :formObject => @child}, :formats => [:html], :handlers => [:erb]
    rendered.should have_tag("div.gq_select")
  end

  it "should not include image for tooltip when help text not exists" do
    textarea = Field.new :name => "new field",
    :display_name => "field name",
    :type => 'textarea'

    textarea.should_receive(:form).and_return(FormSection.new("name" => "form_section"))
    render :partial => 'form_section/textarea', :locals => { :textarea => textarea, :formObject => @child}, :formats => [:html], :handlers => [:erb]
    rendered.should_not have_tag("div.gq_select")
  end

end
