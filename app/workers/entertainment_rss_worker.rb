class EntertainmentRssWorker
  include Sidekiq::Worker

  def perform(loader)
    url = "https://www.hindustantimes.com/feeds/rss/entertainment/rssfeed.xml"
    loader.fetch_articles(url)
  end
end