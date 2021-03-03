class Article < ApplicationRecord
  #validates :title, presence: { message: "must be given please" }

  def self.search(search)
    if search
      Article.where("title LIKE '%#{search}%' OR description LIKE '%#{search}%'")
    else
      Article.all
    end
  end

  def self.extract_file_path(dispatch_object, article_image = nil)
    provided_file = dispatch_object&.tempfile&.to_path
    return article_image if provided_file.nil? && article_image.present?

    Base64.encode64(
      File.open(
        ( provided_file || "#{Rails.root.join('app', 'assets', 'images')}/user.png")
      ).read
    )
  end
end
