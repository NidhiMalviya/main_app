class IndoreNewsRssWorker
  include Sidekiq::Worker

  def perform(loader)
    url = "https://www.hindustantimes.com/feeds/rss/entertainment/hollywood/rssfeed.xml"
    loader.fetch_articles(url)
  end
end
