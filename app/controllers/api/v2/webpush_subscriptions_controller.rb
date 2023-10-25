# frozen_string_literal: true

# Copyright (c) 2014 - 2023 UNICEF. All rights reserved.

# API controller for Webpush
class Api::V2::WebpushSubscriptionsController < ApplicationApiController
  before_action :webpush_subscription_params, only: %i[edit update current]
  before_action :verify_webpush_enabled

  def index
    @webpush_subscriptions = WebpushSubscription.list(current_user, params)
  end

  def create
    @webpush_subscription = WebpushSubscription.current_or_new_with_user(current_user, webpush_subscription_params)

    @webpush_subscription.save!
  end

  def current
    @webpush_subscription = WebpushSubscription.current(current_user, webpush_subscription_params)
    raise ActiveRecord::RecordNotFound if @webpush_subscription.blank?

    if webpush_subscription_params[:disabled] == true
      @webpush_subscription.disabled = webpush_subscription_params[:disabled]
    end
    @webpush_subscription.updated_at = DateTime.now
    @webpush_subscription.save!
  end

  def model_class
    WebpushSubscription
  end

  private

  def verify_webpush_enabled
    return if Rails.configuration.x.webpush.enabled

    raise Errors::WebpushNotEnabled
  end

  def webpush_subscription_params
    params.require(:data).permit(WebpushSubscription.permitted_api_params)
  end
end
