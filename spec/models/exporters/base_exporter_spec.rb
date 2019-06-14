require 'rails_helper'

module Exporters
  describe BaseExporter do
    before :each do
      [Field, FormSection, Lookup].each(&:destroy_all)
      form_section = create(:form_section, unique_id: 'form_section_exporter')
      create(:field, name: 'name_first', form_section: form_section)
      create(:field, name: 'survivor_code_no', form_section: form_section)
      create(:field, :date, name: 'date_last_seen', form_section: form_section)
      create(:select_field, name: 'nationality', form_section: form_section,
             option_strings_text: [{"id"=>"nationality1", "display_text"=>"Nationality 1"}, {"id"=>"nationality2", "display_text"=>"Nationality 2"}])

      create(:subform_field, name: 'family_details_section', form_section: form_section,
              fields: [
                create(:field, name: 'relation_name'),
                create(:field, name: 'relation')
              ])
      @model_class = Child
      @instance = @model_class.new
      @instance.data = {
        family_details_section: [
          {:relation_name => 'John', :relation => 'father'},
          {:relation_name => 'Mary', :relation => 'mother'},
        ],
        nationality: ['nationality1', 'nationality2']
      }
    end

    describe "to_2D_array" do
      it "converts simple models to 2D array" do
        child = @model_class.new
        child.name_first = 'John Doe'
        fields = Field.where(name: 'name_first')
        arr = []
        BaseExporter.to_2D_array([ child ], fields) do |row|
          arr << row
        end

        arr.length.should == 2
        expect(arr[0]).to include("name_first")
        arr[1][arr[0].index("name_first")].should == 'John Doe'
      end

      it "flattens out nested forms" do
        fields = Field.where(name: 'family_details_section')
        arr = []
        BaseExporter.to_2D_array([ @instance ], fields) do |row|
          arr << row
        end
        arr.length.should == 2
        expect(arr[0]).to include("family_details_section[1]relation_name")
        expect(arr[0]).to include("family_details_section[1]relation")
        expect(arr[0]).to include("family_details_section[2]relation_name")
        expect(arr[0]).to include("family_details_section[2]relation")

        arr[1][arr[0].index("family_details_section[1]relation_name")].should == 'John'
        arr[1][arr[0].index("family_details_section[2]relation_name")].should == 'Mary'
        arr[1][arr[0].index("family_details_section[1]relation")].should == 'father'
        arr[1][arr[0].index("family_details_section[2]relation")].should == 'mother'
      end

      it "fills in nil for missing array slots" do
        second = @instance.clone
        second.data['family_details_section'] = [{:relation_name => 'Larry', :relation => 'father'}]
        second.save!
        fields = Field.where(name: 'family_details_section')

        arr = []
        BaseExporter.to_2D_array([ @instance, second ], fields) do |row|
          arr << row
        end

        arr.length.should == 3
        arr[2][arr[0].index("family_details_section[1]relation_name")].should == 'Larry'
        arr[2][arr[0].index("family_details_section[1]relation")].should == 'father'
        arr[2][arr[0].index("family_details_section[2]relation_name")].should == nil
        arr[2][arr[0].index("family_details_section[2]relation")].should == nil
      end

      it "handles normal arrays" do
        fields = Field.where(name: 'nationality')
        arr = []
        BaseExporter.to_2D_array([ @instance ], fields) do |row|
          arr << row
        end
        nationality_field = fields.first
        arr.length.should == 2
        # TODO: 5 organizations here are due to a hack on longest_array in base exporter
        arr[0][2..-1].should == ['nationality[1]', 'nationality[2]', 'nationality[3]', 'nationality[4]', 'nationality[5]']
        arr[1][2..-1].should == [nationality_field.display_text(@instance.nationality[0]), nationality_field.display_text(@instance.nationality[1]), '', '', '']
      end
    end

    describe "include_metadata_properties" do
      it "attaches core metadata properties to the end of each case properties list" do
        props = {
          'primeromodule-cp' => {
            'Form1' => {},
            'Form2' => {}
          },
          'primeromodule-gbv' => {
            'Form3' => {},
            'Form4' => {}
          }
        }

        props_with_metadata = BaseExporter.include_metadata_properties(props, Child)

        expect(props_with_metadata['primeromodule-cp'].keys.last).to eq('__record__')
        expect(props_with_metadata['primeromodule-cp']['__record__'].present?).to be_truthy
        expect(props_with_metadata['primeromodule-cp']['__record__'].values.first).to be_an(CouchRest::Model::Property)


        expect(props_with_metadata['primeromodule-gbv'].keys.last).to eq('__record__')
        expect(props_with_metadata['primeromodule-gbv']['__record__'].present?).to be_truthy
        expect(props_with_metadata['primeromodule-gbv']['__record__'].values.first).to be_an(CouchRest::Model::Property)
      end
    end
  end
end
