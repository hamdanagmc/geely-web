import React, { useEffect, useState } from 'react';
import sanityClient from '../sanityClient'; // Adjust the import based on your project structure

const HighlightedNews = () => {
  const [highlightedNews, setHighlightedNews] = useState([]);

  useEffect(() => {
    sanityClient.fetch(`
      *[_type == "news" && highlight == true]{
        title,
        slug,
        publishDate,
        "url": slug.current
      }
    `).then(data => setHighlightedNews(data));
  }, []);

  return (
    <section className="elementor-section elementor-top-section elementor-element elementor-element-fe80de2 section_padding elementor-section-boxed elementor-section-height-default elementor-section-height-default" data-id="fe80de2" data-element_type="section" data-settings='{"background_background":"classic"}'>
      <div className="elementor-container elementor-column-gap-default">
        <div className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-e1aa065" data-id="e1aa065" data-element_type="column">
          <div className="elementor-widget-wrap elementor-element-populated">
            <div className="elementor-element elementor-element-ae82f96 elementor-widget elementor-widget-shortcode" data-id="ae82f96" data-element_type="widget" data-widget_type="shortcode.default">
              <div className="elementor-widget-container">
                <div className="media_banner banner_bg">
                  <div className="media_banner_carousel owl-carousel owl-loaded owl-drag">
                    <div className="owl-stage-outer">
                      <div className="owl-stage">
                        {highlightedNews.map(news => (
                          <div className="owl-item" key={news.slug}>
                            <div className="banner_block banner_bg">
                              <div className="inner_container">
                                <div className="content">
                                  <h2 className="banner_title">{news.title}</h2>
                                  <span className="text">
                                    <span><strong>{new Date(news.publishDate).toLocaleDateString()}</strong></span>
                                    <a href={`/news/${news.url}`}>Read More</a>
                                  </span>
                                  <span className="date">{new Date(news.publishDate).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="owl-nav">
                      <button type="button" role="presentation" className="owl-prev"><img src="https://geelyksa.com/wp-content/uploads/2021/11/slide-left-2.png" alt="Previous" /></button>
                      <button type="button" role="presentation" className="owl-next"><img src="https://geelyksa.com/wp-content/uploads/2021/11/slide-right-2.png" alt="Next" /></button>
                    </div>
                    <div className="owl-dots disabled"></div>
                  </div>
                </div>
                <div className="elementor-shortcode"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HighlightedNews;
