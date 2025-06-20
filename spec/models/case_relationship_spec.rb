require 'rails_helper'

RSpec.describe CaseRelationship, type: :model do
  before do
    clean_data(CaseRelationship, Child)

    @case1 = Child.create!(data: { name: 'Test1', age: 5, sex: 'male' })
    @case2 = Child.create!(data: { name: 'Test2', age: 7, sex: 'female' })
    @case3 = Child.create!(data: { name: 'Test3', age: 3, sex: 'male' })
    @case4 = Child.create!(data: { name: 'Test3', age: 2, sex: 'male' })
    @farmer1 = Child.create!(data: { name: 'Test4', age: 3, sex: 'female' })
    @farmer2 = Child.create!(data: { name: 'Test5', age: 5, sex: 'male' })
  end

  it 'creates a valid relationship' do
    case_relationship = CaseRelationship.new_case_relationship(primary_case_id: @case1.id, related_case_id: @case2.id,
                                                               relationship_type: 'farmer_on')
    expect(case_relationship).to be_valid
    expect(case_relationship.attributes).to include({ 'from_case_id' => @case1.id, 'to_case_id' => @case2.id,
                                                      'relationship_type' => 'farmer_on',
                                                      'disabled' => false })
  end

  describe '#list' do
    before do
      @case_relationship1 = CaseRelationship.new_case_relationship(
        primary_case_id: @case1.id, related_case_id: @farmer1.id, relationship_type: 'farmer_on'
      )
      @case_relationship2 = CaseRelationship.new_case_relationship(
        primary_case_id: @case3.id, related_case_id: @farmer1.id, relationship_type: 'farmer_on'
      )
      @case_relationship3 = CaseRelationship.new_case_relationship(
        primary_case_id: @farmer2.id, related_case_id: @case2.id, relationship_type: 'farm_for'
      )
      @case_relationship4 = CaseRelationship.new_case_relationship(
        primary_case_id: @farmer2.id, related_case_id: @case4.id, relationship_type: 'farm_for'
      )
      @case_relationship5 = CaseRelationship.new_case_relationship(
        primary_case_id: @farmer2.id, related_case_id: @case3.id, relationship_type: 'farm_for'
      )
      @case_relationship5.disabled = true

      [@case_relationship1, @case_relationship2, @case_relationship3, @case_relationship4,
       @case_relationship5].each(&:save!)
    end

    it 'returns a list of case relationships by relationship type' do
      expect(CaseRelationship.list(@farmer2, 'farm_for')).to match_array([@case_relationship5, @case_relationship3, @case_relationship4])
      expect(CaseRelationship.list(@case1, 'farmer_on')).to match_array([@case_relationship1])
    end
  end

  describe 'validations' do
    it 'rejects invalid relationship types' do
      case_relationship = CaseRelationship.new(relationship_type: 'invalid')
      case_relationship.valid?
      expect(case_relationship.errors[:relationship_type]).to include('Relationship type is not valid.')
    end

    it 'requires a relationship type and case relation ids' do
      case_relationship = CaseRelationship.new
      case_relationship.valid?
      expect(case_relationship.errors[:relationship_type]).to include("can't be blank")
      expect(case_relationship.errors[:from_case_id]).to include("can't be blank")
      expect(case_relationship.errors[:to_case_id]).to include("can't be blank")
    end

    it 'rejects to link a case to itself' do
      case_relationship = CaseRelationship.new_case_relationship(
        primary_case_id: @case1.id, related_case_id: @case1.id, relationship_type: 'farmer_on'
      )
      case_relationship.save

      expect(case_relationship.errors[:to_case_id]).to include("A case cannot be linked to itself.")
    end
  end

  after do
    clean_data(CaseRelationship, Child)
  end
end
