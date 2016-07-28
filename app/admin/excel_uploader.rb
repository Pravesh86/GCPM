ActiveAdmin.register_page "Excel Upload" do
  controller do
    skip_before_filter :verify_authenticity_token
    after_action :reset_keys, only: :create
    def index
      render 'admin/excel_upload/new', :layout => 'active_admin'
    end
    def reset_keys
      Rake::Task['db:keys'].reenable # in case you're going to invoke the same task second time.
      Rake::Task['db:keys'].invoke
    end
  end
   page_action :import, method: :post  do
      importer = ExcelImporter.new(params[:qqfile].tempfile.path)

      if importer.import!
        puts importer.errors.to_json
        render json: {
          success: true,
          errors: importer.errors.to_json
        }

      else

        render json: {
          success: false
        }

      end

    end
end
