require 'rails_helper'

module Exporters
  describe PDFExporter do
    before :each do
      form = FormSection.new( name: 'cases_test_form_1', parent_form: 'case', unique_id: 'cases_test_form_1')
      form.fields << Field.new( name: 'first_name', type: Field::TEXT_FIELD, display_name: 'first_name')
      form.fields << Field.new( name: 'last_name', type: Field::TEXT_FIELD, display_name: 'last_name')
      form.save!
      @primero_module = PrimeroModule.create!(program_id: 'primeroprogram-primero',name: 'CP',description: 'Child Protection',
                                              associated_form_ids: ['cases_test_form_1'], associated_record_types: ['case'])
      Child.refresh_form_properties
      @properties_by_module = {'primeromodule-c': Child.properties_by_form }
      @user = User.new(user_name: 'fakeadmin', module_ids: ['primeromodule-cp'])
      @records = [Child.new( module_id: 'primeromodule-cp', first_name: "John \u200B", last_name: 'Doe')]
    end

    after :each do
      FormSection.all.map{|f| f.fields}
        .flatten.select{|f| f.type == Field::SUBFORM}
        .map{|f| f.name}.each do |key|
        # Remove the validator for the subforms used only on this test.
        Child._validators.delete key.to_sym if Child._validators[key.to_sym]
        Child.form_properties_by_name.delete key
      end
      FormSection.all.each { |form| form.destroy }
      PrimeroModule.all.each { |fm| fm.destroy }
    end

    it "export pdf with invalid unicode" do
      data = PDFExporter.export(@records, @properties_by_module, @user, nil)
      expect{@records.first.first_name.encode('windows-1252')}.to raise_error(Encoding::UndefinedConversionError)
      data.should_not be_nil
    end

  end
end