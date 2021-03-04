class RssWorker
  include Sidekiq::Worker

  def perform(*args)
    loader = ArticleLoader.new
    AstrologyRssWorker.new.perform(loader)
    # loader.fetch_articles
  end
end
