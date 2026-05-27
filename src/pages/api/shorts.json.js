export const prerender = false;

export async function GET() {
  try {
    const response = await fetch("https://www.youtube.com/feeds/videos.xml?channel_id=UC0JY_8lulrA0y-QDTiasb-Q");
    const xmlText = await response.text();
    
    // Lightweight and robust regex-based XML parser for stable YouTube RSS feed
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    const entries = [];
    let match;
    
    while ((match = entryRegex.exec(xmlText)) !== null) {
      const entryHtml = match[1];
      
      const videoIdMatch = /<yt:videoId>([^<]+)<\/yt:videoId>/.exec(entryHtml);
      const titleMatch = /<title>([^<]+)<\/title>/.exec(entryHtml);
      const linkMatch = /<link[^>]+href="([^"]+)"/.exec(entryHtml);
      const thumbnailMatch = /<media:thumbnail[^>]+url="([^"]+)"/.exec(entryHtml);
      const descriptionMatch = /<media:description>([\s\S]*?)<\/media:description>/.exec(entryHtml);
      const publishedMatch = /<published>([^<]+)<\/published>/.exec(entryHtml);
      
      if (videoIdMatch && titleMatch) {
        const title = titleMatch[1]
          .replace(/&amp;/g, '&')
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&#39;/g, "'");
          
        const link = linkMatch ? linkMatch[1] : `https://www.youtube.com/watch?v=${videoIdMatch[1]}`;
        const description = descriptionMatch ? descriptionMatch[1] : '';
        
        // A video is classified as a Short if link contains '/shorts/' or description contains '#shorts'
        const isShort = link.includes('/shorts/') || description.toLowerCase().includes('#shorts');
          
        entries.push({
          id: videoIdMatch[1],
          title: title,
          link: link,
          thumbnail: thumbnailMatch ? thumbnailMatch[1] : `https://img.youtube.com/vi/${videoIdMatch[1]}/hqdefault.jpg`,
          description: description,
          published: publishedMatch ? publishedMatch[1] : '',
          isShort: isShort
        });
      }
    }
    
    return new Response(JSON.stringify({ success: true, videos: entries }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "public, max-age=600" // Cache for 10 minutes to respect YouTube limits and ensure speedy delivery
      }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}
