require 'rails_helper'

_Child = Class.new(Child) do
  def self.name; 'Child'; end
  def self.to_s; self.name; end

  include Importable
  include Record

  def self.get_unique_instance(attributes)
    self.find_by_unique_identifier(attributes['unique_identifier'])
  end

  #TODO: This test has to be fixed for now we're getting rid of couchdb things.
  #property :age, Integer
end

xdescribe Importable do
  before :each do
    _Child.any_instance.stub(:field_definitions).and_return([])
  end
  before :all do
    # Since we don't delete the database after each test...
    @ids = (1..1/0.0).lazy.map {|n| "import_child#{n}"}
  end

  it 'uses the same _id that is included in the import' do
    c = _Child.create(:name => 'Larry', :id => @ids.next)

    new_id = @ids.next
    _Child.import({'_id' => new_id,
                   'unique_identifier' => c.unique_identifier,
                   'model_type' => c.class.name,
                   'name' => 'Cary'}, nil).save!

    _Child.get(new_id).name.should == 'Cary'
  end

  it 'deletes old records if the id is different' do
    c = _Child.create(:name => 'Larry', :id => @ids.next)

    _Child.import({'_id' => @ids.next,
                   'unique_identifier' => c.unique_identifier,
                   'model_type' => c.class.name,
                   'age' => 12}, nil).save!

    _Child.get(c.id).should be_nil
  end
end
