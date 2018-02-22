require 'rails_helper'

describe CasesMigrateName do
  before :each do
    FormSection.all.each &:destroy
    PrimeroModule.all.each &:destroy
    Child.all.each &:destroy
    fields = [
      Field.new({"name" => "name",
                 "type" => "text_field",
                 "display_name_all" => "Full Name",
                }),
      Field.new({"name" => "name_first",
                 "type" => "text_field",
                 "display_name_all" => "First Name",
                }),
      Field.new({"name" => "name_middle",
                 "type" => "text_field",
                 "display_name_all" => "Middle Name",
                }),
      Field.new({"name" => "name_last",
                 "type" => "text_field",
                 "display_name_all" => "Surname",
                })
    ]
    form = FormSection.new(
      :unique_id => "basic_identity",
      :parent_form=>"case",
      "visible" => true,
      :order_form_group => 50,
      :order => 15,
      :order_subform => 0,
      :form_group_name => "Basic Identity",
      "editable" => true,
      "name_all" => "Basic Identity",
      "description_all" => "Basic Identity",
      :fields => fields
    )
    form.save!

    @primero_module_cp = PrimeroModule.create!(
      program_id: "primeroprogram-primero",
      name: "CP",
      description: "Child Protection",
      associated_form_ids: ["basic_identity"],
      associated_record_types: ['case']
    )

    @primero_module_gbv = PrimeroModule.create!(
      program_id: "primeroprogram-primero",
      name: "GBV",
      description: "Gender Based Violence",
      associated_form_ids: ["basic_identity"],
      associated_record_types: ['case']
    )

    Child.refresh_form_properties

    #First Name and Last Name are in place. Should not be changed.
    @child2 = Child.create!(:name => "Charlie Sheen", :name_first => "Charlie", :name_last => "Sheen", :module_id => @primero_module_cp.id)
    #There is missing names but it is a gbv, so should not be changed.
    @child3 = Child.create!(:name => "Marlon", :module_id => @primero_module_gbv.id)
    #There is no name field from which calculate the other fields names.
    @child4 = Child.create!(:name_first => "Emilio", :name_last => "Stevez", :module_id => @primero_module_cp.id)
    #All the fields names are in place.
    @child5 = Child.create!(:name => "Charlie Sheen", :name_first => "Charlie", :name_middle => "Irwin",
                            :name_last => "Sheen", :module_id => @primero_module_cp.id)
    #There is no fields names to calculate.
    @child6 = Child.create!(:module_id => @primero_module_cp.id)
    #All fields are in place beside the name value.
    @child7 = Child.create!(:name => "James", :name_first => "James", :name_middle => "Irwin",
                            :name_last => "Franco", :module_id => @primero_module_cp.id)
  end

  before :all do
    FormSection.all.each &:destroy
    PrimeroModule.all.each &:destroy
    Child.all.each &:destroy
    Child.remove_form_properties
  end

  context 'database' do

    it "should set the first name" do
      child1 = Child.create!(:name => "Marlon", :module_id => @primero_module_cp.id)

      child1.should_receive(:id).and_call_original
      @child2.should_not_receive(:id)
      @child3.should_not_receive(:id)
      @child4.should_not_receive(:id)
      @child5.should_not_receive(:id)
      @child6.should_not_receive(:id)
      @child7.should_not_receive(:id)

      CasesMigrateName.migrate_name_to_fields_names

      child1_result = Child.get(child1.id)
      child1_result.name.should eq("Marlon")
      child1_result.name_first.should eq("Marlon")
      child1_result.name_middle.blank?.should eq(true)
      child1_result.name_last.blank?.should eq(true)
    end

    it "should set the first name and last name" do
      child1 = Child.create!(:name => "Marlon Lopez", :module_id => @primero_module_cp.id)

      child1.should_receive(:id).and_call_original
      @child2.should_not_receive(:id)
      @child3.should_not_receive(:id)
      @child4.should_not_receive(:id)
      @child5.should_not_receive(:id)
      @child6.should_not_receive(:id)
      @child7.should_not_receive(:id)

      CasesMigrateName.migrate_name_to_fields_names

      child1_result = Child.get(child1.id)
      child1_result.name.should eq("Marlon Lopez")
      child1_result.name_first.should eq("Marlon")
      child1_result.name_middle.blank?.should eq(true)
      child1_result.name_last.should eq("Lopez")
    end

    it "should set the first name, middle name and last name" do
      child1 = Child.create!(:name => "Marlon Antonio Lopez Martinez", :module_id => @primero_module_cp.id)

      child1.should_receive(:id).and_call_original
      @child2.should_not_receive(:id)
      @child3.should_not_receive(:id)
      @child4.should_not_receive(:id)
      @child5.should_not_receive(:id)
      @child6.should_not_receive(:id)
      @child7.should_not_receive(:id)

      CasesMigrateName.migrate_name_to_fields_names

      child1_result = Child.get(child1.id)
      child1_result.name.should eq("Marlon Antonio Lopez Martinez")
      child1_result.name_first.should eq("Marlon")
      child1_result.name_middle.should eq("Antonio")
      child1_result.name_last.should eq("Lopez Martinez")
    end

    it "should set the missing first name" do
      child1 = Child.create!(:name => "James Franco", :name_middle => "Edward",
                             :name_last => "Franco", :module_id => @primero_module_cp.id)

      child1.should_receive(:id).and_call_original
      @child2.should_not_receive(:id)
      @child3.should_not_receive(:id)
      @child4.should_not_receive(:id)
      @child5.should_not_receive(:id)
      @child6.should_not_receive(:id)
      @child7.should_not_receive(:id)

      CasesMigrateName.migrate_name_to_fields_names

      child1_result = Child.get(child1.id)
      child1_result.name.should eq("James Franco")
      child1_result.name_first.should eq("James")
      child1_result.name_middle.should eq("Edward")
      child1_result.name_last.should eq("Franco")
    end

    it "should set the missing last name" do
      child1 = Child.create!(:name => "James Franco", :name_middle => "Edward",
                             :name_first => "James", :module_id => @primero_module_cp.id)

      child1.should_receive(:id).and_call_original
      @child2.should_not_receive(:id)
      @child3.should_not_receive(:id)
      @child4.should_not_receive(:id)
      @child5.should_not_receive(:id)
      @child6.should_not_receive(:id)
      @child7.should_not_receive(:id)

      CasesMigrateName.migrate_name_to_fields_names

      child1_result = Child.get(child1.id)
      child1_result.name.should eq("James Franco")
      child1_result.name_first.should eq("James")
      child1_result.name_middle.should eq("Edward")
      child1_result.name_last.should eq("Franco")
    end

    it "should set the missing middle name" do
      child1 = Child.create!(:name => "James Edward Franco", :name_first => "James",
                             :name_last => "Franco", :module_id => @primero_module_cp.id)

      child1.should_receive(:id).and_call_original
      @child2.should_not_receive(:id)
      @child3.should_not_receive(:id)
      @child4.should_not_receive(:id)
      @child5.should_not_receive(:id)
      @child6.should_not_receive(:id)
      @child7.should_not_receive(:id)

      CasesMigrateName.migrate_name_to_fields_names

      child1_result = Child.get(child1.id)
      child1_result.name.should eq("James Edward Franco")
      child1_result.name_first.should eq("James")
      child1_result.name_middle.should eq("Edward")
      child1_result.name_last.should eq("Franco")
    end
  end

  context 'mocking' do
    it "should set the first name" do
      child1 = Child.new(:name => "Marlon", :module_id => @primero_module_cp.id)
      child1.should_receive(:name_first=).with("Marlon")
      child1.should_not_receive(:name_middle=)
      child1.should_not_receive(:name_last=)
      Child.should_receive(:all).and_return([child1])
      changed = CasesMigrateName.migrate_name_to_fields_names
    end

  it "should set the first name and last name" do
      child1 = Child.new(:name => "Marlon Lopez", :module_id => @primero_module_cp.id)
      child1.should_receive(:name_first=).with("Marlon")
      child1.should_not_receive(:name_middle=)
      child1.should_receive(:name_last=).with("Lopez")
      Child.should_receive(:all).and_return([child1])
      changed = CasesMigrateName.migrate_name_to_fields_names
    end

    it "should set the first name, middle name and last name" do
      child1 = Child.new(:name => "Marlon Antonio Lopez Martinez", :module_id => @primero_module_cp.id)
      child1.should_receive(:name_first=).with("Marlon")
      child1.should_receive(:name_middle=).with("Antonio")
      child1.should_receive(:name_last=).with("Lopez Martinez")
      Child.should_receive(:all).and_return([child1])
      changed = CasesMigrateName.migrate_name_to_fields_names
    end

    it "should set the missing first name" do
      child1 = Child.new(:name => "James Franco", :name_middle => "Edward",
                             :name_last => "Franco", :module_id => @primero_module_cp.id)

      child1.should_receive(:name_first=).with("James")
      child1.should_not_receive(:name_middle=)
      child1.should_receive(:name_last=).with("Franco")
      Child.should_receive(:all).and_return([child1])
      changed = CasesMigrateName.migrate_name_to_fields_names
    end

    it "should set the missing last name" do
      child1 = Child.new(:name => "James Franco", :name_middle => "Edward",
                             :name_first => "James", :module_id => @primero_module_cp.id)

      child1.should_receive(:name_first=).with("James")
      child1.should_not_receive(:name_middle=)
      child1.should_receive(:name_last=).with("Franco")
      Child.should_receive(:all).and_return([child1])
      changed = CasesMigrateName.migrate_name_to_fields_names
    end

    it "should set the missing middle name" do
      child1 = Child.new(:name => "James Edward Franco", :name_first => "James",
                             :name_last => "Franco", :module_id => @primero_module_cp.id)

      child1.should_receive(:name_first=).with("James")
      child1.should_receive(:name_middle=).with("Edward")
      child1.should_receive(:name_last=).with("Franco")
      Child.should_receive(:all).and_return([child1])
      changed = CasesMigrateName.migrate_name_to_fields_names
    end

  end

end
