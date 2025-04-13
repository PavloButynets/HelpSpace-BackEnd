export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }

  export interface S3File extends Express.Multer.File {
    location: string;
}