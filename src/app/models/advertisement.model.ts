export interface Advertisment {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  breed?: string;
  age?: number;
  gender: 'Macho' | 'Hembra';
  location: string;
  images: string[];
  contactPhone?: string;
  contactEmail?: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar?: string;
  sellerRating?: number;
  createdAt: Date;
  features: string[];
  isFavorite?: boolean;
  relatedAds?: RelatedAd[];
}

export interface RelatedAd {
  id: string;
  title: string;
  price: number;
  image: string;
  location: string;
}

export interface Seller {
  id: string;
  name: string;
  avatar?: string;
  rating: number;
  phone?: string;
  email?: string;
  memberSince: Date;
}
