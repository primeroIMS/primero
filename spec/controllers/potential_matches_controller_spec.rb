require 'rails_helper'

describe PotentialMatchesController do
  before :all do
    SystemSettings.all.each &:destroy
    SystemSettings.create(
        default_locale: 'en',
        primary_age_range: 'primary', age_ranges: { primary: [1..2,3..4] }
    )

    # Create child form
    FormSection.all.each &:destroy
    fields = [
        Field.new({"name" => "name",
                   "type" => "text_field",
                   "display_name_all" => "Full Name",
                   "matchable" => true
                  }),
        Field.new({"name" => "name_nickname",
                   "type" => "text_field",
                   "display_name_all" => "Nickname",
                   "matchable" => true
                  }),
        Field.new({"name" => "age",
                   "type" => "numeric_field",
                   "display_name_en" => "Age",
                   "matchable" => true
                  })
    ]
    form = FormSection.new(
        :unique_id => "form_section_test",
        :parent_form=>"case",
        "visible" => true,
        :order_form_group => 50,
        :order => 15,
        :order_subform => 0,
        :form_group_name => "Form Section Test",
        "editable" => true,
        "name_all" => "Form Section Test",
        "description_all" => "Form Section Test",
        :fields => fields
    )
    form.save!

    # Create Tracing Request form
    fields = [
        Field.new({"name" => "name",
                   "type" => "text_field",
                   "display_name_en" => "Name",
                   "matchable" => true
                  }),
        Field.new({"name" => "name_nickname",
                   "type" => "text_field",
                   "display_name_en" => "Nickname",
                   "matchable" => true
                  }),
        Field.new({"name" => "age",
                   "type" => "numeric_field",
                   "display_name_en" => "Age",
                   "matchable" => true
                  })
    ]

    tr_form = FormSection.create_or_update_form_section(
        {
            :unique_id=> "form_section_tracing_request_subform",
            "visible" => true,
            "is_nested" => true,
            :order => 1,
            "editable" => true,
            :fields => fields,
            :perm_enabled => true,
            :parent_form=>"tracing_request",
            "name_all" => "Form Section With Dates Fields",
            "description_all" => "Form Section With Dates Fields",
        }
    )

    tracing_request_fields = [
        Field.new(
            {
                "name" => "tracing_request_subform_section",
                "type" => "subform",
                "editable" => true,
                "subform_section_id" => tr_form.unique_id,
                "display_name_en" => "Tracing Request"
            }
        )
    ]

    FormSection.create_or_update_form_section(
        {
            :unique_id => "tracing_request_tracing_request",
            :parent_form=>"tracing_request",
            "visible" => true,
            :order_form_group => 30,
            :order => 30,
            :order_subform => 0,
            :form_group_name => "Tracing Request",
            "editable" => true,
            "mobile_form" => true,
            :fields => tracing_request_fields,
            "name_en" => "Tracing Request",
            "description_en" => "Tracing Request"
        }
    )
  end

  before :each do
    Child.refresh_form_properties
    Child.all.each &:destroy

    TracingRequest.refresh_form_properties
    TracingRequest.all.each &:destroy

    User.all.each &:destroy
  end

  after :all do
    clean_up_objects
  end

  let(:child_attributes) {
    {
        name: 'child1',
        name_nickname: 'johnathan',
        age: 15,
        sex: 'male'
    }
  }
  let(:tr_attributes) {
    {
        relation_name: 'mother',
        inquiry_date: '12-Nov-2018',
        tracing_request_subform_section: [
            { name_nickname: 'johnathan', age: 15, name: 'child1', sex: 'male' }
        ]
    }
  }

  describe '#index' do
    describe 'authorize case to trace FTR' do
      context 'when user has authorized permissions' do
        it 'returns success with manage permission on case' do
          superuser_permissions = [
              Permission.new(resource: Permission::CASE, actions: [Permission::MANAGE]),
              Permission.new(:resource => Permission::POTENTIAL_MATCH, :actions => [Permission::READ])
          ]
          roles = [Role.new(permissions_list: superuser_permissions)]

          superuser = create(:user)
          superuser.stub(:roles).and_return(roles)

          child = Child.create(child_attributes.merge({owned_by: superuser.user_name}))
          tr = TracingRequest.create(tr_attributes.merge({owned_by: superuser.user_name}))

          fake_login superuser
          get :index, params: {match: child.id, type: 'case'}

          expect(response.status).to eq 200
          expect(assigns[:type]).to eq 'case'
        end

        it 'returns success with find_tracing_match permission on case' do
          ftr_manager_permissions = [
              Permission.new(resource: Permission::CASE, actions: [Permission::FIND_TRACING_MATCH]),
              Permission.new(:resource => Permission::POTENTIAL_MATCH, :actions => [Permission::READ])
          ]
          roles = [Role.new(permissions_list: ftr_manager_permissions)]

          ftr_manager = create(:user)
          ftr_manager.stub(:roles).and_return(roles)

          child = Child.create(child_attributes.merge({owned_by: ftr_manager.user_name}))
          tr = TracingRequest.create(tr_attributes.merge({owned_by: ftr_manager.user_name}))

          fake_login ftr_manager
          get :index, params: {match: child.id, type: 'case'}

          expect(response.status).to eq 200
          expect(assigns[:type]).to eq 'case'
        end
      end

      context 'when user has unauthorized permissions' do
        it 'returns unauthorized without find_tracing_match permission on case' do
          user_permissions = [
              Permission.new(resource: Permission::CASE, actions: [Permission::VIEW_PHOTO]),
              Permission.new(:resource => Permission::POTENTIAL_MATCH, :actions => [Permission::READ])
          ]
          roles = [Role.new(permissions_list: user_permissions)]

          user = create(:user)
          user.stub(:roles).and_return(roles)

          child = Child.create(child_attributes.merge({owned_by: user.user_name}))
          tr = TracingRequest.create(tr_attributes.merge({owned_by: user.user_name}))

          fake_login user
          get :index, params: {match: child.id, type: 'case'}

          expect(response.status).to eq 403
        end
      end
    end

    describe 'authorize trace to case FTR' do
      context 'when user has authorized permissions' do
        it 'returns success with read permission on potential_match' do
          user_permissions = [
              Permission.new(:resource => Permission::POTENTIAL_MATCH, :actions => [Permission::READ])
          ]
          roles = [Role.new(permissions_list: user_permissions)]

          user = create(:user)
          user.stub(:roles).and_return(roles)

          child = Child.create(child_attributes.merge({owned_by: user.user_name}))
          tr = TracingRequest.create(tr_attributes.merge({owned_by: user.user_name}))

          fake_login user
          get :index, params: {match: "#{tr.id}::#{tr.traces.first.unique_id}"}

          expect(response.status).to eq 200
          expect(assigns[:type]).to eq 'tracing_request'
        end
      end
    end
  end
end
