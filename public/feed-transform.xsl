<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
  <xsl:output method="html" encoding="UTF-8" indent="yes"/>
  
  <xsl:template match="/">
    <html>
      <head>
        <title><xsl:value-of select="//channel/title"/> - RSS Feed</title>
        <meta charset="UTF-8"/>
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <link rel="stylesheet" href="/feed-styles.css"/>
        <link rel="icon" href="/favicon.ico"/>
      </head>
      <body>
        <div class="feed-header">
          <h1 class="feed-title">
            <xsl:value-of select="//channel/title"/>
          </h1>
          <p class="feed-description">
            <xsl:value-of select="//channel/description"/>
          </p>
        </div>
        
        <div class="feed-meta">
          <div class="feed-info">
            <strong><xsl:value-of select="count(//item)"/> articles</strong> • 
            Last updated: <xsl:value-of select="//channel/lastBuildDate"/>
          </div>
          <div class="subscribe-links">
            <a href="/feed" class="subscribe-link">RSS</a>
            <a href="/feed?format=atom" class="subscribe-link">Atom</a>
            <a href="/feed?format=json" class="subscribe-link">JSON</a>
          </div>
        </div>

        <div class="feed-items">
          <xsl:for-each select="//item">
            <article class="feed-item">
              <xsl:attribute name="data-category">
                <xsl:choose>
                  <xsl:when test="contains(title, 'Daily Log')">daily-log</xsl:when>
                  <xsl:when test="contains(title, 'Micro Blog')">micro-blog</xsl:when>
                  <xsl:when test="contains(title, 'Word of the Day')">word-of-the-day</xsl:when>
                  <xsl:when test="category[text()='note' or text()='notes']">note</xsl:when>
                  <xsl:otherwise>writing</xsl:otherwise>
                </xsl:choose>
              </xsl:attribute>
              
              <div class="item-header">
                <h2 class="item-title">
                  <a href="{link}" target="_blank">
                    <xsl:value-of select="title"/>
                  </a>
                </h2>
                <time class="item-date">
                  <xsl:value-of select="substring(pubDate, 1, 16)"/>
                </time>
              </div>
              
              <div class="item-description">
                <xsl:value-of select="description"/>
              </div>
              
              <xsl:if test="category">
                <div class="item-tags">
                  <xsl:for-each select="category">
                    <span class="item-tag">
                      <xsl:value-of select="."/>
                    </span>
                  </xsl:for-each>
                </div>
              </xsl:if>
              
              <div style="margin-top: 15px;">
                <a href="{link}" class="item-link" target="_blank">
                  Read full article →
                </a>
              </div>
            </article>
          </xsl:for-each>
        </div>
        
        <footer class="feed-footer">
          <p>
            This is an RSS feed. Subscribe using your favorite feed reader to get updates automatically.
          </p>
          <p>
            <a href="/" style="color: #667eea;">← Back to Lilyslab</a>
          </p>
        </footer>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
