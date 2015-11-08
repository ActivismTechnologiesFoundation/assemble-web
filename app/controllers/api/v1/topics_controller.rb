module Api
  module V1
    class TopicsController < BaseController
    	def index
    		render json: Topic.all_topics
    	end
    end
  end
end
