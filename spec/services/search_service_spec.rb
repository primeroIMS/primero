require 'rails_helper'

describe SearchService, search: true do

  describe 'Filter search' do

    before :example do
      reload_model(Child) do
        allow(Field).to receive(:all_filterable_field_names) { %w(sex) }
      end

      @correct_match = Child.create!(data: {name: 'Correct Match1', sex: 'female' })
      @incorrect_match = Child.create!(data: {name: 'Incorrect Match', sex: 'male' })
      Sunspot.commit
    end

    it 'searches with filters' do
      filter = SearchFilters::Value.new(field_name: 'sex', value: 'female')
      search = SearchService.search(Child, [filter])

      expect(search.total).to eq(1)
      expect(search.results.first.name).to eq(@correct_match.name)
    end
  end

  describe 'Authorization' do

    before :example do
      @user_group = UserGroup.new(id: 1, unique_id: "user_group_1")
      @user_group_2 = UserGroup.new(id: 2, unique_id: "user_group_2")
      @agency = Agency.new(id: 1, unique_id: "agency_1", agency_code: "agency_1") ; @agency.save(validate: false)
      @user = User.new( user_name: 'test1', agency: @agency, user_groups: [@user_group]) ; @user.save(validate: false)
      @user2 = User.new( user_name: 'test2', user_groups: [@user_group_2]) ; @user2.save(validate: false)
      @user3 = User.new( user_name: 'test3', agency: @agency, user_groups: [@user_group_2]) ; @user3.save(validate: false)

      @case1 = Child.create!(data: { name: 'Case1', owned_by: @user.user_name })
      @case2 = Child.create!(data: { name: 'Case2', owned_by: @user2.user_name })
      @case3 = Child.create!(data: { name: 'Case3', owned_by: @user2.user_name, assigned_user_names: [@user3.user_name] })
      Sunspot.commit
    end


    it 'limits access for currently associated users if user scope is provided' do
      search = SearchService.search(Child, [], @user)

      expect(search.total).to eq(1)
      expect(search.results.first.name).to eq(@case1.name)
    end

    it 'limits access by user group if group scope is provided' do
      search = SearchService.search(Child, [], { Permission::GROUP => [@user_group.unique_id, @user_group_2.unique_id] })

      expect(search.total).to eq(3)
      expect(search.results.map(&:name)).to include(@case2.name, @case3.name)
    end

    it 'limits access by agency if agency scope is provided' do
      search = SearchService.search(Child, [], { Permission::AGENCY => @agency.unique_id })
      expect(search.total).to eq(2)
      expect(search.results.map(&:name)).to include(@case1.name, @case3.name)
    end

    it "doesn't limit access if no user scope is provided" do
      search = SearchService.search(Child, [], [])

      expect(search.total).to eq(3)
      expect(search.results.map(&:name)).to include(@case1.name, @case2.name, @case3.name)
    end
  end

  after :example do
    Agency.destroy_all
    UserGroup.destroy_all
    User.destroy_all
    Child.destroy_all
  end

end
