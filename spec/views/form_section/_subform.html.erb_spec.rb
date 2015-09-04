require 'spec_helper'

describe "Subform display_name" do
  before :each do
    FormSection.all.select{
      |fs| ['form_section_test_1', 'subform_section_1', 'subform_section_2'].include?(fs.unique_id)
    }.each &:destroy

    fields_subform = [
      Field.new({"name" => "field_name_1",
                 "type" => "text_field",
                 "display_name_all" => "Field Name 1"
               })
    ]
    subform_section = FormSection.new({
        "visible"=>false,
        "is_nested"=>true,
        :order_form_group => 50,
        :order => 10,
        :order_subform => 1,
        :unique_id=>"subform_section_1",
        :parent_form=>"case",
        "editable"=>true,
        :fields => fields_subform,
        :initial_subforms => 1,
        "name_all" => "Nested Subform Section 1",
        "description_all" => "Details Nested Subform Section 1"
    })
    subform_section.save!
    fields_subform_2 = [
      Field.new({"name" => "field_name_2",
                 "type" => "text_field",
                 "display_name_all" => "Field Name 2"
               })
    ]
    subform_section_2 = FormSection.new({
        "visible"=>false,
        "is_nested"=>true,
        :order_form_group => 50,
        :order => 10,
        :order_subform => 2,
        :unique_id=>"subform_section_2",
        :parent_form=>"case",
        "editable"=>true,
        :fields => fields_subform_2,
        :initial_subforms => 1,
        "name_all" => "Nested Subform Section 2",
        "description_all" => "Details Nested Subform Section 2"
    })
    subform_section_2.save!
    fields = [
      Field.new({"name" => "field_name_3",
                 "type" => "text_field",
                 "display_name_all" => "Field Name 3"
                }),
      Field.new({"name" => "subform_section_1",
                 "type" => "subform",
                 "editable" => true,
                 "subform_section_id" => subform_section.unique_id,
                 "display_name_all" => "First of the Subforms"
                }),
      Field.new({"name" => "subform_section_2",
                 "type" => "subform",
                 "editable" => true,
                 "subform_section_id" => subform_section_2.unique_id,
                 "display_name_all" => "Another Subform"
                })
    ]
    form = FormSection.new(
      :unique_id => "form_section_test_1",
      :parent_form=>"case",
      "visible" => true,
      :order_form_group => 51,
      :order => 16,
      :order_subform => 0,
      :form_group_name => "Form Section Test",
      "editable" => true,
      "name_all" => "Form Section Test 1",
      "description_all" => "Form Section Test 1",
      :fields => fields
    )
    form.save!

    @formObject = Child.new({
      :hidden_name => false,
      :subform_section_1 => [{
        "unique_id" => "1",
        "field_name_1" => "Field Name 1 Test Name"
      }],
      :subform_section_2 => [{
        "unique_id" => "2",
        "field_name_2" => "Field Name 2 Test Name"
      }]
    })
  end

  after :each do
    FormSection.all.select{
      |fs| ['form_section_test_1', 'subform_section_1', 'subform_section_2'].include?(fs.unique_id)
    }.each &:destroy
  end

  describe "form_section/_field_display_subform.html.erb" do
    it "should use field display_name value as is" do
      form = FormSection.get_by_unique_id("form_section_test_1")
      render :partial => 'form_section/field_display_subform',
             :locals =>
                {
                 :field => form.fields[1],
                 :formObject => @formObject,
                 :form_group_name => form.form_group_name
                },
             :formats => [:html], :handlers => [:erb]
       #The value should not be singularize.
       rendered.should match(/<label class="key" for="subform_section_1">First of the Subforms<\/label>/)

       render :partial => 'form_section/field_display_subform',
                 :locals =>
                    {
                     :field => form.fields[2],
                     :formObject => @formObject,
                     :form_group_name => form.form_group_name
                    },
                 :formats => [:html], :handlers => [:erb]
       rendered.should match(/<label class="key" for="subform_section_2">Another Subform<\/label>/)
    end

  end

  describe "form_section/_subform_expand_collapse_header.html.erb" do
    it "should use field display_name value as is" do
      form = FormSection.get_by_unique_id("form_section_test_1")
      subform_section = FormSection.get_by_unique_id("subform_section_1")
      render :partial => 'form_section/subform_expand_collapse_header',
             :locals =>
                {
                 :subform => form.fields[1],
                 :subform_section => subform_section,
                 :formObject => @formObject,
                 :form_group_name => form.form_group_name,
                 :i => 0
                },
             :formats => [:html], :handlers => [:erb]
       #The value should not be singularize.
       rendered.should match(/<label class="key" for="subform_section_1">First of the Subforms<\/label>/)

       subform_section = FormSection.get_by_unique_id("subform_section_2")
       render :partial => 'form_section/subform_expand_collapse_header',
             :locals =>
                {
                 :subform => form.fields[2],
                 :subform_section => subform_section,
                 :formObject => @formObject,
                 :form_group_name => form.form_group_name,
                 :i => 0
                },
             :formats => [:html], :handlers => [:erb]
       rendered.should match(/<label class="key" for="subform_section_2">Another Subform<\/label>/)
    end

  end

end
