# frozen_string_literal: true

require 'rails_helper'
require 'spreadsheet'

# Tests for the YmlFormExporter
module Exporters
  describe YmlFormExporter do
    before :each do
      clean_data(PrimeroModule, PrimeroProgram, FormSection, Field, Lookup)
      @primero_module = create(
        :primero_module,
        unique_id: 'primeromodule-cp', name: 'CP', description: 'Child Protection', associated_record_types: ['case']
      )
      @form1 = FormSection.new(
        name: 'cases_test_form_2', parent_form: 'case', visible: true,
        order_form_group: 0, order: 0, order_subform: 0, form_group_id: 'cases_test_form_2',
        unique_id: 'cases_test_form_2'
      )
      @form1.fields << Field.new(name: 'relationship', type: Field::TEXT_FIELD, display_name: 'relationship')
      @form1.fields << Field.new(
        name: 'array_field', type: Field::SELECT_BOX, display_name: 'array_field', multi_select: true,
        option_strings_text: [
          { id: 'option1', display_text: 'Option1' }, { id: 'option2', display_text: 'Option2' },
          { id: 'option5', display_text: 'Option5' }, { id: 'option4', display_text: 'Option4' }
        ].map(&:with_indifferent_access)
      )
      @form1.save!
      Lookup.create(
        unique_id: 'lookup-location-type',
        name_en: 'Location Type',
        name_es: 'Tipo de Locación',
        locked: true,
        lookup_values_en: [
          { id: 'country', display_text: 'Country' },
          { id: 'region', display_text: 'Region' }
        ].map(&:with_indifferent_access),
        lookup_values_es: [
          { id: 'country', display_text: 'País' },
          { id: 'region', display_text: 'Región' }
        ].map(&:with_indifferent_access)
      )
      Lookup.create(
        unique_id: 'lookup-form-group-cp-tracing-request',
        name_en: 'Form Groups - CP Tracing Request',
        lookup_values_en: [
          { id: 'photos_audio', display_text: 'Photos and Audio' },
          { id: 'other_reportable_fields', display_text: 'Other Reportable Fields' }
        ].map(&:with_indifferent_access)
      )
    end
    describe 'Export format' do
      xit 'Testing YmlFormExporter with en locale' do
        data = Exporters::YmlFormExporter.new(nil).export(nil, nil)
        file_content = File.open(data.path).read.delete("\n").delete(' ')
        expect(file_content).to eq(
          '---en:lookup-location-type:name:LocationTypelookup_values:country:Countryregion:
          Regionlookup-form-group-cp-tracing-request:name:FormGroupsCpTracingRequestlookup_values:photos_audio:
          PhotosandAudioother_reportable_fields:OtherReportableFields'.delete("\n").delete(' ')
        )
      end

      xit 'Testing YmlFormExporter with es locale' do
        data = Exporters::YmlFormExporter.new(nil).export(nil, nil, 'locale' => 'es')
        file_content = File.open(data.path).read.delete("\n").delete(' ')
        expect(file_content).to eq(
          '---es:lookup-location-type:name:TipodeLocaciónlookup_values:country:Paísregion:
          Regiónlookup-form-group-cp-tracing-request:name:lookup_values:photos_audio:
          PhotosandAudioother_reportable_fields:OtherReportableFields'.delete("\n").delete(' ')
        )
      end

      it 'Testing YmlFormExporter with one form' do
        data = Exporters::YmlFormExporter.new(nil).export(nil, nil, 'form_id' => @form1.unique_id)
        file_content = File.open(data.path).read.delete("\n").delete(' ')
        expect(file_content).to eq(
          '---en:cases_test_form_2:name:cases_test_form_2help_text:description:fields:relationship:display_name:
          relationshiphelp_text:guiding_questions:tally:tick_box_label:array_field:display_name:array_fieldhelp_text:
          guiding_questions:tally:tick_box_label:option_strings_text:option1:Option1option2:Option2option5:
          Option5option4:Option4'.delete("\n").delete(' ')
        )
      end
    end
    after :each do
    end
  end
end
