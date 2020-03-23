require 'rails_helper'

describe "_subform.html.erb" do
  before :each do
    Child.all.each &:destroy
    FormSection.all.select{
      |fs| ['form_section_test_1', 'nested_subform_section_1', 'nested_subform_section_2'].include?(fs.unique_id)
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
        #Make unique_id different from the field name in the form section.
        :unique_id=>"nested_subform_section_1",
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
        #Make unique_id different from the field name in the form section.
        :unique_id=>"nested_subform_section_2",
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
                 #The unique_id is different from the field name.
                 "subform_section_id" => subform_section.unique_id,
                 "display_name_all" => "First of the Subforms"
                }),
      Field.new({"name" => "subform_section_2",
                 "type" => "subform",
                 "editable" => true,
                 #The unique_id is different from the field name.
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
      :form_group_id => "form_section_test",
      "editable" => true,
      "name_all" => "Form Section Test 1",
      "description_all" => "Form Section Test 1",
      :fields => fields
    )
    form.save!

    Child.refresh_form_properties

    @formObject = Child.new({
      :hidden_name => false,
      #This should be the Field name in the FormSection not the subform unique_id
      "subform_section_1" => [{
        "unique_id" => "1",
        "field_name_1" => "Field Name 1 Test Name"
      }],
      #This should be the Field name in the FormSection not the subform unique_id
      "subform_section_2" => [{
        "unique_id" => "2",
        "field_name_2" => "Field Name 2 Test Name"
      }]
    })

    @formObject.save!
  end

  after :each do
    Child.remove_form_properties
    Child.all.each &:destroy
  end

  describe "form_section/_field_display_subform.html.erb" do
    it "should use field display_name value as is" do
      form = FormSection.get_by_unique_id("form_section_test_1")
      render :partial => 'form_section/field_display_subform',
             :locals =>
                {
                 :field => form.fields[1],
                 :formObject => @formObject,
                 :form_group_id => form.form_group_id,
                 :lookups => @lookups
                },
             :formats => [:html], :handlers => [:erb]
       #The value should not be singularize.
       rendered.should match(/<label class="key" for="subform_section_1">First of the Subforms<\/label>/)

       render :partial => 'form_section/field_display_subform',
              :locals =>
                 {
                  :field => form.fields[2],
                  :formObject => @formObject,
                  :form_group_id => form.form_group_id,
                  :lookups => @lookups
                 },
              :formats => [:html], :handlers => [:erb]
       rendered.should match(/<label class="key" for="subform_section_2">Another Subform<\/label>/)
    end

    it "should use field name to retrieve the subform information" do
      form = FormSection.get_by_unique_id("form_section_test_1")
      render :partial => 'form_section/field_display_subform',
             :locals =>
                {
                 :field => form.fields[1],
                 :formObject => @formObject,
                 :form_group_id => form.form_group_id,
                 :lookups => @lookups
                },
             :formats => [:html], :handlers => [:erb]
       rendered.should match(/<div id="subform_section_1" class="subforms"  data-form_group_id="">/)
       #formObject should contains an hash "subform_section_1" which is the field name instead the subform unique_id
       #With that in mind will generate the next bunch of elements.
       rendered.should match(/<label class="key field_name_1">Field Name 1<\/label>/)
       rendered.should match(/Field Name 1 Test Name/)

       render :partial => 'form_section/field_display_subform',
                 :locals =>
                    {
                     :field => form.fields[2],
                     :formObject => @formObject,
                     :form_group_id => form.form_group_id,
                     :lookups => @lookups
                    },
                 :formats => [:html], :handlers => [:erb]
       rendered.should match(/<div id="subform_section_2" class="subforms"  data-form_group_id="">/)
       #formObject should contains an hash "subform_section_2" which is the field name instead the subform unique_id
       #With that in mind will generate the next bunch of elements.
       rendered.should match(/<label class="key field_name_2">Field Name 2<\/label>/)
       rendered.should match(/Field Name 2 Test Name/)
    end

  end

  describe "form_section/_subform_expand_collapse_header.html.erb" do
    it "should use field display_name value as is" do
      form = FormSection.get_by_unique_id("form_section_test_1")
      subform_section = FormSection.get_by_unique_id("nested_subform_section_1")
      render :partial => 'form_section/subform_expand_collapse_header',
             :locals =>
                {
                 :subform => form.fields[1],
                 :subform_section => subform_section,
                 :formObject => @formObject,
                 :form_group_id => form.form_group_id,
                 :grouped_subforms_header => nil,
                 :i => 0
                },
             :formats => [:html], :handlers => [:erb]
       #The value should not be singularize.
       rendered.should match(/<label class="key" for="subform_section_1">First of the Subforms<\/label>/)

       subform_section = FormSection.get_by_unique_id("nested_subform_section_2")
       render :partial => 'form_section/subform_expand_collapse_header',
             :locals =>
                {
                 :subform => form.fields[2],
                 :subform_section => subform_section,
                 :formObject => @formObject,
                 :form_group_id => form.form_group_id,
                 :grouped_subforms_header => nil,
                 :i => 0
                },
             :formats => [:html], :handlers => [:erb]
       rendered.should match(/<label class="key" for="subform_section_2">Another Subform<\/label>/)
     end
  end

  describe "form_section/_subform.html.erb" do
    it "should use field name to retrieve the subform information" do
      form = FormSection.get_by_unique_id("form_section_test_1")
      subform_section = FormSection.get_by_unique_id("nested_subform_section_1")
      render :partial => 'form_section/subform',
             :locals =>
                {
                 :subform => form.fields[1],
                 :formObject => @formObject,
                 :form_group_id => form.form_group_id,
                 :grouped_subforms_header => nil,
                },
             :formats => [:html], :handlers => [:erb]
      expect(rendered).to have_selector('div', id: 'subform_section_1')
      expect(rendered).to have_selector('div', id: 'subform_container_subform_section_1_0')
      expect(rendered).to have_selector('fieldset', id: 'subform_subform_section_1_0')
      expect(rendered).to have_selector('input', id: 'nested_subform_section_1_child_subform_section_1_0_field_name_1')
      expect(rendered).to have_tag("input[type='hidden'][name='child[subform_section_1][0][unique_id]']")
      rendered.should match(/<label class="key inline" for="nested_subform_section_1_child_subform_section_1_0_field_name_1">Field Name 1<\/label>/)

      subform_section = FormSection.get_by_unique_id("nested_subform_section_2")
      render :partial => 'form_section/subform',
             :locals =>
                {
                 :subform => form.fields[2],
                 :formObject => @formObject,
                 :form_group_id => form.form_group_id,
                 :grouped_subforms_header => nil,
                },
             :formats => [:html], :handlers => [:erb]
      expect(rendered).to have_selector('div', id: 'subform_section_2')
      expect(rendered).to have_selector('div', id: 'subform_container_subform_section_2_0')
      expect(rendered).to have_selector('fieldset', id: 'subform_subform_section_2_0')
      expect(rendered).to have_selector('input', id: 'nested_subform_section_2_child_subform_section_2_0_field_name_2')
      expect(rendered).to have_tag("input[type='hidden'][name='child[subform_section_2][0][unique_id]']")
      rendered.should match(/<label class="key inline" for="nested_subform_section_2_child_subform_section_2_0_field_name_2">Field Name 2<\/label>/)
    end

  end

end
