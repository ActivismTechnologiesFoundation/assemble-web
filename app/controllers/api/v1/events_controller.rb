module Api
  module V1
    class EventsController < BaseController
      before_action :convert_timestamps, only: [:create, :update]

      def show
        @event = Event.find(params[:id])
        render_event(event)
      end

      def index
        @events = Event.filter(filter_params)
      end

      def create
        success = false
        ActiveRecord::Base.transaction do 
          @event = Event.new(event_params)

          raise ActiveRecord::Rollback unless success = @event.save
        end

        render_event(@event, success)
      end

      def update
        @event = Event.find(params[:id])

        success = @event.update(event_params)

        render_event(@event, success)
      end

      def bulk_upload
        failed, upload_count = Event.load_csv(params[:file_url])
        
        render json: { success: true, failed_events: failed, upload_count: upload_count }
      end

      private 

      def convert_timestamps
        params[:starts_at] = Time.at(params[:starts_at]) if !!params[:starts_at]
        params[:ends_at] = Time.at(params[:ends_at]) if !!params[:ends_at]
      end

      def render_event(event, success=true)
        status = success ? :ok : :unprocessable_entity

        render template: "api/v1/events/show", locals: { event: event }, status: status
      end

      def filter_params
        permitted = [
          :topic_id,
          :page,
          location: [
            :latitude,
            :longitude
          ]
        ]
        params.permit(permitted)
      end

      def event_params 

        params.permit(
          :name, 
          :description, 
          :url,
          :address,
          :latitude,
          :longitude,
          :starts_at, 
          :ends_at,
          topic: [
            :id
          ]
        )
      end
    end
  end
end