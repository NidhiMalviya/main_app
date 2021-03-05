class EducationRssWorker
  include Sidekiq::Worker

  def perform(loader)
    url = "https://www.hindustantimes.com/feeds/rss/education/rssfeed.xml"
    loader.fetch_articles(url)
  end
end