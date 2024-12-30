export class VintedUrlBuilder {
  private static readonly BASE_URL = 'https://www.vinted.fr';

  public static buildSearchUrl(query: string, minPrice?: number, maxPrice?: number): string {
    const params = new URLSearchParams({
      search_text: query,
      order: 'newest_first',
    });

    if (minPrice !== undefined) params.append('price_from', minPrice.toString());
    if (maxPrice !== undefined) params.append('price_to', maxPrice.toString());

    return `${this.BASE_URL}/vetements?${params.toString()}`;
  }
}