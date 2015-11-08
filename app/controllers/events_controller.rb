class EventsController < ApplicationController
  def index
    @topics = Topic.all_topics
  end
end