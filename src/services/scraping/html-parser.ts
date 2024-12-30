import * as cheerio from 'cheerio';
import type { ScrapingResult } from './types';

export class VintedHtmlParser {
  private static readonly BASE_URL = 'https://www.vinted.fr';

  public static parseItems(html: string): ScrapingResult[] {
    const $ = cheerio.load(html);
    const items: ScrapingResult[] = [];

    $('.feed-grid__item').each((_, element) => {
      const item = $(element);
      const id = item.attr('id') || crypto.randomUUID();
      const title = item.find('.item-title').text().trim();
      const priceText = item.find('.item-price').text().trim();
      const price = parseFloat(priceText.replace('€', '').trim());
      const imageUrl = item.find('img').attr('src') || '';
      const url = this.BASE_URL + item.find('a').attr('href');

      if (title && !isNaN(price)) {
        items.push({
          id,
          title,
          price,
          imageUrl,
          url,
          timestamp: new Date(),
        });
      }
    });

    return items;
  }
}