require 'rails_helper'
require 'support/tracing_request_builder'

describe TracingRequestMediaController do
  include TracingRequestBuilder
  include CustomMatchers
  include MiniMagickConversions

  before do
    fake_login
  end

  describe "routing" do
    it "should have a route for a tracing request current photo" do
      { :get => "/tracing_requests/1/photo" }.should route_to(:controller => "tracing_request_media", :action => "show_photo", :tracing_request_id => "1")
    end

    it "should have a route for a tracing request current recorded audio" do
      { :get => "/tracing_requests/1/audio" }.should route_to(:controller => "tracing_request_media", :action => "download_audio", :tracing_request_id => "1")
    end

    it "should have a route for a tracing request specific photo" do
      { :get => "/tracing_requests/c1/photo/p1" }.should route_to(:controller => "tracing_request_media", :action => "show_photo", :tracing_request_id => "c1", :photo_id => "p1")
    end

    it "should have a route for a tracing request specific recorded audio" do
      { :get => "/tracing_requests/c1/audio" }.should route_to(:controller => "tracing_request_media", :action => "download_audio", :tracing_request_id => "c1")
    end

    it "should have a route for requesting a resized version of the current photo" do
      {:get => '/tracing_requests/c1/resized_photo/100'}.should route_to(:controller => "tracing_request_media", :action => "show_resized_photo", :tracing_request_id => "c1", :size => "100")
    end

    it "should have a route for a tracing request specific thumbnail" do
      { :get => "/tracing_requests/c1/thumbnail/t1" }.should route_to(:controller => "tracing_request_media", :action => "show_thumbnail", :tracing_request_id => "c1", :photo_id => "t1")
    end
  end

  describe '#send_photo_data' do
    it 'should add expires header if timestamp is supplied in query params' do
      controller.stub :send_data => nil
      controller.stub :params => { :ts => 'test' }
      controller.should_receive(:expires_in).with(1.year, :public => true)
      controller.send :send_photo_data
    end

    it 'should not add expires header for normal requests' do
      controller.stub :send_data => nil
      controller.stub :params => { }
      controller.should_not_receive(:expires_in)
      controller.send :send_photo_data
    end
  end

  describe "response" do
    it "should return current tracing requests's photo" do
      given_a_tracing_request.
              with_id("1").
              with_photo(uploadable_photo, 'current')

      get :show_photo, params: {:tracing_request_id => "1"}
      response.should redirect_to(:photo_id => 'current', :ts => Date.today)
    end

    it "should return requested tracing requests's photo" do
      given_a_tracing_request.
              with_id("1")
              with_photo(uploadable_photo, "current").
              with_photo(uploadable_photo_jeff, "other", false)

      get :show_photo, params: {:tracing_request_id => "1", :photo_id => "other"}
      response.should represent_inline_attachment(uploadable_photo_jeff)
    end

    it "should return current tracing requests's photo resized to a particular size" do
      given_a_tracing_request.
              with_id("1").
              with_photo(uploadable_photo, 'current')

      get :show_resized_photo, params: {:tracing_request_id => "1", :size => 300}
      response.should redirect_to(:photo_id => 'current', :ts => Date.today)
    end

    it "should return current tracing requests's photo resized to a particular size" do
      given_a_tracing_request.
              with_id("1").
              with_photo(uploadable_photo, 'current')

      get :show_resized_photo, params: {:tracing_request_id => "1", :photo_id => 'current', :size => 300}
      to_image(response.body)[:width].should == 300
    end

    it "should return requested tracing requests's thumbnail" do
      given_a_tracing_request.
              with_id("1")
      with_photo(uploadable_photo_jeff).
              with_photo(uploadable_photo, "other", false)

      get :show_thumbnail, params: {:tracing_request_id => "1", :photo_id => "other"}

      thumbnail = to_thumbnail(160, uploadable_photo.path)
      response.should represent_inline_attachment(thumbnail)
    end

    it "should return no photo available clip when no image is found" do
      given_a_tracing_request.
              with_id("1").
              with_no_photos

      get :show_photo, params: {:tracing_request_id => "1"}
      response.should redirect_to(:photo_id => '_missing_')
    end

    it "should return no photo available clip when no image is found" do
      given_a_tracing_request.
              with_id("1").
              with_no_photos

      get :show_photo, params: {:tracing_request_id => "1", :photo_id => '_missing_'}
      response.should represent_inline_attachment(no_photo_clip)
    end

    it "should redirect to proper cacheable URL if photo ID is not given" do
      given_a_tracing_request.
            with_id("1").
            with_photo(uploadable_photo_jeff).
            with_photo(uploadable_photo, "other", false).
            with(:current_photo_key => 'test').
            with(:last_updated_at => 'test')

      get :show_thumbnail, params: {:tracing_request_id => "1"}
      response.should redirect_to(:photo_id => 'test', :ts => 'test')
    end
  end

  describe "download audio" do
    it "should return an amr audio file associated with a child" do
        given_a_tracing_request.
                with_id('1').
                with_unique_identifier('tracing_request123').
                with_audio(uploadable_audio_amr)

       get :download_audio, params: {:tracing_request_id => '1'}
       response.should represent_attachment(uploadable_audio_amr, "audio_tracing_request123.amr")
    end
    it "should return an mp3 audio file associated with a child" do
       given_a_tracing_request.
               with_id('1').
               with_unique_identifier('tracing_request123').
               with_audio(uploadable_audio_mp3)

      get :download_audio, params: {:tracing_request_id => '1'}
      response.should represent_attachment(uploadable_audio_mp3, "audio_tracing_request123.mp3")
    end
  end
end
