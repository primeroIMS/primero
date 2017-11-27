require 'rails_helper'

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
    rendered.should have_tag("a.gq_select_popovers")
  end

  it "should not include image for tooltip when help text not exists" do
    textarea = Field.new :name => "new field",
    :display_name => "field name",
    :type => 'textarea'

    textarea.should_receive(:form).and_return(FormSection.new("name" => "form_section"))
    render :partial => 'form_section/textarea', :locals => { :textarea => textarea, :formObject => @child}, :formats => [:html], :handlers => [:erb]
    rendered.should_not have_tag("a.gq_select_popovers")
  end

  it "should have 'is_disabled=true' when is disabled" do
    textarea = Field.new :name => "new field",
    :display_name => "field name",
    :type => 'textarea'
    textarea.disabled = true

    textarea.should_receive(:form).and_return(FormSection.new("name" => "form_section"))
    render :partial => 'form_section/textarea', :locals => { :textarea => textarea, :formObject => @child, :is_subform => true }, :formats => [:html], :handlers => [:erb]
    expect(rendered).to include('is_disabled="true"')
  end

  it "should have 'is_disabled=false' when is not disabled" do
    textarea = Field.new :name => "new field",
    :display_name => "field name",
    :type => 'textarea'
    textarea.disabled = false

    textarea.should_receive(:form).and_return(FormSection.new("name" => "form_section"))
    render :partial => 'form_section/textarea', :locals => { :textarea => textarea, :formObject => @child, :is_subform => true }, :formats => [:html], :handlers => [:erb]
    expect(rendered).to include('is_disabled="false"')
  end

  it "should have 'disable' attribute when is_subform even if disabled is false" do
    textarea = Field.new :name => "new field",
    :display_name => "field name",
    :type => 'textarea'
    textarea.disabled = false

    textarea.should_receive(:form).and_return(FormSection.new("name" => "form_section"))
    render :partial => 'form_section/textarea', :locals => { :textarea => textarea, :formObject => @child, :is_subform => true }, :formats => [:html], :handlers => [:erb]
    expect(rendered).to include('disabled="disabled"')
  end

end
