// utils/formatters.ts

export const formatPrice = (price: number): string => {
  return `${price.toLocaleString()} AED`;
};

export const formatPriceShort = (price: number): string => {
  if (price >= 1000000) {
    return `${(price / 1000000).toFixed(1)}M AED`;
  }
  if (price >= 1000) {
    return `${(price / 1000).toFixed(0)}k AED`;
  }
  return `${price} AED`;
};

export const formatArea = (sqft: number): string => {
  return `${sqft.toLocaleString()} sqft`;
};

export const formatBedrooms = (bedrooms: number): string => {
  if (bedrooms === 0) return 'Studio';
  if (bedrooms === 1) return '1 Bedroom';
  return `${bedrooms} Bedrooms`;
};

export const formatBathrooms = (bathrooms: number): string => {
  if (bathrooms === 1) return '1 Bath';
  return `${bathrooms} Baths`;
};

export const getInitials = (name: string): string => {
  if (!name) return '?';
  const parts = name.split(' ');
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const truncate = (text: string, maxLength: number = 100): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};