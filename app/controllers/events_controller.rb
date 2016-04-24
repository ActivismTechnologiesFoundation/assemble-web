class EventsController < ApplicationController
  def index
    @topics = Topic.all_topics
  end

  def upload
  end
end