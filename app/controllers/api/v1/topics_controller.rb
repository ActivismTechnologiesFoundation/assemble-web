module Api
  module V1
    class TopicsController < BaseController
    	def index
    		@topics = Topic.all
    		render json: @topics
    	end
    end
  end
end
