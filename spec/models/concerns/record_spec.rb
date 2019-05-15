require 'rails_helper'

describe Record do

  describe 'update_properties' do
    it 'updates last_updated_by with the given user even if provided in the attributes' do
      c = Child.new("name" => "Bob")
      c.save!
      c.update_properties({"last_updated_by" => "random guy", "name" => "Rob"}, 'primero')
      c.last_updated_by.should == 'primero'
    end
  end

  describe Record::Utils do
    describe '.merge_data' do

      it 'replaces old values for new values in a hash' do
        old = { 'sex' => 'male', 'age' => 12 }
        new = { 'sex' => 'male', 'age' => 14 }
        result = Record::Utils.merge_data(old, new)

        expect(result).to eql({ 'sex' => 'male', 'age' => 14 })
      end

      it 'keeps the key/values in the old hash if they are not present in the new hash' do
        old = { 'sex' => 'male', 'age' => 12, 'registration_date' => Date.new(2019,1,1) }
        new = { 'sex' => 'male', 'age' => 14 }
        result = Record::Utils.merge_data(old, new)

        expect(result).to eql({ 'sex' => 'male', 'age' => 14, 'registration_date' => Date.new(2019,1,1)  })
      end

      it 'adds keys/values from the new hash' do
        old = { 'sex' => 'male', 'age' => 12 }
        new = { 'sex' => 'male', 'age' => 14, 'status' => 'open' }
        result = Record::Utils.merge_data(old, new)

        expect(result).to eql({ 'sex' => 'male', 'age' => 14, 'status' => 'open' })
      end

      describe 'for arrays of hashes' do

        it "merges arrays of hashes using the 'unique_id' hash key" do
          old = { 'family_details' => [
              {'unique_id' => '1', 'relation_type' => 'mother', 'age' => 33},
              {'unique_id' => '2', 'relation_type' => 'father', 'age' => 32}
          ] }
          new = { 'family_details' => [
              {'unique_id' => '2', 'relation_type' => 'father', 'age' => 32},
              {'unique_id' => '1', 'relation_type' => 'mother', 'age' => 35}
          ] }
          result = Record::Utils.merge_data(old, new)

          expect(result).to eql( { 'family_details' => [
              {'unique_id' => '1', 'relation_type' => 'mother', 'age' => 35},
              {'unique_id' => '2', 'relation_type' => 'father', 'age' => 32}
          ] })
        end

        it "keeps the old hashes and merges the hashes found in the new array" do
          old = { 'family_details' => [
              {'unique_id' => '1', 'relation_type' => 'mother', 'age' => 33},
              {'unique_id' => '2', 'relation_type' => 'father', 'age' => 32}
          ] }
          new = { 'family_details' => [
              {'unique_id' => '1', 'relation_type' => 'mother', 'age' => 35}
          ] }
          result = Record::Utils.merge_data(old, new)

          expect(result).to eql( { 'family_details' => [
              {'unique_id' => '1', 'relation_type' => 'mother', 'age' => 35},
              {'unique_id' => '2', 'relation_type' => 'father', 'age' => 32}
          ] })
        end


        #[A, B C] append [A*, B, D] should yield [A*, B, C, D]
        it "preserves old hash values not found in the new array and appends the new hashes" do
          old = { 'family_details' => [
              {'unique_id' => '1', 'relation_type' => 'mother', 'age' => 33},
              {'unique_id' => '2', 'relation_type' => 'father', 'age' => 32}
          ] }
          new = { 'family_details' => [
              {'unique_id' => '1', 'relation_type' => 'mother', 'age' => 35},
              {'unique_id' => '3', 'relation_type' => 'uncle', 'age' => 50}
          ] }
          result = Record::Utils.merge_data(old, new)

          expect(result).to eql( { 'family_details' => [
              {'unique_id' => '1', 'relation_type' => 'mother', 'age' => 35},
              {'unique_id' => '2', 'relation_type' => 'father', 'age' => 32},
              {'unique_id' => '3', 'relation_type' => 'uncle', 'age' => 50}
          ] })
        end

      end

    end


  end

end
