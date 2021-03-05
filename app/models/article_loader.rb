class ArticleLoader

  def fetch_articles(url)
    Rails.logger.debug('Fetching articles')

    # url = 'https://www.hindustantimes.com/feeds/rss/business/rssfeed.xml'
    Rails.logger.debug("Fetching URL: #{url}")

    response = Hash.from_xml(
      Excon.get(url).body
    )

    Rails.logger.debug('Creating articles')
    response.dig("rss", "channel", "item").each do |item|
      begin
       Article.find_or_create_by(
         {
           title: item["title"],
           description: item["description"],
           article_image: extract_image(item["content"])
         }
        )
      rescue Exception => e
        Rails.logger.warn(e.message)
        next
      end
    end
  end

  def extract_image(content)
    Base64.encode64(
      Excon.get(content["url"]).body.to_s
    )
  end
end