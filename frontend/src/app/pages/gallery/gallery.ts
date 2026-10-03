import {
  Component,
  DestroyRef,
  inject,
  signal
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged
} from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { HeaderComponent } from '../../components/header/header.component';
import { GalleryService } from '../../services/gallery.service';
import { GalleryImage } from '../../models/gallery.model';


type GalleryCategory =
  'All' |
  'Training' |
  'Games' |
  'Events';


@Component({
  selector: 'app-gallery',

  imports: [
    HeaderComponent,
    FormsModule
  ],

  templateUrl: './gallery.html',
  styleUrl: './gallery.css'
})
export class Gallery {

  private readonly galleryService = inject(GalleryService);
  private readonly destroyRef = inject(DestroyRef);

  readonly categories: GalleryCategory[] = [
    'All',
    'Training',
    'Games',
    'Events'
  ];

  readonly images = signal<GalleryImage[]>([]);

  readonly selectedCategory =
    signal<GalleryCategory>('All');

  readonly selectedImage =
    signal<GalleryImage | null>(null);

  readonly loading = signal(false);

  readonly page = signal(1);

  readonly pageSize = 6;

  readonly total = signal(0);

  readonly totalPages = signal(0);

  readonly search = signal('');

  private readonly searchSubject =
    new Subject<string>();


  constructor() {

    this.searchSubject
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(value => {

        this.search.set(value);

        this.page.set(1);

        this.loadGallery();

      });

    this.loadGallery();
  }


  loadGallery(): void {

    this.loading.set(true);

    const category =
      this.selectedCategory() === 'All'
        ? undefined
        : this.selectedCategory();

    this.galleryService
      .getGallery({
        page: this.page(),
        pageSize: this.pageSize,
        category,
        search: this.search() || undefined
      })
      .subscribe({

        next: response => {

          this.images.set(response.items);

          this.total.set(response.total);

          this.totalPages.set(response.totalPages);

          this.loading.set(false);
        },

        error: error => {

          console.error(
            'Error loading gallery',
            error
          );

          this.loading.set(false);
        }

      });
  }


  selectCategory(
    category: GalleryCategory
  ): void {

    if (
      this.selectedCategory() === category
    ) {
      return;
    }

    this.selectedCategory.set(category);

    this.page.set(1);

    this.loadGallery();
  }


  onSearch(value: string): void {
    this.searchSubject.next(value.trim());
  }


  goToPage(page: number): void {

    if (
      page < 1 ||
      page > this.totalPages() ||
      page === this.page()
    ) {
      return;
    }

    this.page.set(page);

    this.loadGallery();

    window.scrollTo({
      top: 420,
      behavior: 'smooth'
    });
  }


  previousPage(): void {

    if (this.page() > 1) {
      this.goToPage(this.page() - 1);
    }
  }


  nextPage(): void {

    if (this.page() < this.totalPages()) {
      this.goToPage(this.page() + 1);
    }
  }


  openImage(image: GalleryImage): void {

    this.selectedImage.set(image);

    document.body.style.overflow =
      'hidden';
  }


  closeImage(): void {

    this.selectedImage.set(null);

    document.body.style.overflow = '';
  }
}