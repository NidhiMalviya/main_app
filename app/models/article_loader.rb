class ArticleLoader

  def fetch_articles(url, provider = "Hindustan Times")
    Rails.logger.debug('Fetching articles')

    # url = 'https://www.hindustantimes.com/feeds/rss/business/rssfeed.xml'
    Rails.logger.debug("Fetching URL: #{url}")

    response = Feedjira.parse(
      Excon.get(url).body
    )


    Rails.logger.debug('Creating articles')
    response.entries.each do |item|
      begin
       Article.find_or_create_by(
         {
           title: item.title,
           description: process_description(item.summary),
           article_image: extract_image(item.image),
           source: item.url,
           news_type: item.categories.first,
           provider_name: provider
         }
        )
      rescue Exception => e
        Rails.logger.warn(e.message)
        next
      end
    end
  end

  def process_description(desc)
    (desc.start_with?('rr') && desc.end_with?('rr')) ? desc[2...-2] : desc
  end

  def extract_image(content)
    Base64.encode64(
      Excon.get(content).body.to_s
    )
  end
end