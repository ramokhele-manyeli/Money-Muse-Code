import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';
import { Category } from '../models/category';
import { DefaultCategory } from '../models/default-category';
import { CategoryCreateDto, CategoryUpdateDto } from '../DTOs/category.dto';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly baseUrl = `${environment.apiUrl}/categories`;
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  
  public categories$ = this.categoriesSubject.asObservable();

  constructor(private http: HttpClient) {}

  private handleError = (error: any) => {
    console.error('Categories service error:', error);
    throw error;
  };

  // Get all categories for the authenticated user (using /user endpoint)
  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/user`).pipe(
      tap(categories => this.categoriesSubject.next(categories)),
      catchError(this.handleError)
    );
  }

  // Get category by ID
  getById(id: string): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/${id}`).pipe(
      catchError(this.handleError)
    );
  }

  // Create new category
  create(dto: CategoryCreateDto): Observable<Category> {
    return this.http.post<Category>(this.baseUrl, dto).pipe(
      tap(newCategory => {
        const currentCategories = this.categoriesSubject.value;
        this.categoriesSubject.next([...currentCategories, newCategory]);
      }),
      catchError(this.handleError)
    );
  }

  // Update existing category
  update(id: string, dto: CategoryUpdateDto): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}/${id}`, dto).pipe(
      tap(updatedCategory => {
        const currentCategories = this.categoriesSubject.value;
        const index = currentCategories.findIndex(cat => cat.id === id);
        if (index !== -1) {
          const updatedCategories = [...currentCategories];
          updatedCategories[index] = updatedCategory;
          this.categoriesSubject.next(updatedCategories);
        }
      }),
      catchError(this.handleError)
    );
  }

  // Delete category
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      tap(() => {
        const currentCategories = this.categoriesSubject.value;
        const filteredCategories = currentCategories.filter(cat => cat.id !== id);
        this.categoriesSubject.next(filteredCategories);
      }),
      catchError(this.handleError)
    );
  }

  // Get default categories (no authentication required)
  getDefaults(): Observable<DefaultCategory[]> {
    return this.http.get<DefaultCategory[]>(`${this.baseUrl}/default`).pipe(
      catchError(this.handleError)
    );
  }

  // Refresh categories from server
  refresh(): Observable<Category[]> {
    return this.getAll();
  }

  // Clear local state (useful for logout)
  clearCategories(): void {
    this.categoriesSubject.next([]);
  }

  // Get current categories from local state
  getCurrentCategories(): Category[] {
    return this.categoriesSubject.value;
  }

  // Token utility methods (matching auth service pattern)
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  setToken(token: string): void {
    localStorage.setItem('token', token);
  }

  removeToken(): void {
    localStorage.removeItem('token');
  }

  isTokenExpired(token?: string): boolean {
    const tokenToCheck = token || this.getToken();
    if (!tokenToCheck) return true;
    
    try {
      const payload = JSON.parse(atob(tokenToCheck.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }
}
