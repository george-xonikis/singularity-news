// Express query parameters come as strings or arrays of strings
type QueryValue = string | string[] | undefined;

export class ArticleQueryDto {
  limit: number;
  offset: number;
  page: number;
  topic?: string | undefined;
  search?: string | undefined;
  sortBy: 'views' | 'date';
  order: 'asc' | 'desc';

  constructor(query: { [key: string]: QueryValue }) {
    // Parse limit with default and max
    this.limit = Math.min(
      parseInt(this.extractString(query.limit) || '50') || 50, 
      100
    );
    
    // Handle pagination - support both offset and page
    if (query.page) {
      const page = Math.max(1, parseInt(this.extractString(query.page) || '1') || 1);
      this.page = page;
      this.offset = (page - 1) * this.limit;
    } else {
      this.offset = Math.max(0, parseInt(this.extractString(query.offset) || '0') || 0);
      this.page = Math.floor(this.offset / this.limit) + 1;
    }

    this.topic = this.extractString(query.topic) || undefined;
    this.search = this.extractString(query.search) || undefined;
    
    const sortBy = this.extractString(query.sortBy);
    this.sortBy = (sortBy === 'date') ? 'date' : 'views';
    
    const order = this.extractString(query.order);
    this.order = (order === 'asc') ? 'asc' : 'desc';
  }

  private extractString(value: QueryValue): string | undefined {
    if (typeof value === 'string') {
      return value;
    }
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'string') {
      return value[0];
    }
    return undefined;
  }

  validate(): string[] {
    const errors: string[] = [];

    if (this.limit < 1 || this.limit > 100) {
      errors.push('Limit must be between 1 and 100');
    }

    if (this.offset < 0) {
      errors.push('Offset must be non-negative');
    }

    // sortBy and order are already validated in constructor with defaults

    return errors;
  }
}