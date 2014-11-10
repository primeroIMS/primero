require 'spec/support/matchers/attachment_response'
include CustomMatchers

Then /^I should see the photo of "([^\"]*)"$/ do |child_name|
  check_link(response, child_name) {|child| child_resized_photo_path(child, child.primary_photo_id, 328)}
end

Then /^I should see the thumbnail of "([^\"]*)"$/ do |child_name|
  check_link(response, child_name) {|child| child_thumbnail_path(child, child.primary_photo_id)}
end

Then /^I should see the thumbnail of "([^\"]*)" with timestamp "([^"]*)"$/ do |name, timestamp|
  thumbnail = all("//img[@alt='#{name}' and contains(@src,'#{timestamp}')]").first
  thumbnail.should_not be_nil
  thumbnail['src'].should =~ /photo.*-#{timestamp}/
end

Then /^I should see "([^\"]*)" thumbnails$/ do |number|
  thumbnails = all("//fieldset[contains(@id, '_photos_and_audio')]//div[@class='thumbnails photos']//div[@class='thumbnail']//a//img")
  thumbnails.size.should eq(number.to_i)
end

Then /^I should see "([^\"]*)" thumbnails on edit$/ do |number|
  thumbnails = all("//fieldset[contains(@id, '_photos_and_audio')]//img")
  thumbnails.size.should eq(number.to_i)
end

def check_link(response, child_name)
  child = find_child_by_name child_name
  image_link = yield(child)
  page.body.should have_css("img[src^='#{image_link}']")
end

Then /^I should see the "([^"]*)" of image$/ do |selector|
  page.has_css?("#{selector}", :visible => true)
end
