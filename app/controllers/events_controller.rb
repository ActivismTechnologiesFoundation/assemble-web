class EventsController < ApplicationController
  def index
    @topics = Topic.all
  end
end