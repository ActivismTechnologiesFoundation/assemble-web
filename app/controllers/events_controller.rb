class EventsController < ApplicationController
  def index
    @topics = Topic.all_topics
  end

  def upload
    head :not_found if params[:token] != ENV['BULK_UPLOAD_TOKEN'] && Rails.env.production?
  end
end