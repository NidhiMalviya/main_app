class AstrologyRssWorker
  include Sidekiq::Worker

  def perform(loader)
    url = "https://www.hindustantimes.com/feeds/rss/astrology/rssfeed.xml"
    loader.fetch_articles(url)
  end
end
