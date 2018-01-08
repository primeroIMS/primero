require 'rails_helper'

describe PrimeroModel do

  describe 'save_all!' do
    it 'saves all records to the database' do
      children = (1..20).map do |i|
        Child.new(name: "Save All Test Name #{i}")
      end
      Child.save_all! children
      ids = children.map{|c| c.id}
      expect(ids.compact).to have(20).items
      expect(Child.all(keys: ids).all).to have(20).items
    end

    it "doesn't store unmodified nil attributes" do
      child = Child.new(name: "Bill")

      Child.save_all!([child])
      raw = Child.database.get(child.id)
      expect(raw.keys).not_to include('_attachments')

      child = Child.get(child.id)
      child.name = nil
      Child.save_all!([child])
      raw = Child.database.get(child.id)
      expect(raw.keys).to include('name')
      expect(raw.keys).not_to include('_attachments')
    end

  end

end