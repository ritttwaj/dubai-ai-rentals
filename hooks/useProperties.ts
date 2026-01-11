// hooks/useProperties.ts

import { create } from 'zustand';
import { Property, PropertyFilters } from '../types';
import { MOCK_PROPERTIES } from '../data/mockProperties';

interface PropertiesState {
  properties: Property[];
  favorites: number[];
  filters: PropertyFilters;
  toggleFavorite: (propertyId: number) => void;
  setFilters: (filters: Partial<PropertyFilters>) => void;
  resetFilters: () => void;
  getFilteredProperties: () => Property[];
  getPropertyById: (id: number) => Property | undefined;
}

const defaultFilters: PropertyFilters = {
  searchTerm: '',
  propertyType: 'All',
  minPrice: 0,
  maxPrice: Infinity,
  bedrooms: null,
  area: 'All'
};

export const useProperties = create<PropertiesState>((set, get) => ({
  properties: MOCK_PROPERTIES,
  favorites: [],
  filters: defaultFilters,

  toggleFavorite: (propertyId: number) => {
    set((state) => ({
      favorites: state.favorites.includes(propertyId)
        ? state.favorites.filter(id => id !== propertyId)
        : [...state.favorites, propertyId]
    }));
  },

  setFilters: (newFilters: Partial<PropertyFilters>) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters }
    }));
  },

  resetFilters: () => {
    set({ filters: defaultFilters });
  },

  getFilteredProperties: () => {
    const { properties, filters } = get();
    
    return properties.filter(property => {
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          property.title.toLowerCase().includes(searchLower) ||
          property.area.toLowerCase().includes(searchLower) ||
          property.building.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      if (filters.propertyType !== 'All' && property.propertyType !== filters.propertyType) {
        return false;
      }

      if (property.price < filters.minPrice || property.price > filters.maxPrice) {
        return false;
      }

      if (filters.bedrooms !== null && property.bedrooms !== filters.bedrooms) {
        return false;
      }

      if (filters.area !== 'All' && property.area !== filters.area) {
        return false;
      }

      return true;
    });
  },

  getPropertyById: (id: number) => {
    return get().properties.find(p => p.id === id);
  }
}));
