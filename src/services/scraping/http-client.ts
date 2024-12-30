import axios from 'axios';

export class HttpClient {
  private static readonly USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

  public static async fetchPage(url: string): Promise<string> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': this.USER_AGENT,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching page:', error);
      throw new Error('Failed to fetch Vinted page');
    }
  }
}