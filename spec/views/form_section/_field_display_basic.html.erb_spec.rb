require 'rails_helper'

describe "form_section/_field_display_basic.html.erb" do
  before :each do
    @case = Child.new
  end

  it "It should display field label without ':' at the end" do
    @case['child_name'] = 'Child Name Value'
    text_field = Field.new :name => 'child_name', :display_name => 'Child Name Label', :type => 'text_field'
    render :partial => 'form_section/field_display_basic', :locals => { :field => text_field, :formObject => @case }, :formats => [:html], :handlers => [:erb]

    #Test the exact content of the tags.
    rendered.should match(/<label class="key child_name">Child Name Label<\/label>/)
    rendered.should match(/Child Name Value/)
  end

  #TODO - i18n add tests for different locales
  context 'when field is a select box' do
    context 'and using option_strings_text' do
      before :each do
        @field = Field.new({'name' => "my_select_field",
                            'type' => "select_box",
                            'display_name_all' => "My Select Field",
                            'option_strings_text_en' => [{id: 'option_one', display_text: "Option One"}.with_indifferent_access,
                                                         {id: 'option_two', display_text: "Option Two"}.with_indifferent_access,
                                                         {id: 'option_three', display_text: "Option Three"}.with_indifferent_access],
                            'option_strings_text_fr' => [{id: 'option_one', display_text: "French One"}.with_indifferent_access,
                                                         {id: 'option_two', display_text: "French Two"}.with_indifferent_access,
                                                         {id: 'option_three', display_text: "French Three"}.with_indifferent_access],
                            'option_strings_text_es' => [{id: 'option_one', display_text: "Spanish One"}.with_indifferent_access,
                                                         {id: 'option_two', display_text: "Spanish Two"}.with_indifferent_access,
                                                         {id: 'option_three', display_text: "Spanish Three"}.with_indifferent_access],
                            'option_strings_text_ar' => [{id: 'option_one', display_text: "Arabic One"}.with_indifferent_access,
                                                         {id: 'option_two', display_text: "Arabic Two"}.with_indifferent_access,
                                                         {id: 'option_three', display_text: "Arabic Three"}.with_indifferent_access]
                      })
      end

      context 'and locale is English' do
        it 'displays the translated display text of the value' do
          @case['my_select_field'] = 'option_two'
          render :partial => 'form_section/field_display_basic', :locals => { :field => @field, :formObject => @case }, :formats => [:html], :handlers => [:erb]

          expect(rendered).to match(/<label class="key my_select_field">My Select Field<\/label>/)
          expect(rendered).to match(/Option Two/)
        end
      end
      context 'and locale is French' do
        before :each do
          I18n.locale = "fr"
        end
        it 'displays the translated display text of the value' do
          @case['my_select_field'] = 'option_two'
          render :partial => 'form_section/field_display_basic', :locals => { :field => @field, :formObject => @case }, :formats => [:html], :handlers => [:erb]

          expect(rendered).to match(/<label class="key my_select_field">My Select Field<\/label>/)
          expect(rendered).to match(/French Two/)
        end
      end
      context 'and locale is Spanish' do
        before :each do
          I18n.locale = "es"
        end
        it 'displays the translated display text of the value' do
          @case['my_select_field'] = 'option_two'
          render :partial => 'form_section/field_display_basic', :locals => { :field => @field, :formObject => @case }, :formats => [:html], :handlers => [:erb]

          expect(rendered).to match(/<label class="key my_select_field">My Select Field<\/label>/)
          expect(rendered).to match(/Spanish Two/)
        end
      end
      context 'and locale is Arabic' do
        before :each do
          I18n.locale = "ar"
        end
        it 'displays the translated display text of the value' do
          @case['my_select_field'] = 'option_two'
          render :partial => 'form_section/field_display_basic', :locals => { :field => @field, :formObject => @case }, :formats => [:html], :handlers => [:erb]

          expect(rendered).to match(/<label class="key my_select_field">My Select Field<\/label>/)
          expect(rendered).to match(/Arabic Two/)
        end
      end
    end

    context 'and using a lookup' do
      before :each do
        @lookup = Lookup.create!(id: "lookup-some-lookup", name: "Some Lookup",
                                 lookup_values: [{id: "value_1", display_text: "Value 1"},
                                                 {id: "value_2", display_text: "Value 2"},
                                                 {id: "value_3", display_text: "Value 3"},
                                                 {id: "value_4", display_text: "Value 4"},
                                                 {id: "value_5", display_text: "Value 5"},
                                                 {id: "value_6", display_text: "Value 6"},
                                                 {id: "value_7", display_text: "Value 7"},
                                                 {id: "value_8", display_text: "Value 8"}])
        @field = Field.new({'name' => "my_select_lookup_field",
                       'type' => "select_box",
                       'option_strings_source' => "lookup lookup-some-lookup",
                       'display_name_all' => "Select From Lookup"
                      })
      end
      it 'displays the translated display text of the value' do
        @case['my_select_lookup_field'] = 'value_7'
        render :partial => 'form_section/field_display_basic', :locals => { :field => @field, :formObject => @case }, :formats => [:html], :handlers => [:erb]

        expect(rendered).to match(/<label class="key my_select_lookup_field">Select From Lookup<\/label>/)
        expect(rendered).to match(/Value 7/)
      end
    end

    context 'and using a Location lookup' do
      before :each do
        @location_country = Location.create! placename: "My Country", type: "country", location_code: "GUI", admin_level: 0
        @location_region = Location.create! placename: "My Region", type: "region", location_code: "GUI01", hierarchy: ["GUI"]
        @location_town = Location.create! placename: "My Town", type: "city", location_code: "GUI0102", hierarchy: ["GUI", "GUI01"]
        @field = Field.new({'name' => "my_location_field",
                            'type' => "select_box",
                            'option_strings_source' => "Location",
                            'display_name_all' => "Select From Location"
                           })
      end
      it 'displays the translated display text of the value' do
        @case['my_location_field'] = 'GUI0102'
        render :partial => 'form_section/field_display_basic', :locals => { :field => @field, :formObject => @case }, :formats => [:html], :handlers => [:erb]

        expect(rendered).to match(/<label class="key my_location_field">Select From Location<\/label>/)
        expect(rendered).to match(/My Country::My Region::My Town/)
      end
    end
  end
end