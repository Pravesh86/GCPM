module Api
  module V1
    class LayersController < ApiController
      def index
        @layers = Layer.preload(:layer_groups).fetch_all(layers_params)
        render json: @layers, meta: { total_layers: @layers.size }, each_serializer: LayerSerializer, include: 'layer_groups'
      end

      private

        def layers_params
          params.permit()
        end
    end
  end
end
