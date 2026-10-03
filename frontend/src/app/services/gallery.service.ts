// import { Injectable, inject } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';

// import {
//   GalleryFilters,
//   GalleryResponse
// } from '../models/gallery.model';

// @Injectable({
//   providedIn: 'root'
// })
// export class GalleryService {

//   private readonly http = inject(HttpClient);

//   private readonly apiUrl = '/api/gallery';

//   getGallery(filters: GalleryFilters) {

//     let params = new HttpParams()
//       .set('page', filters.page)
//       .set('pageSize', filters.pageSize);

//     if (filters.category) {
//       params = params.set('category', filters.category);
//     }

//     if (filters.search) {
//       params = params.set('search', filters.search);
//     }

//     return this.http.get<GalleryResponse>(
//       this.apiUrl,
//       { params }
//     );
//   }
// }


import { Injectable } from '@angular/core';
import { delay, Observable, of } from 'rxjs';

import {
  GalleryFilters,
  GalleryResponse
} from '../models/gallery.model';

import {
  MOCK_GALLERY_IMAGES
} from '../mocks/gallery.mock';


@Injectable({
  providedIn: 'root'
})
export class GalleryService {

  getGallery(
    filters: GalleryFilters
  ): Observable<GalleryResponse> {

    /*
     * Make a copy so we never modify
     * the original mock array.
     */
    let results = [
      ...MOCK_GALLERY_IMAGES
    ];


    /*
     * =====================================
     * CATEGORY
     * =====================================
     */

    if (filters.category) {

      results = results.filter(
        image =>
          image.category === filters.category
      );

    }


    /*
     * =====================================
     * SEARCH
     * =====================================
     */

    if (filters.search) {

      const search =
        filters.search
          .trim()
          .toLowerCase();

      results = results.filter(image => {

        const title =
          image.title
            ?.toLowerCase() ?? '';

        const event =
          image.eventName
            ?.toLowerCase() ?? '';

        const description =
          image.description
            ?.toLowerCase() ?? '';

        return (
          title.includes(search) ||
          event.includes(search) ||
          description.includes(search)
        );

      });

    }


    /*
     * =====================================
     * SORT
     * =====================================
     */

    results.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );


    /*
     * =====================================
     * PAGINATION
     * =====================================
     */

    const total =
      results.length;

    const totalPages =
      Math.max(
        1,
        Math.ceil(
          total / filters.pageSize
        )
      );

    const page =
      Math.min(
        Math.max(filters.page, 1),
        totalPages
      );

    const start =
      (page - 1) *
      filters.pageSize;

    const end =
      start +
      filters.pageSize;

    const items =
      results.slice(start, end);


    /*
     * This object mimics exactly what
     * Node will return later.
     */

    const response: GalleryResponse = {

      items,

      page,

      pageSize:
        filters.pageSize,

      total,

      totalPages

    };


    /*
     * delay() is intentional.
     *
     * It simulates a real HTTP request
     * so we can also test the loader.
     */

    return of(response)
      .pipe(
        delay(350)
      );

  }

}