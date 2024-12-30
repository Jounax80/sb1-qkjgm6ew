import { HttpClient } from './http-client';
import { VintedUrlBuilder } from './url-builder';
import { VintedHtmlParser } from './html-parser';
import type { ScrapingConfig, ScrapingResult } from './types';

export class VintedScraper {
  private static instance: VintedScraper | null = null;
  private isScanning = false;
  private scanInterval: NodeJS.Timeout | null = null;

  private constructor() {}

  public static getInstance(): VintedScraper {
    if (!VintedScraper.instance) {
      VintedScraper.instance = new VintedScraper();
    }
    return VintedScraper.instance;
  }

  public async searchItems(query: string, minPrice?: number, maxPrice?: number): Promise<ScrapingResult[]> {
    const url = VintedUrlBuilder.buildSearchUrl(query, minPrice, maxPrice);
    const html = await HttpClient.fetchPage(url);
    return VintedHtmlParser.parseItems(html);
  }

  public startScanning(
    configs: ScrapingConfig[],
    callback: (items: ScrapingResult[]) => void,
    interval = 60000 // 1 minute default
  ): void {
    if (this.isScanning) return;
    this.isScanning = true;

    const scan = async () => {
      try {
        const allResults = await Promise.all(
          configs.map(({ query, minPrice, maxPrice }) =>
            this.searchItems(query, minPrice, maxPrice)
          )
        );

        const newItems = allResults.flat();
        if (newItems.length > 0) {
          callback(newItems);
        }
      } catch (error) {
        console.error('Scanning error:', error);
      }
    };

    // Initial scan
    scan();

    // Set up interval for subsequent scans
    this.scanInterval = setInterval(scan, interval);
  }

  public stopScanning(): void {
    if (this.scanInterval) {
      clearInterval(this.scanInterval);
      this.scanInterval = null;
    }
    this.isScanning = false;
  }
}