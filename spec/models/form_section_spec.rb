# -*- coding: utf-8 -*-
require 'rails_helper'

describe FormSection do
  before :each do
    [
      Field, FormSection, PrimeroModule,
      PrimeroProgram, Role, Lookup
    ].each(&:destroy_all)

    @lookup = Lookup.create!(:unique_id => "lookup-form-group-cp-case",
                             :name => "Form Group CP Case",
                             :lookup_values_en => [{id: "m", display_text: "M"}.with_indifferent_access,
                                                   {id: "x", display_text: "X"}.with_indifferent_access,
                                                   {id: "y", display_text: "Y"}.with_indifferent_access]
    )

    @form_section_a = FormSection.create!(unique_id: "A", name: "A", parent_form: 'case', form_group_id: "m")
    @form_section_b = FormSection.create!(unique_id: "B", name: "B", parent_form: 'case', form_group_id: "x")
    @form_section_c = FormSection.create!(unique_id: "C", name: "C", parent_form: 'case', form_group_id: "y")
    @primero_program = PrimeroProgram.create!(unique_id: 'some_program', name_en: "Some program")
    @primero_module = PrimeroModule.create!(primero_program: @primero_program, name: "Test Module", associated_record_types: ['case'], form_sections: [@form_section_a, @form_section_b])
    @permission_case_read = Permission.new(resource: Permission::CASE, actions: [Permission::READ])
    @role = Role.create!(form_sections: [@form_section_b, @form_section_c], name: "Test Role", permissions: [@permission_case_read])
    @user = User.new(user_name: "test_user", role: @role, module_ids: [@primero_module.id])
  end

  def create_formsection(stubs={})
    stubs.reverse_merge!(:fields=>[], :editable => true)
    @create_formsection = FormSection.new stubs
    @create_formsection.save
    @create_formsection
  end

  def new_field(fields = {})
    fields.reverse_merge!(:name=> "name_#{random_string}", :display_name=> "display_name_#{random_string}")
    Field.new fields
  end

  def random_string(length=10)
    #hmmm
    chars = 'abcdefghjkmnpqrstuvwxyz23456789'
    password = ''
    length.times { password << chars[rand(chars.size)] }
    password
  end

  def new_should_be_called_with (name, value)
    FormSection.should_receive(:new) { |form_section_hash|
      form_section_hash[name].should == value
    }
  end

  describe "mobile forms" do
    before do
      [
        Field, FormSection, PrimeroModule,
        PrimeroProgram, Role, Lookup
      ].each(&:destroy_all)
      @form_section_mobile_1_nested = FormSection.create!(unique_id: "MOBILE_1_NESTED", name: "Mobile 1 Nested",
                                                          parent_form: "case", mobile_form: false, is_nested: true, visible: false,
                                                          fields: [Field.new(name: "field1", type: "text_field", display_name_all: "field1")])
      @form_section_mobile_1 = FormSection.create!(unique_id: "MOBILE_1", name: "Mobile 1", parent_form: "case", mobile_form: true,
                                                   fields: [Field.new(name: "mobile_1_nested", type: "subform",
                                                                      subform: @form_section_mobile_1_nested, display_name_all: "Mobile 1 Nested")])
      @mobile_field1 = Field.new(name: "field1", type: "text_field", display_name_all: "field1")
      @mobile_field2 = Field.new(name: "field2", type: "text_field", display_name_all: "field2", mobile_visible: true)
      @mobile_field3 = Field.new(name: "field3", type: "text_field", display_name_all: "field3", mobile_visible: false)
      @mobile_field4 = Field.new(name: "field4", type: "text_field", display_name_all: "field4", mobile_visible: false)
      @mobile_field5 = Field.new(name: "field5", type: "text_field", display_name_all: "field5")
      @form_section_mobile_2 = FormSection.create!(unique_id: "MOBILE_2", name: "Mobile 2", parent_form: "case", mobile_form: true,
                                                   fields: [@mobile_field1, @mobile_field2, @mobile_field3, @mobile_field4,
                                                            @mobile_field5])
      @primero_program = PrimeroProgram.create!(unique_id: 'some_program', name_en: "Some program")
      @mobile_module = PrimeroModule.create!(primero_program: @primero_program, name: "Mobile Module", associated_record_types: ['case'],
                                             form_sections: [@form_section_a, @form_section_b, @form_section_mobile_1])
      @roleM = Role.create!(form_sections: [@form_section_b, @form_section_c, @form_section_mobile_1], name: "Test Role Mobile", permissions: [@permission_case_read])
      @userM = User.new(user_name: "test_user_m", role: @roleM, module_ids: [@mobile_module.id])
    end

    describe "filter_for_subforms" do
      before do
        fs = @userM.permitted_forms(@mobile_module, 'case')
        @mobile_forms = fs.select(&:mobile_form)
      end
      it "returns only mobile forms" do
        expect(@mobile_forms).to include(@form_section_mobile_1)
      end

      it "does not return non-mobile forms" do
        expect(@mobile_forms).not_to include(@form_section_b)
      end
    end

    describe 'format_forms_for_mobile' do
      it 'formats for moble' do
        expected = {"Children"=>
                        [{"unique_id"=>"MOBILE_1",
                          :name=>{"en"=>"Mobile 1", "fr"=>"", "ar"=>"", "ar-LB"=>"", "so"=>"", "es"=>"", "bn"=>""},
                          "order"=>0,
                          :help_text=>{"en"=>"", "fr"=>"", "ar"=>"", "ar-LB"=>"", "so"=>"", "es"=>"", "bn"=>""},
                          "fields"=>
                              [{"name"=>"mobile_1_nested",
                                "disabled"=>false,
                                "multi_select"=>false,
                                "type"=>"subform",
                                "subform"=>{"unique_id"=>"MOBILE_1_NESTED",
                                            :name=>{"en"=>"Mobile 1 Nested", "fr"=>"", "ar"=>"", "ar-LB"=>"", "so"=>"", "es"=>"", "bn"=>""},
                                            "order"=>0, :help_text=>{"en"=>"", "fr"=>"", "ar"=>"", "ar-LB"=>"", "so"=>"", "es"=>"", "bn"=>""},
                                            "fields"=>
                                              [{"name"=>"field1",
                                                "disabled"=>false,
                                                "multi_select"=>false,
                                                "type"=>"text_field",
                                                "required"=>false,
                                                "option_strings_source"=>nil,
                                                "show_on_minify_form"=>false,
                                                "mobile_visible"=>true,
                                                :display_name=>{"en"=>"field1", "fr"=>"field1", "ar"=>"field1", "ar-LB"=>"field1", "so"=>"field1", "es"=>"field1", "bn"=>"field1"},
                                                :help_text=>{"en"=>"", "fr"=>"", "ar"=>"", "ar-LB"=>"", "so"=>"", "es"=>"", "bn"=>""},
                                                :option_strings_text=>{"en"=>[], "fr"=>[], "ar"=>[], "ar-LB"=>[], "so"=>[], "es"=>[], "bn"=>[]},
                                                "date_validation"=>"default_date_validation"}]
                                              },
                                "required"=>false,
                                "option_strings_source"=>nil,
                                "show_on_minify_form"=>false,
                                "mobile_visible"=>true,
                                :display_name=>{"en"=>"Mobile 1 Nested", "fr"=>"Mobile 1 Nested", "ar"=>"Mobile 1 Nested",
                                                "ar-LB"=>"Mobile 1 Nested", "so"=>"Mobile 1 Nested", "es"=>"Mobile 1 Nested",
                                                "bn"=>"Mobile 1 Nested"},
                                :help_text=>{"en"=>"", "fr"=>"", "ar"=>"", "ar-LB"=>"", "so"=>"", "es"=>"", "bn"=>""},
                                :option_strings_text=>{"en"=>[], "fr"=>[], "ar"=>[], "ar-LB"=>[], "so"=>[], "es"=>[], "bn"=>[]},
                                "date_validation"=>"default_date_validation"}]}]}
        form_sections = FormSection.group_forms([@form_section_mobile_1])
        expect(FormSection.format_forms_for_mobile(form_sections, :en, 'case')).to eq(expected)
      end
    end

    describe 'all_mobile_fields' do
      it 'returns the mobile visible fields' do
        #NOTE: The default of mobile_visible is true.
        expect(@form_section_mobile_2.all_mobile_fields).to include(@mobile_field1, @mobile_field2, @mobile_field5)
      end

      it 'does not return fields that are not mobile visible' do
        expect(@form_section_mobile_2.all_mobile_fields).not_to include(@mobile_field3, @mobile_field4)
      end
    end

  end

  describe "group_forms" do
    it "groups forms by the group name" do
      form_section_a = FormSection.new(unique_id: "A", name: "A", parent_form: 'case', form_group_id: "x")
      form_section_b = FormSection.new(unique_id: "B", name: "B", parent_form: 'case', form_group_id: "x")
      form_section_c = FormSection.new(unique_id: "C", name: "C", parent_form: 'case', form_group_id: "y")

      result = FormSection.group_forms([form_section_a, form_section_b, form_section_c])

      expect(result).to be_a Hash
      expect(result.keys).to match_array(["X", "Y"])
      expect(result["X"]).to match_array([form_section_a, form_section_b])
      expect(result["Y"]).to match_array([form_section_c])
    end
  end

  describe "link_subforms" do
    it "links forms to subforms if both are provided in the input list" do

      fields_a = [
        Field.new(name: "a_0", type: Field::TEXT_FIELD),
        Field.new(name: "a_1", type: Field::TEXT_FIELD)
      ]
      form_section_a = FormSection.new(unique_id: "A", name: "A", fields: fields_a, visible: false, is_nested: true)

      fields_b = [
        Field.new(name: "b_0", type: Field::TEXT_FIELD),
        Field.new(name: "b_1", type: Field::TEXT_FIELD)
      ]
      form_section_b = FormSection.new(unique_id: "B", name: "B", fields: fields_b)

      fields_c = [
        Field.new(name: "c_0", type: Field::TEXT_FIELD),
        Field.new(name: "c_1", type: Field::SUBFORM, subform: form_section_a)
      ]
      form_section_c = FormSection.new(unique_id: "C", name: "C", fields: fields_c)

      result = FormSection.link_subforms([form_section_a, form_section_b, form_section_c])
      result_subform_field = result.select{|f|f.unique_id=='C'}.first.fields.select{|f|f.name=='c_1'}.first

      expect(result).to be_an Array
      expect(result_subform_field.subform).to be_a FormSection
      expect(result_subform_field.subform.unique_id).to eq("A")
    end
  end


  describe '#unique_id' do
    it "should be generated when not provided" do
      f = FormSection.create!(name: 'test')
      f.unique_id.should_not be_empty
    end

    it "should not be generated when provided" do
      f = FormSection.new :unique_id => 'test_form'
      f.unique_id.should == 'test_form'
    end

    it "should not allow duplicate unique ids" do
      FormSection.new(:unique_id => "test", :name => "test").save!

      expect {
        FormSection.new(:unique_id => "test").save!
      }.to raise_error(ActiveRecord::RecordInvalid)

      expect {
        FormSection.find_by(unique_id: "test").save!
      }.to_not raise_error
    end
  end

  describe "add_field_to_formsection" do

    it "adds the field to the formsection" do
      field = build(:field)
      formsection = create_formsection(:name => "form_test", :fields => [new_field, new_field])
      FormSection.add_field_to_formsection(formsection, field)
      formsection.reload
      formsection.fields.length.should == 3
      formsection.fields.last.should == field
    end

    it "saves the formsection" do
      field = build(:field)
      formsection = create_formsection
      formsection.should_receive(:save)
      FormSection.add_field_to_formsection formsection, field
    end

    it "should raise an error if adding a field to a non editable form section" do
      field = new_field :name=>'field_one'
      formsection = FormSection.new :editable => false
      expect { FormSection.add_field_to_formsection(formsection, field) }.to raise_error(RuntimeError, 'Form section not editable')
    end

  end


  describe "add_textarea_field_to_formsection" do

    it "adds the textarea to the formsection" do
      field = build(:field, type: Field::TEXT_AREA)
      formsection = create_formsection(:name => "form_test", :fields => [new_field, new_field])
      FormSection.add_field_to_formsection(formsection, field)
      formsection.reload
      formsection.fields.length.should == 3
      formsection.fields.last.should == field
    end

    it "saves the formsection with textarea field" do
      field = build(:field, type: Field::TEXT_AREA)
      formsection = create_formsection
      formsection.should_receive(:save)
      FormSection.add_field_to_formsection formsection, field
    end

  end

  describe "add_select_drop_down_field_to_formsection" do

    it "adds the select drop down to the formsection" do
      field = build(:field, type: Field::SELECT_BOX, option_strings_text_all: [{"id"=>"test1", "display_text"=>"some,"}, {"id"=>"test2", "display_text"=>"test,"}])
      formsection = create_formsection(:name => "form_test", :fields => [new_field, new_field])
      FormSection.add_field_to_formsection(formsection, field)
      formsection.reload
      formsection.fields.length.should == 3
      formsection.fields.last.should == field
    end

    it "saves the formsection with select drop down field" do
      field = build(:field, type: Field::SELECT_BOX, option_strings_text_all: [{"id"=>"test1", "display_text"=>"some,"}, {"id"=>"test2", "display_text"=>"test,"}])
      formsection = create_formsection
      formsection.should_receive(:save)
      FormSection.add_field_to_formsection formsection, field
    end

  end

  describe "editable" do

    it "should be editable by default" do
      formsection = FormSection.new
      formsection.editable?.should be_truthy
    end

  end

  describe "delete_field" do
    it "should delete editable fields" do
      @field = new_field(:name=>"field3")
      @field.save!
      form_section = FormSection.new(:name => "form_test", :fields=>[@field])
      form_section.save!
      form_section.delete_field(@field.name)
      form_section.reload
      form_section.fields.should be_empty
    end

    it "should not delete uneditable fields" do
      @field = new_field(:name=>"field3", :editable => false)
      @field.save!
      form_section = FormSection.new(:name => "form_test", :fields=>[@field])
      form_section.save!
      expect {form_section.delete_field(@field.name)}.to raise_error(RuntimeError, 'Uneditable field cannot be deleted')
    end
  end

  describe "save fields in given order" do
    it "should save the fields in the given field name order" do
      @field_1 = new_field(:name => "orderfield1", :display_name => "orderfield1")
      @field_2 = new_field(:name => "orderfield2", :display_name => "orderfield2")
      @field_3 = new_field(:name => "orderfield3", :display_name => "orderfield3")
      form_section = FormSection.create! :name => "some_name", :fields => [@field_1, @field_2, @field_3]
      form_section.order_fields([@field_2.name, @field_3.name, @field_1.name])
      expect(@field_2.order).to eq(0)
      expect(@field_3.order).to eq(1)
      expect(@field_1.order).to eq(2)
    end
  end

  describe "new_custom" do
    it "should create a new form section" do
      form_section = FormSection.new_custom({:name => "basic"}, "GBV")
      expect(form_section.unique_id).to eq("gbv_basic")
    end

    #TODO - This needs to be tweaked and added back when the order and group order is fixed
    xit "should set the order to one plus maximum order value" do
      FormSection.stub(:by_order).and_return([FormSection.new(:order=>20), FormSection.new(:order=>10), FormSection.new(:order=>40)])
      new_should_be_called_with :order, 41
      FormSection.new_custom({:name => "basic"})
    end
  end

  describe "valid?" do
    it "should validate name is filled in" do
      form_section = FormSection.new()
      form_section.should_not be_valid
      form_section.errors[:name].should be_present
    end

    it "should not allows empty form names in form base_language " do
     form_section = FormSection.new(:name_en => 'English', :name_es=>'Chinese')
     I18n.default_locale = 'es'
     expect {
       form_section.name_en = ''
       form_section.save!
     }.to raise_error(ActiveRecord::RecordInvalid, 'Validation failed: Name errors.models.form_section.presence_of_name')
    end

    it "should validate name is alpha_num" do
      form_section = FormSection.new(:name=> "r@ndom name!")
      form_section.should_not be_valid
      form_section.errors[:name].should be_present
    end

    it "should not allow name with white spaces only" do
      form_section = FormSection.new(:name=> "     ")
      form_section.should_not be_valid
      form_section.errors[:name].should be_present
    end

    it "should allow arabic names" do
      #TODO for non english name the unique_id generation fail.
      form_section = FormSection.new(:name=>"العربية", :unique_id =>'test')
      form_section.should be_valid
      form_section.errors[:name].should_not be_present
    end

    it "should occur error about the name can't be blank" do
      form_section = FormSection.new(:name=>"")
      form_section.should_not be_valid
      form_section.errors[:unique_id].should be_present
    end

    it "should not trip the unique name validation on self" do
      form_section = FormSection.new(:name => 'Unique Name', :unique_id => 'unique_name')
      form_section.save!
    end

    context 'when changinging field type' do
      before do
        fields = [
            Field.new({"name" => "field_test_field_type_text",
                       "type" => Field::TEXT_FIELD,
                       "display_name_all" => "Field Test Field Type Text"
                      }),
            Field.new({"name" => "field_test_field_type_textarea",
                       "type" => Field::TEXT_AREA,
                       "display_name_all" => "Field Test Field Type Text Area"
                      }),
            Field.new({"name" => "field_test_field_type_select_box",
                       "type" => Field::SELECT_BOX,
                       "display_name_all" => "Field Test Field Type select box",
                       "option_strings_text" => [
                         { "id" =>"yes", "display_text" =>"Yes" },
                         { "id" => "no", "display_text" => "No" }
                       ]
                      })
        ]
        @form_field_type_test = FormSection.create(
            :unique_id => "form_section_test_field_type",
            :parent_form=>"case",
            "visible" => true,
            :order_form_group => 1,
            :order => 1,
            :order_subform => 0,
            :form_group_id => "m",
            "editable" => true,
            "name_all" => "Form Section Test 2",
            "description_all" => "Form Section Test 2",
            :fields => fields
        )
      end

      context 'from text field' do
        before do
          @changing_field = @form_field_type_test.fields.select{|fd| fd.type == Field::TEXT_FIELD}.first
        end

        context 'to textarea field' do
          before do
            @changing_field.type = Field::TEXT_AREA
          end

          it 'is valid' do
            expect(@form_field_type_test).to be_valid
          end
        end
      end

      context 'from textarea field' do
        before do
          @changing_field = @form_field_type_test.fields.select{|fd| fd.type == Field::TEXT_AREA}.first
        end

        context 'to text field' do
          before do
            @changing_field.type = Field::TEXT_FIELD
          end

          it 'is valid' do
            expect(@form_field_type_test).to be_valid
          end
        end
      end

    end
  end


  describe "Create FormSection Or Add Fields" do

    it "should create the FormSection if it does not exist" do
      form_section = FormSection.create_or_update_form_section(
        {"visible"=>true,
         :order=>11,
         :unique_id=>"tracing",
         "editable"=>true,
         "name_all" => "Tracing Name",
         "description_all" => "Tracing Description"
        })
      form_section.new_record?.should == false
      form_section.fields.length.should == 0
      form_section.visible.should == true
      form_section.order.should == 11
      form_section.editable.should == true
      form_section.name.should == "Tracing Name"
      form_section.description.should == "Tracing Description"
    end

    it "should not update the FormSection because it does exist" do
      #Create a new FormSection should not exists.
      form_section = FormSection.create_or_update_form_section(
        {"visible"=>true,
         :order=>11,
         :unique_id=>"tracing",
         "editable"=>true,
         "name_all" => "Tracing Name",
         "description_all" => "Tracing Description"
        })
      form_section.new_record?.should == false
      form_section.fields.length.should == 0
      form_section.visible.should == true
      form_section.order.should == 11
      form_section.editable.should == true
      form_section.name.should == "Tracing Name"
      form_section.description.should == "Tracing Description"

      #Attempt to create the same FormSection
      #Should not change any property.
      form_section_1 = FormSection.create_or_update_form_section(
        {"visible"=>false,
         :order=>12,
         :unique_id=>"tracing-name-all",
         "editable"=>false,
         "name_all" => "Tracing Name All",
         "description_all" => "Tracing Description All"
        })
      #Nothing change.
      form_section_1.new_record?.should == false
      form_section_1.fields.length.should == 0
      form_section_1.visible.should == false
      form_section_1.order.should == 12
      form_section_1.editable.should == false
      form_section_1.name.should == "Tracing Name All"
      form_section_1.description.should == "Tracing Description All"
    end

    it "should add fields if does not exist" do
      fields = [
        Field.new({"name" => "date_of_separation",
                   "type" => "date_field",
                   "display_name_all" => "Date of Separation"
                  })
      ]
      #Create a new FormSection should not exists.
      form_section = FormSection.create_or_update_form_section(
        {"visible"=>true,
         :order=>11,
         :unique_id=>"tracing",
         :fields => fields,
         "editable"=>true,
         "name_all" => "Tracing Name",
         "description_all" => "Tracing Description"
        })
      form_section.new_record?.should == false
      form_section.fields.length.should == 1
      form_section.visible.should == true
      form_section.order.should == 11
      form_section.editable.should == true
      form_section.name.should == "Tracing Name"
      form_section.description.should == "Tracing Description"

      fields_1 = [
        Field.new({"name" => "date_of_separation",
                   "type" => "date_field",
                   "display_name_all" => "Date of Separation All"
                  }),
        Field.new({"name" => "separation_cause",
                   "type" => Field::SELECT_BOX,
                   "display_name_all" => "What was the main cause of separation?",
                   "option_strings_text" => [
                     { "id" => "cause1", "display_text" => "Cause 1" },
                     { "id" => "cause2", "display_text" => "Cause 2" }
                   ]
                  })
      ]
      #Attempt to create a new section, no update form section
      #no update the existing field, but add the new field.
      form_section_1 = FormSection.create_or_update_form_section(
        {"visible"=>false,
         :order=>12,
         :unique_id=>"tracing-name-all",
          :fields => fields_1,
         "editable"=>false,
         "name_all" => "Tracing Name All",
         "description_all" => "Tracing Description All"
        })
      #nothing change
      form_section_1.new_record?.should == false
      form_section_1.fields.length.should == 2
      form_section_1.visible.should == false
      form_section_1.order.should == 12
      form_section_1.editable.should == false
      form_section_1.name.should == "Tracing Name All"
      form_section_1.description.should == "Tracing Description All"

      form_section_1.fields[0].name.should == "date_of_separation"
      form_section_1.fields[0].type.should == "date_field"
      form_section_1.fields[0].display_name.should == "Date of Separation All"

      #Check the new field.
      form_section_1.fields[1].name.should == "separation_cause"
      form_section_1.fields[1].type.should == "select_box"
      form_section_1.fields[1].display_name.should == "What was the main cause of separation?"
    end

    it "should create FormSection" do
      properties = {
        "visible"=>true,
        :order=>11,
        :unique_id=>"tracing",
        "editable"=>true,
        "name_all" => "Tracing Name",
        "description_all" => "Tracing Description",
      }
      new_form_section = FormSection.new
      new_form_section.should_not_receive(:save)
      new_form_section.should_not_receive(:attributes)
      #FormSection.should_receive(:get_by_unique_id).with("tracing").and_return(nil)
      FormSection.should_receive(:create!).with(properties).and_return(new_form_section)

      form_section = FormSection.create_or_update_form_section(properties)
      form_section.should == new_form_section
    end

    it "should add Field" do
      fields = [
        Field.new({"name" => "date_of_separation",
                   "type" => Field::TEXT_FIELD,
                   "display_name_all" => "Date of Separation All"
                  }),
        Field.new({"name" => "separation_cause",
                   "type" => Field::SELECT_BOX,
                   "display_name_all" => "What was the main cause of separation?",
                   "option_strings_source" => [
                     { "id" => "cause1", "display_text" => "Cause 1" },
                     { "id" => "cause2", "display_text" => "Cause 2" }
                   ]
                  })
      ]
      properties = {
        "visible"=>false,
        :order=>11,
        :unique_id=>"tracing",
        :fields => fields,
        "editable"=>true,
        "name_all" => "Tracing Name",
        "description_all" => "Tracing Description"
      }

      existing_form_section = FormSection.new
      existing_form_section.should_receive(:update_attributes).with(properties)
      FormSection.should_receive(:find_by).with(unique_id: "tracing").and_return(existing_form_section)

      form_section = FormSection.create_or_update_form_section(properties)
      form_section.should == existing_form_section
    end

  end

  describe "Fields with the same name" do
    before :each do
      subform_fields = [
        Field.new({"name" => "field_name_1",
                   "type" => Field::TEXT_FIELD,
                   "display_name_all" => "Field name 1"
                  })
      ]
      subform_section = FormSection.new({
          "visible"=>false,
          "is_nested"=>true,
          :order_form_group => 1,
          :order => 1,
          :order_subform => 1,
          :unique_id=>"subform_section_1",
          :parent_form=>"case",
          "editable"=>true,
          :fields => subform_fields,
          :initial_subforms => 1,
          "name_all" => "Nested Subform Section 1",
          "description_all" => "Details Nested Subform Section 1"
      })
      subform_section.save!

      fields = [
        Field.new({"name" => "field_name_2",
                   "type" => Field::TEXT_FIELD,
                   "display_name_all" => "Field Name 2"
                  }),
        Field.new({"name" => "field_name_3",
                   "type" => "subform",
                   "editable" => true,
                   "subform_section_id" => subform_section.id,
                   "display_name_all" => "Subform Section 1"
                  })
      ]
      form = FormSection.new(
        :unique_id => "form_section_test_1",
        :parent_form=>"case",
        "visible" => true,
        :order_form_group => 1,
        :order => 1,
        :order_subform => 0,
        :form_group_id => "m",
        "editable" => true,
        "name_all" => "Form Section Test 1",
        "description_all" => "Form Section Test 1",
        :fields => fields
      )
      form.save!
    end

    describe "Create Form Section" do
      xit "should not add field with different type" do
        #This field is a text_field in another form.
        fields = [
          Field.new({"name" => "field_name_2",
                     "type" => Field::SELECT_BOX,
                     "display_name_all" => "Field Name 2"
                    })
        ]
        form = FormSection.new(
          :unique_id => "form_section_test_2",
          :parent_form=>"case",
          "visible" => true,
          :order_form_group => 1,
          :order => 1,
          :order_subform => 0,
          :form_group_id => "m",
          "editable" => true,
          "name_all" => "Form Section Test 2",
          "description_all" => "Form Section Test 2",
          :fields => fields
        )
        form.save

        #There is other field with the same on other form section
        #so, we can't change the type.
        expect(form.fields.first.errors.messages[:fields]).to include("Can't change type of existing field 'field_name_2' on form 'Form Section Test 2'")
      end

      it "should allow fields with the same name on different subforms" do
        #This field exists in a different subforms, but should be possible
        #add with the same name and different type in another subform.
        subform_fields = [
          Field.new({"name" => "field_name_1",
                     "type" => "textarea",
                     "display_name_all" => "Field name 1"
                    })
        ]
        subform_section = FormSection.new({
            "visible"=>false,
            "is_nested"=>true,
            :order_form_group => 1,
            :order => 1,
            :order_subform => 1,
            :unique_id=>"subform_section_2",
            :parent_form=>"case",
            "editable"=>true,
            :fields => subform_fields,
            :initial_subforms => 1,
            "name_all" => "Nested Subform Section 2",
            "description_all" => "Details Nested Subform Section 2"
        })
        subform_section.save

        expect(subform_section.new_record?).to be_falsey
        expect(subform_section.fields.first.errors.messages[:name]).to be_blank
      end
   end

    describe "Edit Form Section" do
      before :each do
        subform_fields = [
          Field.new({"name" => "field_name_5",
                     "type" => "textarea",
                     "display_name_all" => "Field name 5"
                    })
        ]
        @subform_section = FormSection.new({
            "visible"=>false,
            "is_nested"=>true,
            :order_form_group => 1,
            :order => 1,
            :order_subform => 1,
            :unique_id=>"subform_section_3",
            :parent_form=>"case",
            "editable"=>true,
            :fields => subform_fields,
            :initial_subforms => 1,
            "name_all" => "Nested Subform Section 3",
            "description_all" => "Details Nested Subform Section 3"
        })
        @subform_section.save!

        fields = [
          Field.new({"name" => "field_name_4",
                     "type" => "textarea",
                     "display_name_all" => "Field Name 4"
                    }),
          Field.new({
            "name" => "field_name_2",
            "type" => Field::TEXT_FIELD,
            "display_name_all" => "Field Name 2"
          })
        ]
        @form = FormSection.new(
          :unique_id => "form_section_test_2",
          :parent_form=>"case",
          "visible" => true,
          :order_form_group => 1,
          :order => 1,
          :order_subform => 0,
          :form_group_id => "m",
          "editable" => true,
          "name_all" => "Form Section Test 2",
          "description_all" => "Form Section Test 2",
          :fields => fields
        )
        @form.save!
      end

      it "should not add field with different type" do
        #This field is a text_field in another form.
        @form.fields << Field.new({
          "name" => "field_name_2",
          "type" => Field::SELECT_BOX,
          "display_name_all" => "Field Name 2",
          "option_strings_text" => [{"id"=>"test1", "display_text"=>"test1,"}, {"id"=>"test2", "display_text"=>"test2,"}, {"id"=>"test3", "display_text"=>"test3"}]
        })
        @form.save.should be_falsey

        #There is other field with the same on other form section
        #so, we can't change the type.
        expect(@form.errors.full_messages.join).to eq("Fields is invalid")
      end

      it "should allow fields with the same name on different subforms" do
        field = @subform_section.fields.first
        #Match the name with this field on different subforms
        field.name = "field_name_1"

        #Save the record and check the status
        expect(@subform_section.save).to be_truthy
        expect(@subform_section.fields.first.errors.messages[:name]).to be_blank
      end
   end

  end

  describe "Violation forms" do
    before do
      [Field, FormSection].each(&:destroy_all)
      @violation = FormSection.create_or_update_form_section({
        unique_id: "sexual_violence",
        name: "sexual_violence",
      })
      fields = [
        Field.new({
          name: "field1",
          display_name_all: 'field1',
          type: "subform",
          subform: @violation
        })
      ]
      @wrapper_form = FormSection.create_or_update_form_section({
        :unique_id => "wrapper",
        :name => "wrapper",
        :fields => fields
      })
      @other_form = FormSection.create_or_update_form_section({
        unique_id: "other_form",
        name: "other_form",
      })
    end

    xit "identifies a violation form" do
      expect(@violation.is_violation?).to be_truthy
      expect(@other_form.is_violation?).to be_falsey
    end

    xit "identifies a violation wrapper" do
      expect(@wrapper_form.is_violation_wrapper?).to be_truthy
      expect(@other_form.is_violation_wrapper?).to be_falsey
    end

  end

  describe "localized_property_hash" do
    before do
      [Field, FormSection].each(&:destroy_all)

      fields = [
          Field.new({"name" => "field_name_1",
                     "type" => Field::TEXT_FIELD,
                     "display_name_all" => "Field Name 1"
                    }),
          Field.new({"name" => "field_name_2",
                     "type" => Field::TEXT_FIELD,
                     "display_name_all" => "Field Name 2"
                    }),
          Field.new({"name" => "field_name_3",
                     "type" => Field::TEXT_FIELD,
                     "display_name_all" => "Field Name 3"
                    }),
          Field.new({"name" => "field_name_4",
                     "type" => Field::TEXT_FIELD,
                     "display_name_all" => "Field Name 4"
                    }),
          Field.new({"name" => "field_name_5",
                     "type" => Field::TEXT_FIELD,
                     "display_name_all" => "Field Name 5",
                     "visible" => false
                    }),
          Field.new({"name" => "field_select",
                     "type" => Field::SELECT_BOX,
                     "display_name_all" => "Test Select Field",
                     "option_strings_text" => [{"id"=>"option_1", "display_text"=>"Option 1,"}, {"id"=>"option_2", "display_text"=>"Option 2,"}, {"id"=>"option_3", "display_text"=>"Option 3"}]
                    })
      ]
      @form1 = FormSection.create_or_update_form_section({
        unique_id: "form1",
        name: "Form One",
        description: "Test Form One Description",
        help_text: "Form One Help Text",
        parent_form: "case",
        fields: fields
      })
    end

    context "when passed locale is en" do
      context "and show_hidden_fields is not passed" do
        xit "does not include hidden fields" do
          expected = {"name"=>"Form One",
                      "help_text"=>"Form One Help Text",
                      "description"=>"Test Form One Description",
                      "fields"=>
                          {"field_name_1"=>{"display_name"=>"Field Name 1"},
                           "field_name_2"=>{"display_name"=>"Field Name 2"},
                           "field_name_3"=>{"display_name"=>"Field Name 3"},
                           "field_name_4"=>{"display_name"=>"Field Name 4"},
                           "field_select"=>{"display_name"=>"Test Select Field", "option_strings_text"=>{"option_1"=>"Option 1", "option_2"=>"Option 2", "option_3"=>"Option 3"}}}}
          expect(@form1.localized_property_hash('en')).to eq(expected)
        end
      end

      context "and show_hidden_fields is passed as false" do
        xit "does not include hidden fields" do
          expected = {"name"=>"Form One",
                      "help_text"=>"Form One Help Text",
                      "description"=>"Test Form One Description",
                      "fields"=>
                          {"field_name_1"=>{"display_name"=>"Field Name 1"},
                           "field_name_2"=>{"display_name"=>"Field Name 2"},
                           "field_name_3"=>{"display_name"=>"Field Name 3"},
                           "field_name_4"=>{"display_name"=>"Field Name 4"},
                           "field_select"=>{"display_name"=>"Test Select Field", "option_strings_text"=>{"option_1"=>"Option 1", "option_2"=>"Option 2", "option_3"=>"Option 3"}}}}
          expect(@form1.localized_property_hash('en', false)).to eq(expected)
        end
      end

      context "and show_hidden_fields is passed as true" do
        xit "includes hidden fields" do
          expected = {"name"=>"Form One",
                      "help_text"=>"Form One Help Text",
                      "description"=>"Test Form One Description",
                      "fields"=>
                          {"field_name_1"=>{"display_name"=>"Field Name 1"},
                           "field_name_2"=>{"display_name"=>"Field Name 2"},
                           "field_name_3"=>{"display_name"=>"Field Name 3"},
                           "field_name_4"=>{"display_name"=>"Field Name 4"},
                           "field_name_5"=>{"display_name"=>"Field Name 5"},
                           "field_select"=>{"display_name"=>"Test Select Field", "option_strings_text"=>{"option_1"=>"Option 1", "option_2"=>"Option 2", "option_3"=>"Option 3"}}}}
          expect(@form1.localized_property_hash('en', true)).to eq(expected)
        end
      end
    end

  end

  describe 'import_translations' do
    before do
      [Field, FormSection].each(&:destroy_all)
    end

    describe 'handles bad input data' do
      before do
        @locale = 'es'
      end
      context 'when locale translations do not exist' do
        before do
          @fields = [
              Field.new({"name" => "field_name_1",
                         "type" => Field::TEXT_FIELD,
                         "display_name_all" => "Field Name 1"
                        }),
              Field.new({"name" => "field_name_2",
                         "type" => Field::SELECT_BOX,
                         "display_name_all" => "Test Select Field",
                         "option_strings_text_en" => [{id: 'option_1', display_text: "Test Option 1"},
                                                      {id: 'option_2', display_text: "Test Option 2"},
                                                      {id: 'option_3', display_text: "Test Option 3"}].map(&:with_indifferent_access)
                        })
          ]
        end
        context 'and input has all of the options' do
          before do
            FormSection.create_or_update_form_section({unique_id: "form_t_1", name: "Form One",
                                                       description: "Test Form One Description",
                                                       help_text: "Form One Help Text", parent_form: "case",
                                                       fields: @fields})
            @translated_hash = {'form_t_1' => {'name' => 'Spanish Form 1 Translated',
                                               'description' => 'Spanish Form 1 Description Translated',
                                               'fields' => {'field_name_1' => {'display_name' => 'Spanish Field Name 1 Translated'},
                                                            'field_name_2' => {'display_name' => 'Spanish Field Name 2 Translated',
                                                                               'option_strings_text' => {"option_1"=>"Spanish Option One Translated",
                                                                                                         "option_2"=>"Spanish Option Two Translated",
                                                                                                         "option_3"=>"Spanish Option Three Translated"}}}}}
            FormSection.import_translations(@translated_hash, @locale)
            @form_t_1 = FormSection.find_by(unique_id: 'form_t_1')
          end

          it 'adds translated options for the specified locale' do
            expect(@form_t_1.fields.last.option_strings_text_es).to eq([{'id'=>'option_1', 'display_text'=>'Spanish Option One Translated'},
                                                                        {'id'=>'option_2', 'display_text'=>'Spanish Option Two Translated'},
                                                                        {'id'=>'option_3', 'display_text'=>'Spanish Option Three Translated'}])
          end
        end

        context 'and input has only some of the options' do
          before do
            FormSection.create_or_update_form_section({unique_id: "form_t_2", name: "Form Two",
                                                       description: "Test Form Two Description",
                                                       help_text: "Form Two Help Text", parent_form: "case",
                                                       fields: @fields})
            @translated_hash = {'form_t_2' => {'name' => 'Spanish Form 2 Translated',
                                               'description' => 'Spanish Form 2 Description Translated',
                                               'fields' => {'field_name_1' => {'display_name' => 'Spanish Field Name 1 Translated'},
                                                            'field_name_2' => {'display_name' => 'Spanish Field Name 2 Translated',
                                                                               'option_strings_text' => {"option_1"=>"Spanish Option One Translated",
                                                                                                         "option_2"=>"Spanish Option Two Translated"}}}}}
          end

          it 'does not allow the translations to be saved' do
            expect{FormSection.import_translations(@translated_hash, @locale)}.to raise_error(ActiveRecord::RecordInvalid, /Option strings text Field translated options must have same ids/)
          end
        end

        context 'and input has too many options' do
          before do
            FormSection.create_or_update_form_section({unique_id: "form_t_3", name: "Form Three",
                                                       description: "Test Form Three Description",
                                                       help_text: "Form Three Help Text", parent_form: "case",
                                                       fields: @fields})
            @translated_hash = {'form_t_3' => {'name' => 'Spanish Form 3 Translated',
                                               'description' => 'Spanish Form 3 Description Translated',
                                               'fields' => {'field_name_1' => {'display_name' => 'Spanish Field Name 1 Translated'},
                                                            'field_name_2' => {'display_name' => 'Spanish Field Name 2 Translated',
                                                                               'option_strings_text' => {"option_1"=>"Spanish Option One Translated",
                                                                                                         "option_2"=>"Spanish Option Two Translated",
                                                                                                         "option_3"=>"Spanish Option Three Translated",
                                                                                                         "option_4"=>"Spanish Option Four Translated"}}}}}
            FormSection.import_translations(@translated_hash, @locale)
            @form_t_3 = FormSection.find_by(unique_id: 'form_t_3')
          end

          it 'adds only the translated options that also exist in the default locale' do
            expect(@form_t_3.fields.last.option_strings_text_es).to eq([{'id'=>'option_1', 'display_text'=>'Spanish Option One Translated'},
                                                                        {'id'=>'option_2', 'display_text'=>'Spanish Option Two Translated'},
                                                                        {'id'=>'option_3', 'display_text'=>'Spanish Option Three Translated'}])
          end

          it 'does not add an option that does not exist in the default locale' do
            expect(@form_t_3.fields.last.option_strings_text_es.map{|os| os['id']}).not_to include('option_4')
          end
        end

        context 'and input has completely different options' do
          before do
            FormSection.create_or_update_form_section({unique_id: "form_t_4", name: "Form Four",
                                                       description: "Test Form Four Description",
                                                       help_text: "Form Four Help Text", parent_form: "case",
                                                       fields: @fields})
            @translated_hash = {'form_t_4' => {'name' => 'Spanish Form 4 Translated',
                                               'description' => 'Spanish Form 4 Description Translated',
                                               'fields' => {'field_name_1' => {'display_name' => 'Spanish Field Name 1 Translated'},
                                                            'field_name_2' => {'display_name' => 'Spanish Field Name 2 Translated',
                                                                               'option_strings_text' => {"option_4"=>"Spanish Option Four Translated",
                                                                                                         "option_5"=>"Spanish Option Five Translated",
                                                                                                         "option_6"=>"Spanish Option Six Translated",
                                                                                                         "option_7"=>"Spanish Option Seven Translated"}}}}}
            FormSection.import_translations(@translated_hash, @locale)
            @form_t_4 = FormSection.find_by(unique_id: 'form_t_4')
          end

          it 'does not add any option that does not exist in the default locale' do
            expect(@form_t_4.fields.last.option_strings_text_es).to be_empty
          end
        end

        context 'and input has same options in different order' do
          before :each do
            FormSection.create_or_update_form_section({unique_id: "form_t_5", name: "Form Five",
                                                       description: "Test Form Five Description",
                                                       help_text: "Form Five Help Text", parent_form: "case",
                                                       fields: @fields})
            @translated_hash = {'form_t_5' => {'name' => 'Spanish Form 5 Translated',
                                               'description' => 'Spanish Form 5 Description Translated',
                                               'fields' => {'field_name_1' => {'display_name' => 'Spanish Field Name 1 Translated'},
                                                            'field_name_2' => {'display_name' => 'Spanish Field Name 2 Translated',
                                                                               'option_strings_text' => {"option_2"=>"Spanish Option Two Translated",
                                                                                                         "option_1"=>"Spanish Option One Translated",
                                                                                                         "option_3"=>"Spanish Option Three Translated"}}}}}
            FormSection.import_translations(@translated_hash, @locale)
            @form_t_5 = FormSection.find_by(unique_id: 'form_t_5')
          end

          it 'adds translated options for the specified locale' do
            expect(@form_t_5.fields.last.option_strings_text_es).to eq([{'id'=>'option_2', 'display_text'=>'Spanish Option Two Translated'},
                                                                        {'id'=>'option_1', 'display_text'=>'Spanish Option One Translated'},
                                                                        {'id'=>'option_3', 'display_text'=>'Spanish Option Three Translated'}])
          end
        end
      end

      context 'locale translations do exist' do
        before :each do
          Field.all.each(&:destroy)
          FormSection.all.each(&:destroy)
          @fields = [
              Field.new({"name" => "field_name_1",
                         "type" => Field::TEXT_FIELD,
                         "display_name_all" => "Field Name 1"
                        }),
              Field.new({"name" => "field_name_2",
                         "type" => Field::SELECT_BOX,
                         "display_name_all" => "Test Select Field",
                         "option_strings_text_en" => [{id: 'option_1', display_text: "Test Option 1"},
                                                      {id: 'option_2', display_text: "Test Option 2"},
                                                      {id: 'option_3', display_text: "Test Option 3"}].map(&:with_indifferent_access),
                         "option_strings_text_es" => [{id: 'option_1', display_text: "Test Spanish Option 1"},
                                                      {id: 'option_2', display_text: "Test Spanish Option 2"},
                                                      {id: 'option_3', display_text: "Test Spanish Option 3"}].map(&:with_indifferent_access)
                        })
          ]
        end
        context 'and input has all of the options' do
          before do
            FormSection.create_or_update_form_section({unique_id: "form_t_10", name: "Form Ten",
                                                       description: "Test Form Ten Description",
                                                       help_text: "Form Ten Help Text", parent_form: "case",
                                                       fields: @fields})
            @translated_hash = {'form_t_10' => {'name' => 'Spanish Form 10 Translated',
                                               'description' => 'Spanish Form 10 Description Translated',
                                               'fields' => {'field_name_1' => {'display_name' => 'Spanish Field Name 1 Translated'},
                                                            'field_name_2' => {'display_name' => 'Spanish Field Name 2 Translated',
                                                                               'option_strings_text' => {"option_1"=>"Spanish Option One Translated",
                                                                                                         "option_2"=>"Spanish Option Two Translated",
                                                                                                         "option_3"=>"Spanish Option Three Translated"}}}}}
            FormSection.import_translations(@translated_hash, @locale)
            @form_t_10 = FormSection.find_by(unique_id: 'form_t_10')
          end

          it 'adds translated options for the specified locale' do
            expect(@form_t_10.fields.last.option_strings_text_es).to eq([{'id'=>'option_1', 'display_text'=>'Spanish Option One Translated'},
                                                                        {'id'=>'option_2', 'display_text'=>'Spanish Option Two Translated'},
                                                                        {'id'=>'option_3', 'display_text'=>'Spanish Option Three Translated'}])
          end
        end

        context 'and input has only some of the options' do
          before do
            FormSection.create_or_update_form_section({unique_id: "form_t_11", name: "Form Eleven",
                                                       description: "Test Form Eleven Description",
                                                       help_text: "Form Eleven Help Text", parent_form: "case",
                                                       fields: @fields})
            @translated_hash = {'form_t_11' => {'name' => 'Spanish Form 11 Translated',
                                               'description' => 'Spanish Form 11 Description Translated',
                                               'fields' => {'field_name_1' => {'display_name' => 'Spanish Field Name 1 Translated'},
                                                            'field_name_2' => {'display_name' => 'Spanish Field Name 2 Translated',
                                                                               'option_strings_text' => {"option_1"=>"Spanish Option One Translated",
                                                                                                         "option_2"=>"Spanish Option Two Translated"}}}}}
            FormSection.import_translations(@translated_hash, @locale)
            @form_t_11 = FormSection.find_by(unique_id: 'form_t_11')
          end

          it 'updates only the translated options provided for the specified locale' do
            expect(@form_t_11.fields.last.option_strings_text_es).to eq([{'id'=>'option_1', 'display_text'=>'Spanish Option One Translated'},
                                                  {'id'=>'option_2', 'display_text'=>'Spanish Option Two Translated'},
                                                  {'id'=>'option_3', 'display_text'=>'Test Spanish Option 3'}])
          end
        end

        context 'and input has too many options' do
          before do
            FormSection.create_or_update_form_section({unique_id: "form_t_12", name: "Form Twelve",
                                                       description: "Test Form Twelve Description",
                                                       help_text: "Form Twelve Help Text", parent_form: "case",
                                                       fields: @fields})
            @translated_hash = {'form_t_12' => {'name' => 'Spanish Form 12 Translated',
                                               'description' => 'Spanish Form 12 Description Translated',
                                               'fields' => {'field_name_1' => {'display_name' => 'Spanish Field Name 1 Translated'},
                                                            'field_name_2' => {'display_name' => 'Spanish Field Name 2 Translated',
                                                                               'option_strings_text' => {"option_1"=>"Spanish Option One Translated",
                                                                                                         "option_2"=>"Spanish Option Two Translated",
                                                                                                         "option_3"=>"Spanish Option Three Translated",
                                                                                                         "option_4"=>"Spanish Option Four Translated"}}}}}
            FormSection.import_translations(@translated_hash, @locale)
            @form_t_12 = FormSection.find_by(unique_id: 'form_t_12')
          end

          it 'adds only the translated options that also exist in the default locale' do
            expect(@form_t_12.fields.last.option_strings_text_es).to eq([{'id'=>'option_1', 'display_text'=>'Spanish Option One Translated'},
                                                                        {'id'=>'option_2', 'display_text'=>'Spanish Option Two Translated'},
                                                                        {'id'=>'option_3', 'display_text'=>'Spanish Option Three Translated'}])
          end

          it 'does not add an option that does not exist in the default locale' do
            expect(@form_t_12.fields.last.option_strings_text_es.map{|os| os['id']}).not_to include('option_4')
          end
        end

        context 'and input has completely different options' do
          before do
            FormSection.create_or_update_form_section({unique_id: "form_t_13", name: "Form Thirteen",
                                                       description: "Test Form Thirteen Description",
                                                       help_text: "Form Thirteen Help Text", parent_form: "case",
                                                       fields: @fields})
            @translated_hash = {'form_t_13' => {'name' => 'Spanish Form 13 Translated',
                                               'description' => 'Spanish Form 13 Description Translated',
                                               'fields' => {'field_name_1' => {'display_name' => 'Spanish Field Name 1 Translated'},
                                                            'field_name_2' => {'display_name' => 'Spanish Field Name 2 Translated',
                                                                               'option_strings_text' => {"option_4"=>"Spanish Option Four Translated",
                                                                                                         "option_5"=>"Spanish Option Five Translated",
                                                                                                         "option_6"=>"Spanish Option Six Translated",
                                                                                                         "option_7"=>"Spanish Option Seven Translated"}}}}}
            FormSection.import_translations(@translated_hash, @locale)
            @form_t_13 = FormSection.find_by(unique_id: 'form_t_13')
          end

          it 'does not add any option that does not exist in the default locale' do
            expect(@form_t_13.fields.last.option_strings_text_es).to eq([{'id'=>'option_1', 'display_text'=>'Test Spanish Option 1'},
                                                                        {'id'=>'option_2', 'display_text'=>'Test Spanish Option 2'},
                                                                        {'id'=>'option_3', 'display_text'=>'Test Spanish Option 3'}])
          end
        end

        context 'and input has same options in different order' do
          before :each do
            FormSection.create_or_update_form_section({unique_id: "form_t_14", name: "Form Fourteen",
                                                       description: "Test Form Fourteen Description",
                                                       help_text: "Form Fourteen Help Text", parent_form: "case",
                                                       fields: @fields})
            @translated_hash = {'form_t_14' => {'name' => 'Spanish Form 14 Translated',
                                                'description' => 'Spanish Form 14 Description Translated',
                                                'fields' => {'field_name_1' => {'display_name' => 'Spanish Field Name 1 Translated'},
                                                             'field_name_2' => {'display_name' => 'Spanish Field Name 2 Translated',
                                                                                'option_strings_text' => {"option_2"=>"Spanish Option Two Translated",
                                                                                                          "option_1"=>"Spanish Option One Translated",
                                                                                                          "option_3"=>"Spanish Option Three Translated"}}}}}
            FormSection.import_translations(@translated_hash, @locale)
            @form_t_14 = FormSection.find_by(unique_id: 'form_t_14')
          end

          it 'adds translated options for the specified locale' do
            expect(@form_t_14.fields.last.option_strings_text_es).to eq([{'id'=>'option_1', 'display_text'=>'Spanish Option One Translated'},
                                                                         {'id'=>'option_2', 'display_text'=>'Spanish Option Two Translated'},
                                                                         {'id'=>'option_3', 'display_text'=>'Spanish Option Three Translated'}])
          end
        end
      end
    end
  end
end
