require 'rails_helper'

describe Historical do
  before :each do
    RecordHistory.destroy_all
    Child.destroy_all

    @inst = Child.new(data: {
      :created_by => 'primero',
      :created_at => DateTime.new(2009, 5, 5, 5, 5, 5),
      :name => 'Tommy',
      :family_members => [
        { :unique_id => 'abcdef', :name => 'Larry', :relation => 'father' },
        { :unique_id => '123456', :name => 'Mary', :relation => 'mother' },
      ],
      # :violations => {
      #   :killing => [
      #     { :unique_id => 'k1', :date => nil, :notes => 'kill1'}
      #   ],
      # },
    })
    @inst.save
  end

  describe 'history handling' do
    it 'should insert a creation history with correct action' do
      hist = @inst.histories[0]
      hist.action.should == 'create'
    end

    it 'should insert a creation history with user_name set to created_by field' do
      hist = @inst.histories[0]
      hist.user_name.should == @inst.created_by
    end

    it "should not record anything in the history if a save occured with no changes" do
      @inst.save!
      @inst.histories.size.should be 1
    end

    #TODO: This is disabled for now. OK behavior, no?
    xit "should not record empty string in the history if only change was spaces" do
      @inst.data['bio'] = '  '
      @inst.save!
      @inst.histories.size.should be 1
    end

    xit "should not record history on populated field if only change was spaces" do
      @inst.name = "#{@inst.name}    "
      @inst.save!
      @inst.histories.size.should be 1
    end

    it "should insert an update history with the last_updated_by user" do
      @inst.last_updated_by = 'me'
      @inst.name = 'Teddy'
      @inst.save!

      @inst.histories[0].user_name.should == 'me'
    end

    it "should insert an update history with the last_updated_at time" do
      @inst.name = 'Teddy'
      @inst.save!

      @inst.histories[0].datetime.should == @inst.last_updated_at
    end

    it 'should include changes in basic fields' do
      old_name = @inst.name
      @inst.name = 'Timmy'
      @inst.save

      @inst.histories[0].record_changes.should == {
        'name' => { 'from' => old_name, 'to' => 'Timmy' }
      }
    end

    it 'should include deletions in nested fields' do
      prior_family_member = @inst.data['family_members'][0]
      @inst.data['family_members'].delete_at 0
      @inst.save

      @inst.histories[0].record_changes['family_members']['from'].should include prior_family_member
      @inst.histories[0].record_changes['family_members']['to'].should_not include prior_family_member

    end

    it 'should include changes in nested fields' do
      prior_family_member = @inst.data['family_members'][0]
      new_family_member = prior_family_member.clone
      new_family_member['relation'] = 'uncle'

      @inst.data['family_members'][0] = new_family_member
      @inst.save!

      @inst.histories[0].record_changes['family_members']['to'].should include(new_family_member)
      @inst.histories[0].record_changes['family_members']['to'].should_not include(prior_family_member)
      @inst.histories[0].record_changes['family_members']['from'].should_not include(new_family_member)
    end

    xit 'handles nested arrays in nested hashes (e.g. violations)' do
      prior_note = @inst.violations.killing[0].notes
      @inst.violations = @inst.violations.clone.tap do |v|
        v.killing = v.killing.clone.tap do |ks|
          ks[0] = ks[0].clone.tap do |k|
            k.notes = 'kill changed'
          end
        end
      end
      @inst.save!

      @inst.histories[0].record_changes['violations'].should == {
        'killing' => {
          'k1' => {
            'notes' => { 'from' => prior_note, 'to' => 'kill changed' }
          }
        }
      }
    end

    xit 'handles new attachments' do
      file = StringIO.new('abcdefg')
      file.instance_eval { def path; 'file.jpg'; end }
      @inst.create_attachment(:file => file, :name => 'file.jpg')

      @inst.save!
      @inst.histories[0].record_changes['_attachments']['to']['file.jpg']['stub'].should be_truthy
    end
  end

  describe "ordered_histories" do
    it "should assign histories order by datetime of history" do
      child = Child.create
      first_history = RecordHistory.new(datetime: DateTime.new(2010, 1, 1, 1, 1, 2))
      second_history = RecordHistory.new(datetime: DateTime.new(2010, 1, 2, 1, 1, 2))
      third_history = RecordHistory.new(datetime: DateTime.new(2010, 1, 2, 1, 1, 3))
      child.record_histories << [first_history, second_history, third_history]
      child.ordered_histories.map(&:datetime).should == [child.created_at] + [third_history, second_history, first_history].map(&:datetime)
    end
  end

  describe 'last_updated_at' do
    it "updates last_updated_at before saving" do
      DateTime.stub(:now).and_return(Time.utc(2010, "jan", 17, 19, 5, 0))
      child = Child.new
      child.name = 'Bob'
      child.save!
      child.last_updated_at.should == DateTime.parse("2010-01-17 19:05:00UTC")
    end
  end
end
