export interface GalleryImage {
  id: number;
  title: string;
  description?: string;

  category: 'Training' | 'Games' | 'Events';

  eventName?: string;
  eventDate?: string;

  thumbnailUrl: string;
  imageUrl: string;

  createdAt: string;
}

export interface GalleryResponse {
  items: GalleryImage[];

  page: number;
  pageSize: number;

  total: number;
  totalPages: number;
}

export interface GalleryFilters {
  page: number;
  pageSize: number;

  category?: string;
  search?: string;
}