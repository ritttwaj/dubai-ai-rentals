// types/index.ts

export interface Property {
  id: number;
  title: string;
  area: string;
  building: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  furnishing: string;
  videoUrl?: string;
  thumbnail: string;
  amenities: string[];
  description: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  aiSummary: string;
  featured: boolean;
  available: boolean;
  moveInDate: string;
  floor: number;
  viewType: string;
  parking: number;
  propertyType: 'Studio' | 'Apartment' | 'Villa' | 'Penthouse';
  ownerType: 'landlord' | 'agent';
  cheques: number;
  maintenance: 'Included' | 'Extra';
}

export interface User {
  id: string;
  email: string;
  name: string;
  joinedAt: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Conversation {
  messages: ChatMessage[];
  isTyping: boolean;
}

export interface PropertyFilters {
  searchTerm: string;
  propertyType: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: number | null;
  area: string;
}

export type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  PropertyDetail: { propertyId: number };
  Favorites: undefined;
  Profile: undefined;
};