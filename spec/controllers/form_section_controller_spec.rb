require 'rails_helper'

class MockFormSection

  def initialize is_valid = true
    @is_valid = is_valid
  end

  def core_form= core_form
    @core_form = core_form
  end

  def unique_id= unique_id
    @unique_id = unique_id
  end

  def order= order
    @order = order
  end

  def order_form_group= order_form_group
    @order_form_group = order_form_group
  end

  def order_subform= order_subform
    @order_subform = order_subform
  end

  def valid?
    @is_valid
  end

  def unique_id
    "unique_id"
  end

  def name
    "form_name"
  end
end

describe FormSectionController do
  before do
    FormSection.all.each &:destroy
    PrimeroModule.all.each &:destroy
    Role.all.each &:destroy

    @form_section_a = FormSection.create!(unique_id: "A", name: "A", parent_form: "case")
    @form_section_b = FormSection.create!(unique_id: "B", name: "B", parent_form: "case", mobile_form: true)
    @form_section_c = FormSection.create!(unique_id: "C", name: "C", parent_form: "case", mobile_form: true)
    @form_section_e = FormSection.create!(unique_id: "E", name: "E", parent_form: "case", mobile_form: false, is_nested: true, visible: false, fields: [
      Field.new(name: "field1", type: "text_field", display_name_all: "field1")
    ])
    @form_section_d = FormSection.create!(unique_id: "D", name: "D", parent_form: "case", mobile_form: true, fields: [
      Field.new(name: "nested_e", type: "subform", subform: @form_section_e, display_name_all: "nested_e"),
    ])
    @primero_module = PrimeroModule.create!(program_id: "some_program", name: "Test Module", form_section_ids: ["A", "B", "D"], associated_record_types: ['case'])
    user = User.new(:user_name => 'manager_of_forms', module_ids: [@primero_module.unique_id])
    @permission_metadata = Permission.new(resource: Permission::METADATA, actions: [Permission::MANAGE])
    user.stub(:roles).and_return([Role.new(permissions_list: [@permission_metadata])])
    fake_login user
  end

  describe "get index" do
    it "populate the view with all the form sections in order ignoring enabled or disabled" do
      forms = [@form_section_a, @form_section_b, @form_section_d]
      grouped_forms = forms.group_by{|e| e.form_group_name}
      get :index, params: {:module_id => @primero_module.unique_id, :parent_form => 'case'}
      assigns[:form_sections].should == grouped_forms
    end

    #TODO - add incident rspecs
    describe "mobile API" do
      it "only shows mobile forms" do
        get :index, params: {mobile: true, :format => :json}
        expect(assigns[:form_sections]['Children'].size).to eq(2)
        expect(assigns[:form_sections]['Children'].map{|fs| fs['unique_id']}).to include('B', 'D')
      end

      it 'shows subforms for mobile forms' do
        expected = [{"name"=>"nested_e",
                     "disabled"=>false,
                     "multi_select"=>false,
                     "type"=>"subform",
                     "subform"=>
                         {"unique_id"=>"E",
                          :name=>{"en"=>"E", "fr"=>"", "ar"=>"", "ar-LB"=>"", "so"=>"", "es"=>"", "bn"=>"", "id"=>"",
                                  "my"=>"", "th"=>"", "ku"=>""},
                          "order"=>0,
                          :help_text=>{"en"=>"", "fr"=>"", "ar"=>"", "ar-LB"=>"", "so"=>"", "es"=>"", "bn"=>"", "id"=>"",
                                       "my"=>"", "th"=>"", "ku"=>""},
                          "fields"=>
                              [{"name"=>"field1",
                                "disabled"=>false,
                                "multi_select"=>false,
                                "type"=>"text_field",
                                "required"=>false,
                                "option_strings_source"=>nil,
                                "show_on_minify_form"=>false,
                                "mobile_visible"=>true,
                                :display_name=>{"en"=>"field1", "fr"=>"field1", "ar"=>"field1", "ar-LB"=>"field1","so"=>"field1",
                                                "es"=>"field1", "bn"=>"field1", "id"=>"field1", "my"=>"field1", "th"=>"field1",
                                                "ku"=>"field1"},
                                :help_text=>{"en"=>"", "fr"=>"", "ar"=>"", "ar-LB"=>"", "so"=>"", "es"=>"", "bn"=>"",
                                             "id"=>"", "my"=>"", "th"=>"", "ku"=>""},
                                :option_strings_text=>{"en"=>[], "fr"=>[], "ar"=>[], "ar-LB"=>[], "so"=>[], "es"=>[],
                                                       "bn"=>[], "id"=>[], "my"=>[], "th"=>[], "ku"=>[]},
                                "date_validation" => 'default_date_validation'}]},
                     "required"=>false,
                     "option_strings_source"=>nil,
                     "show_on_minify_form"=>false,
                     "mobile_visible"=>true,
                     :display_name=>{"en"=>"nested_e", "fr"=>"nested_e", "ar"=>"nested_e", "ar-LB"=>"nested_e",
                                     "so"=>"nested_e", "es"=>"nested_e", "bn"=>"nested_e", "id"=>"nested_e",
                                     "my"=>"nested_e", "th"=>"nested_e", "ku"=>"nested_e"},
                     :help_text=>{"en"=>"", "fr"=>"", "ar"=>"", "ar-LB"=>"", "so"=>"", "es"=>"", "bn"=>"", "id"=>"",
                                  "my"=>"", "th"=>"", "ku"=>""},
                     :option_strings_text=>{"en"=>[], "fr"=>[], "ar"=>[], "ar-LB"=>[], "so"=>[], "es"=>[], "bn"=>[],
                                            "id"=>[], "my"=>[], "th"=>[], "ku"=>[]},
                     "date_validation" => 'default_date_validation'}]
        get :index, params: {mobile: true, :format => :json}
        expect(assigns[:form_sections]['Children'].select{|f| f['unique_id'] == 'D'}.first['fields']).to eq(expected)
      end

      it "sets null values on forms to be an empty string" do
        get :index, params: {mobile: true, :format => :json}
        expect(assigns[:form_sections]['Children'].first[:help_text]['en']).to eq('')
      end

      it "will only display requested locales if queried with a valid locale" do
        get :index, params: {mobile: true, locale: 'en',  :format => :json}
        expect(assigns[:form_sections]['Children'].first[:name]['en']).to eq('B')
        expect(assigns[:form_sections]['Children'].first[:name]['fr']).to be_nil
      end

      it "will display all locales if queried with an invalid locale" do
        get :index, params: {mobile: true, locale: 'ABC',  :format => :json}
        expect(assigns[:form_sections]['Children'].first[:name]['en']).to eq('B')
        expect(assigns[:form_sections]['Children'].first[:name].keys).to match_array(Primero::Application::locales)
      end

      it "will embed the entire nested subform inside the top-level form" do
        get :index, params: {mobile: true, :format => :json}
        form_with_nested = assigns[:form_sections]['Children'].find{|f| f['unique_id'] == 'D'}
        field_with_nested = form_with_nested['fields'].find{|f| f['name'] == 'nested_e'}
        nested = field_with_nested['subform']
        expect(nested['unique_id']).to eq('E')
      end

      describe '/api/forms' do
        before do
          Location.all.each &:destroy

          @form_section_l = FormSection.create!(unique_id: "F", name: "F", parent_form: "test", mobile_form: true, fields: [
            Field.new(
              name: "field1",
              type: "select_box",
              display_name_all: "field1",
              searchable_select: true,
              option_strings_source: 'Location'
            )
          ])

          @country = create :location, placename: "Country1", location_code: 'CTRY01', admin_level: 0
          @province1 = create :location, placename: "Province1", hierarchy: [@country.location_code], location_code: 'PRV01'
          @province2 = create :location, placename: "Province2", hierarchy: [@country.location_code], location_code: 'PRV02'
          @town1 = create :location, placename: "Town1", hierarchy: [@country.location_code, @province1.location_code], location_code:'TWN01'

          @primero_module2 = PrimeroModule.create!(program_id: "some_program", name: "Test 2 Module", form_section_ids: ["F"], associated_record_types: ['test'])
          user = User.new(:user_name => 'manager2_of_forms', module_ids: [@primero_module2.id])
          user.stub(:roles).and_return([Role.new(permissions_list: [@permission_metadata])])
          fake_login user
        end


        it 'should return location fields with locations if mobile' do
          expected = [{"id"=>"CTRY01", "display_text"=>"Country1"},
                      {"id"=>"PRV01", "display_text"=>"Country1::Province1"},
                      {"id"=>"PRV02", "display_text"=>"Country1::Province2"},
                      {"id"=>"TWN01", "display_text"=>"Country1::Province1::Town1"}]
          get :index, params: {mobile: true, format: :json}
          returned = assigns[:form_sections]["Tests"].first['fields'].first[:option_strings_text]['en']
          expect(returned).to eq(expected)
        end

        context 'when mobile is true' do
          before do
            SystemSettings.all.each &:destroy
            SystemSettings.create(default_locale: "en",
                                  primary_age_range: "primary", age_ranges: {"primary" => [1..2,3..4]})
          end

          context 'and number of locations is less than max limit' do
            before :each do
              Location.stub(:count).and_return(180)
            end

            context 'and number of locations is less than System Settings max location limit' do
              before :each do
                SystemSettings.any_instance.stub(:location_limit_for_api).and_return(190)
              end

              it 'should return location fields with locations' do
                expected = [
                  {"id"=>"CTRY01", "display_text"=>"Country1"},
                  {"id"=>"PRV01", "display_text"=>"Country1::Province1"},
                  {"id"=>"PRV02", "display_text"=>"Country1::Province2"},
                  {"id"=>"TWN01", "display_text"=>"Country1::Province1::Town1"}
                ]
                get :index, params: {mobile: true, format: :json}
                returned = assigns[:form_sections]["Tests"].first['fields'].first[:option_strings_text]['en']
                expect(returned).to eq(expected)
              end
            end

            context 'and number of locations is greater than System Settings max location limit' do
              before :each do
                SystemSettings.any_instance.stub(:location_limit_for_api).and_return(170)
              end

              it 'should return location fields without locations' do
                get :index, params: {mobile: true, format: :json}
                returned = assigns[:form_sections]["Tests"].first['fields'].first[:option_strings_text]['en']
                expect(returned).to eq([])
              end
            end
          end

          context 'and number of locations is greater than max limit' do
            before :each do
              Location.stub(:count).and_return(201)
            end

            context 'and number of locations is less than System Settings max location limit' do
              before :each do
                SystemSettings.any_instance.stub(:location_limit_for_api).and_return(210)
              end

              it 'should return location fields without locations' do
                get :index, params: {mobile: true, format: :json}
                returned = assigns[:form_sections]["Tests"].first['fields'].first[:option_strings_text]['en']
                expect(returned).to eq([])
              end
            end

            context 'and number of locations is greater than System Settings max location limit' do
              before :each do
                SystemSettings.any_instance.stub(:location_limit_for_api).and_return(100)
              end

              it 'should return location fields without locations' do
                get :index, params: {mobile: true, format: :json}
                returned = assigns[:form_sections]["Tests"].first['fields'].first[:option_strings_text]['en']
                expect(returned).to eq([])
              end
            end
          end
        end
      end
    end
  end

  describe "forms API", :type => :request do
    it "gets the forms as JSON if accessed through the API url" do
      get '/api/forms'
      expect(response.content_type.to_s).to eq('application/json')
    end
  end

  describe "post create" do
    it "should new form_section with order" do
      existing_count = FormSection.count
      form_section = {:name=>"name", :description=>"desc", :help_text=>"help text", :visible=>true}
      post :create, params: {:form_section => form_section}
      FormSection.count.should == existing_count + 1
    end

    it "sets flash notice if form section is valid and redirect_to edit page with a flash message" do
      fake_form_section = MockFormSection.new
      fake_form_section.stub(:save).and_return(true)
      FormSection.stub(:new_custom).and_return(fake_form_section)
      form_section = {:name=>"name", :description=>"desc", :visible=>"true"}
      post :create, params: {:form_section =>form_section}
      request.flash[:notice].should == "Form section successfully added"
      response.should redirect_to(edit_form_section_path("unique_id"))
    end

    it "does not set flash notice if form section is valid and render new" do
      FormSection.stub(:new_custom).and_return(MockFormSection.new(false))
      form_section = {:name=>"name", :description=>"desc", :visible=>"true"}
      post :create, params: {:form_section =>form_section}
      request.flash[:notice].should be_nil
      response.should render_template("new")
    end

    it "should assign view data if form section was not valid" do
      expected_form_section = MockFormSection.new(false)
      FormSection.stub(:new_custom).and_return expected_form_section
      form_section = {:name=>"name", :description=>"desc", :visible=>"true"}
      post :create, params: {:form_section =>form_section}
      assigns[:form_section].should == expected_form_section
    end
  end

  describe "post save_order" do
    after { FormSection.all.each &:destroy }

    it "should save the order of the forms" do
      form_one = FormSection.create(:unique_id => "first_form", :name => "first form", :order => 1)
      form_two = FormSection.create(:unique_id => "second_form", :name => "second form", :order => 2)
      form_three = FormSection.create(:unique_id => "third_form", :name => "third form", :order => 3)
      post :save_order, params: {:ids => [form_three.unique_id, form_one.unique_id, form_two.unique_id]}
      FormSection.find_by(unique_id: form_one.unique_id).order.should == 2
      FormSection.find_by(unique_id: form_two.unique_id).order.should == 3
      FormSection.find_by(unique_id: form_three.unique_id).order.should == 1
      response.should redirect_to(form_sections_path)
    end
  end

  describe "post update" do
    it "should save update if valid" do
      form_section = FormSection.create!(name: 'form 1')
      params = { help_text: 'some helpful text' }
      post :update, params: {:form_section => params, :id => "form_1"}
      response.should redirect_to(edit_form_section_path(form_section.unique_id))
    end

    it "should show errors if invalid" do
      form_section = FormSection.new
      params = {"some" => "params"}
      FormSection.should_receive(:find_by).with({unique_id: 'form_1'}).and_return(form_section)
      form_section.should_receive(:properties=).with(params)
      form_section.should_receive(:valid?).and_return(false)
      post :update, params: {:form_section => params, :id => "form_1"}
      response.should_not redirect_to(form_sections_path)
      response.should render_template("edit")
    end
  end

  describe "post enable" do
    it "should toggle the given form_section to hide/show" do
      form_section1 = FormSection.create!({:name=>"name1", :description=>"desc", :visible=>"true", :unique_id=>"form_1"})
      form_section2 = FormSection.create!({:name=>"name2", :description=>"desc", :visible=>"false", :unique_id=>"form_2"})
      post :toggle, params: {:id => "form_1"}
      FormSection.find_by(unique_id: form_section1.unique_id).visible.should be_falsey
      post :toggle, params: {:id => "form_2"}
      FormSection.find_by(unique_id: form_section2.unique_id).visible.should be_truthy
    end
  end

end
