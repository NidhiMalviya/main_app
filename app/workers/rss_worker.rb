class RssWorker
  include Sidekiq::Worker

  def perform(*args)
    loader = ArticleLoader.new
    AstrologyRssWorker.new.perform(loader)
    EducationRssWorker.new.perform(loader)
    EntertainmentRssWorker.new.perform(loader)
    EnvironmentRssWorker.new.perform(loader)
    IndoreNewsRssWorker.new.perform(loader)
    # loader.fetch_articles
  end
end
