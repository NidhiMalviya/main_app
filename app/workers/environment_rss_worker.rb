class EnvironmentRssWorker
  include Sidekiq::Worker

  def perform(loader)
    url = "https://www.hindustantimes.com/feeds/rss/environment/rssfeed.xml"
    loader.fetch_articles(url)
  end
end