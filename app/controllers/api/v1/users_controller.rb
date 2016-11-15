module Api
  module V1
    class UsersController < ApiController
      def index
        users = User.where("email like ? or name like ?", "%#{users_params}%","%#{users_params}%").where.not('confirmed_at is null').order('name ASC')
        render json: users, each_serializer: UserSearchSerializer
      end
      private
      def users_params
        params.require(:q)
      end
    end
  end
end
