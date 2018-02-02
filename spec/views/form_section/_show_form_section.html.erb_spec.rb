require 'rails_helper'

describe "form_section/_show_form_section.html.erb" do
  before :each do
    Child.all.each &:destroy
    FormSection.all.select{
      |fs| ['form_section_test_1', 'nested_subform_section_1',
            'nested_subform_section_2', 'nested_subform_section_3'].include?(fs.unique_id)
    }.each &:destroy

    fields_subform = [
      Field.new({"name" => "field_name_1",
                 "type" => "text_field",
                 "display_name_all" => "Field Name 1"
               }),
      #This field will not show because marked as not visible.
      Field.new({"name" => "field_name_7",
                 "type" => "text_field",
                 "display_name_all" => "Field Name 7",
                 "visible" => false,
               }),
      #This field will not show because marked as hide in the show.
      Field.new({"name" => "field_name_8",
                 "type" => "text_field",
                 "display_name_all" => "Field Name 8",
                 "hide_on_view_page" => true
               })
    ]
    subform_section = FormSection.new({
        "visible"=>false,
        "is_nested"=>true,
        :order_form_group => 50,
        :order => 10,
        :order_subform => 1,
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
        :unique_id=>"nested_subform_section_2",
        :parent_form=>"case",
        "editable"=>true,
        :fields => fields_subform_2,
        :initial_subforms => 1,
        "name_all" => "Nested Subform Section 2",
        "description_all" => "Details Nested Subform Section 2"
    })
    subform_section_2.save!
    fields_subform_3 = [
      Field.new({"name" => "field_name_6",
                 "type" => "text_field",
                 "display_name_all" => "Field Name 6"
               })
    ]
    subform_section_3 = FormSection.new({
        "visible"=>false,
        "is_nested"=>true,
        :order_form_group => 50,
        :order => 11,
        :order_subform => 3,
        :unique_id=>"nested_subform_section_3",
        :parent_form=>"case",
        "editable"=>true,
        :fields => fields_subform_3,
        :initial_subforms => 1,
        "name_all" => "Nested Subform Section 3",
        "description_all" => "Details Nested Subform Section 3"
    })
    subform_section_3.save!
    fields = [
      Field.new({"name" => "field_name_3",
                 "type" => "text_field",
                 "display_name_all" => "Field Name 3"
                }),
      #This field will not show because marked as not visible.
      Field.new({"name" => "field_name_4",
                 "type" => "text_field",
                 "display_name_all" => "Field Name 4",
                 "visible" => false
                }),
      #This field will not show because marked as hide in the show.
      Field.new({"name" => "field_name_5",
                 "type" => "text_field",
                 "display_name_all" => "Field Name 5",
                 "hide_on_view_page" => true
                }),
      Field.new({"name" => "subform_section_1",
                 "type" => "subform",
                 "editable" => true,
                 "subform_section_id" => subform_section.unique_id,
                 "display_name_all" => "Subform One"
                }),
      Field.new({"name" => "subform_section_2",
                 "type" => "subform",
                 "editable" => true,
                 "subform_section_id" => subform_section_2.unique_id,
                 "display_name_all" => "Subform Two"
                }),
      #This field will not show because marked as hide in the show.
      Field.new({"name" => "subform_section_3",
                 "type" => "subform",
                 "editable" => true,
                 "subform_section_id" => subform_section_3.unique_id,
                 "display_name_all" => "Subform Three",
                 "hide_on_view_page" => true
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

    Child.refresh_form_properties

    @formObject = Child.new({
      :hidden_name => false,
      :field_name_3 => "Field Name 3 Test Name",
      :field_name_4 => "Field Name 4 Test Name",
      :field_name_5 => "Field Name 5 Test Name",
      "subform_section_1" => [{
        "unique_id" => "1",
        "field_name_1" => "Field Name 1 Test Name",
        "field_name_7" => "Field Name 7 Test Name",
        "field_name_8" => "Field Name 8 Test Name"
      }],
      "subform_section_2" => [{
        "unique_id" => "2",
        "field_name_2" => "Field Name 2 Test Name"
      }],
      "subform_section_3" => [{
        "unique_id" => "3",
        "field_name_6" => "Field Name 6 Test Name"
      }]
    })

    @formObject.save!
  end

  after :each do
    Child.remove_form_properties
    Child.all.each &:destroy
  end

  it "Should display fields visible=true and fields hide_on_view_page=false" do
    form = FormSection.get_by_unique_id("form_section_test_1")
    assign(:form_sections, {"Form Section Test" => [form]})
    render :partial => 'form_section/show_form_section',
           :locals => { :formObject => @formObject, :lookups => @lookups },
           :formats => [:html], :handlers => [:erb]

    rendered.should match(/<fieldset id='tab_form_section_test_1' class='form_section_test_1 tab no-border ' data-first-tab="false">/)
    rendered.should match(/<label class="key field_name_3">Field Name 3<\/label>/)
    rendered.should match(/Field Name 3 Test Name/)

    #Field marked as not visible should not display on the show page.
    rendered.should_not match(/<label class="key field_name_4">Field Name 4<\/label>/)
    rendered.should_not match(/Field Name 4 Test Name/)

    #Field marked as hide on the show page, so should not appears.
    rendered.should_not match(/<label class="key field_name_5">Field Name 5<\/label>/)
    rendered.should_not match(/Field Name 5 Test Name/)

    rendered.should match(/<fieldset id="subform_subform_section_1_0" class="subform_section_1 subform no-border">/)
    rendered.should match(/<label class="key" for="subform_section_1">Subform One<\/label>/)
    rendered.should match(/<label class="key field_name_1">Field Name 1<\/label>/)
    rendered.should match(/Field Name 1 Test Name/)

    #Field marked as not visible should not display on the show page.
    rendered.should_not match(/<label class="key field_name_7">Field Name 7<\/label>/)
    rendered.should_not match(/Field Name 7 Test Name/)

    #Field marked as hide on the show page, so should not appears.
    rendered.should_not match(/<label class="key field_name_8">Field Name 8<\/label>/)
    rendered.should_not match(/Field Name 8 Test Name/)

    rendered.should match(/<fieldset id="subform_subform_section_2_0" class="subform_section_2 subform no-border">/)
    rendered.should match(/<label class="key" for="subform_section_2">Subform Two<\/label>/)
    rendered.should match(/<label class="key field_name_2">Field Name 2<\/label>/)
    rendered.should match(/Field Name 2 Test Name/)

    #Subform marked as hide on the show page, so should not appears.
    rendered.should_not match(/<fieldset id="subform_subform_section_3_0" class="subform_section_3 subform no-border">/)
    rendered.should_not match(/<label class="key" for="subform_section_3">Subform Three<\/label>/)
    rendered.should_not match(/<label class="key field_name_6">Field Name 6<\/label>/)
    rendered.should_not match(/Field Name 6 Test Name/)
  end

end
