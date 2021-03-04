
module Api
  module V1
  
    class ArticlesController < ApplicationController
      protect_from_forgery with: :null_session
      before_action :set_article, only: [:show, :update, :destroy]

      # GET /articles
      def index
        page_number = params[:page_number].to_i || 1
        offset = (page_number - 1)  * 10
        last_page = (Article.count.to_f / 10.0).ceil
        last_page = last_page <= page_number

        @articles = Article.all.order(updated_at: :desc).offset(offset).limit(10)
        render json: { articles: @articles, last_page: last_page }
      end

      # GET /articles/1
      def show
        render json: @article
      end

      # POST /articles
      def create
        @article = Article.new(assemble_article_params)

        if @article.save
          render json: @article, status: :created
        else
          render json: @article.errors, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /articles/1
      def update
        # binding.pry
        if @article.update(assemble_article_params)
          @article.save
          render json: @article, status: :ok
        else
          render json: @article.errors, status: :unprocessable_entity
        end
      end

      # DELETE /articles/1
      def destroy
        @article.destroy
      end


      def search
        @articles = Article.search(params[:search])
        sad_face = "😟"
        logger.info("\nArticle to search is:>  #{params[:search].presence || sad_face}\n")
        hit = @articles.present? ? "😁"  : sad_face
        logger.info("HIT: #{hit}")
        logger.info()
        render json: @articles
      end


      private
        # Use callbacks to share common setup or constraints between actions.
        def set_article
          @article = Article.find(params[:id])
        end

        def assemble_article_params
          article_prms = article_params.clone
          article_prms[:article_image] = Article.extract_file_path(article_prms[:article_image], @article&.article_image)
          article_prms
        end



        # def request_api(url)
        #   response = Excon.get(
        #     url,
        #     headers: {
        #       'X-RapidAPI-Host' => URI.parse(url).host,
        #       'X-RapidAPI-Key' => ENV.fetch('RAPIDAPI_API_KEY')
        #     }
        #   )
        #   return nil if response.status != 200
        #   JSON.parse(response.body)
        # end


        # def find_article(title, description, article_image)
        #   request_api(
        #     "https://rss.nytimes.com/services/xml/rss/nyt/Science.xml"
        #   )
        # end

       




        # Only allow a trusted parameter "white list" through.
        def article_params
          params.require(:article).permit(:title, :description, :search, :article_image)
        end
    end
  end
end
