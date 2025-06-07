import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { map } from 'rxjs/operators';

export interface PurchaseHistoryIdDto {
  buyerId: number;
  advertisementId: number;
}

export interface PurchaseHistoryDto {
  buyer: number;
  date: string; // ISO date string format
  advertisement: number;
}

/**
 * Frontend model enriched with extra properties
 */
export interface PurchaseHistory extends PurchaseHistoryDto {
  formattedDate?: string;
  buyerInfo?: { name: string; email: string };
  advertisementInfo?: { title: string; price: number; image?: string };
}

@Injectable({
  providedIn: 'root'
})
export class PurchaseHistoryService {
  private endpoint = '/purchaseHistory';

  constructor(private apiService: ApiService) { }

  /**
   * Create a new purchase history record
   */
  createPurchaseHistory(purchaseHistory: PurchaseHistoryDto): Observable<PurchaseHistoryDto> {
    return this.apiService.post<PurchaseHistoryDto>(this.endpoint, purchaseHistory);
  }

  /**
   * Get purchase history by ID (complex ID consisting of buyer and advertisement IDs)
   */
  getById(id: PurchaseHistoryIdDto): Observable<PurchaseHistoryDto> {
    return this.apiService.get<PurchaseHistoryDto>(`${this.endpoint}/${id.buyerId}/${id.advertisementId}`);
  }

  /**
   * Get all purchase history by user mail
   */
  findAllByMail(mail: string): Observable<PurchaseHistoryDto[]> {
    return this.apiService.get<PurchaseHistoryDto[]>(`${this.endpoint}/all/${mail}`);
  }

  /**
   * Delete a purchase history record
   */
  deletePurchaseHistory(id: PurchaseHistoryIdDto): Observable<any> {
    // Converting the complex ID object to path parameters
    return this.apiService.delete(`${this.endpoint}/${id.buyerId}/${id.advertisementId}`);
  }

  /**
   * Get all purchase history with enhanced frontend properties
   * This will need additional calls to user and advertisement services
   * to enrich the data
   */
  getAllEnhanced(): Observable<PurchaseHistory[]> {
    return this.apiService.get<PurchaseHistoryDto[]>(`${this.endpoint}/all`).pipe(
      map(history => history.map(item => this.enhancePurchaseHistory(item)))
    );
  }

  /**
   * Enhances a purchase history DTO with frontend-specific properties
   */
  private enhancePurchaseHistory(dto: PurchaseHistoryDto): PurchaseHistory {
    // Format date to local format
    const purchaseDate = new Date(dto.date);
    const formattedDate = new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(purchaseDate);

    return {
      ...dto,
      formattedDate,
      // In a real app, we'd call user and advertisement services to get this data
      // For now, provide placeholder values
      buyerInfo: {
        name: `Usuario ${dto.buyer}`,
        email: `user${dto.buyer}@example.com`
      },
      advertisementInfo: {
        title: `Anuncio ${dto.advertisement}`,
        price: 0
      }
    };
  }
}
