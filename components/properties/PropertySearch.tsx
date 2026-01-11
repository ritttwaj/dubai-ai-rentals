// components/properties/PropertySearch.tsx - COMPLETE MODERN REDESIGN

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, TextInput, Modal } from 'react-native';
import { useProperties } from '../../hooks/useProperties';
import { PROPERTY_TYPES, DUBAI_AREAS } from '../../data/mockProperties';
import { SPACING, COLORS, FONT_SIZES } from '../../utils/constants';

export const PropertySearch: React.FC = () => {
  const { filters, setFilters, resetFilters } = useProperties();
  const [showFiltersModal, setShowFiltersModal] = useState(false);

  const handleSearchChange = (text: string) => {
    setFilters({ searchTerm: text });
  };

  const handleTypeSelect = (type: string) => {
    setFilters({ propertyType: type });
  };

  const hasActiveFilters = 
    filters.searchTerm || 
    filters.propertyType !== 'All' || 
    filters.area !== 'All';

  const activeFilterCount = [
    filters.propertyType !== 'All',
    filters.area !== 'All',
    filters.searchTerm
  ].filter(Boolean).length;

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Dubai properties..."
            placeholderTextColor={COLORS.textSecondary}
            value={filters.searchTerm}
            onChangeText={handleSearchChange}
          />
          {filters.searchTerm ? (
            <TouchableOpacity
              onPress={() => setFilters({ searchTerm: '' })}
              style={styles.clearButton}
            >
              <Text style={styles.clearIcon}>✕</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Filter Button */}
        <TouchableOpacity
          style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]}
          onPress={() => setShowFiltersModal(true)}
        >
          <Text style={styles.filterIcon}>⚙️</Text>
          {activeFilterCount > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Quick Property Type Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.quickFilters}
        contentContainerStyle={styles.quickFiltersContent}
      >
        {PROPERTY_TYPES.map((type) => {
          const isSelected = filters.propertyType === type;
          const icons: Record<string, string> = {
            'All': '🏘️',
            'Studio': '🏠',
            'Apartment': '🏢',
            'Villa': '🏡',
            'Penthouse': '🏰'
          };

          return (
            <TouchableOpacity
              key={type}
              onPress={() => handleTypeSelect(type)}
              style={[
                styles.quickFilterPill,
                isSelected && styles.quickFilterPillActive
              ]}
              activeOpacity={0.7}
            >
              <Text style={styles.quickFilterIcon}>{icons[type]}</Text>
              <Text style={[
                styles.quickFilterText,
                isSelected && styles.quickFilterTextActive
              ]}>
                {type}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <View style={styles.activeFiltersContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.activeFilters}
          >
            {filters.propertyType !== 'All' && (
              <View style={styles.activeFilterChip}>
                <Text style={styles.activeFilterText}>{filters.propertyType}</Text>
                <TouchableOpacity
                  onPress={() => setFilters({ propertyType: 'All' })}
                  style={styles.removeFilterButton}
                >
                  <Text style={styles.removeFilterIcon}>✕</Text>
                </TouchableOpacity>
              </View>
            )}

            {filters.area !== 'All' && (
              <View style={styles.activeFilterChip}>
                <Text style={styles.activeFilterText}>{filters.area}</Text>
                <TouchableOpacity
                  onPress={() => setFilters({ area: 'All' })}
                  style={styles.removeFilterButton}
                >
                  <Text style={styles.removeFilterIcon}>✕</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              onPress={resetFilters}
              style={styles.clearAllButton}
            >
              <Text style={styles.clearAllText}>Clear All</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {/* Filters Modal */}
      <Modal
        visible={showFiltersModal}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowFiltersModal(false)}
      >
        <View style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filters</Text>
            <TouchableOpacity
              onPress={() => setShowFiltersModal(false)}
              style={styles.modalCloseButton}
            >
              <Text style={styles.modalCloseIcon}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {/* Property Type Section */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Property Type</Text>
              <View style={styles.filterGrid}>
                {PROPERTY_TYPES.map((type) => {
                  const isSelected = filters.propertyType === type;
                  const icons: Record<string, string> = {
                    'All': '🏘️',
                    'Studio': '🏠',
                    'Apartment': '🏢',
                    'Villa': '🏡',
                    'Penthouse': '🏰'
                  };

                  return (
                    <TouchableOpacity
                      key={type}
                      onPress={() => handleTypeSelect(type)}
                      style={[
                        styles.filterOption,
                        isSelected && styles.filterOptionActive
                      ]}
                    >
                      <Text style={styles.filterOptionIcon}>{icons[type]}</Text>
                      <Text style={[
                        styles.filterOptionText,
                        isSelected && styles.filterOptionTextActive
                      ]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Area Section */}
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>Area</Text>
              <View style={styles.areaList}>
                <TouchableOpacity
                  onPress={() => setFilters({ area: 'All' })}
                  style={[
                    styles.areaOption,
                    filters.area === 'All' && styles.areaOptionActive
                  ]}
                >
                  <Text style={[
                    styles.areaOptionText,
                    filters.area === 'All' && styles.areaOptionTextActive
                  ]}>
                    All Areas
                  </Text>
                  {filters.area === 'All' && (
                    <Text style={styles.checkmark}>✓</Text>
                  )}
                </TouchableOpacity>

                {DUBAI_AREAS.map((area) => {
                  const isSelected = filters.area === area;
                  return (
                    <TouchableOpacity
                      key={area}
                      onPress={() => setFilters({ area })}
                      style={[
                        styles.areaOption,
                        isSelected && styles.areaOptionActive
                      ]}
                    >
                      <Text style={[
                        styles.areaOptionText,
                        isSelected && styles.areaOptionTextActive
                      ]}>
                        {area}
                      </Text>
                      {isSelected && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </ScrollView>

          {/* Modal Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              onPress={() => {
                resetFilters();
                setShowFiltersModal(false);
              }}
              style={styles.resetButton}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setShowFiltersModal(false)}
              style={styles.applyButton}
            >
              <Text style={styles.applyButtonText}>
                Apply Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    paddingTop: SPACING.md,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    paddingHorizontal: SPACING.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: SPACING.sm,
  },
  searchInput: {
    flex: 1,
    fontSize: FONT_SIZES.md,
    color: COLORS.text,
    paddingVertical: SPACING.md,
  },
  clearButton: {
    padding: SPACING.xs,
  },
  clearIcon: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  filterButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filterIcon: {
    fontSize: 24,
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: COLORS.error,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  filterBadgeText: {
    color: '#fff',
    fontSize: FONT_SIZES.xs,
    fontWeight: '700',
  },
  quickFilters: {
    marginBottom: SPACING.sm,
  },
  quickFiltersContent: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  quickFilterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 20,
    marginRight: SPACING.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  quickFilterPillActive: {
    backgroundColor: '#e0e7ff',
    borderColor: COLORS.primary,
  },
  quickFilterIcon: {
    fontSize: 18,
    marginRight: SPACING.xs,
  },
  quickFilterText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  quickFilterTextActive: {
    color: COLORS.primary,
  },
  activeFiltersContainer: {
    paddingBottom: SPACING.sm,
  },
  activeFilters: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.sm,
  },
  activeFilterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingLeft: SPACING.md,
    paddingRight: SPACING.xs,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
    marginRight: SPACING.sm,
  },
  activeFilterText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: '#fff',
    marginRight: SPACING.xs,
  },
  removeFilterButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeFilterIcon: {
    fontSize: 12,
    color: '#fff',
    fontWeight: '700',
  },
  clearAllButton: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs,
    borderRadius: 16,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  clearAllText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  modalTitle: {
    fontSize: FONT_SIZES.xxl,
    fontWeight: '700',
    color: COLORS.text,
  },
  modalCloseButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseIcon: {
    fontSize: 20,
    color: COLORS.text,
  },
  modalContent: {
    flex: 1,
    padding: SPACING.lg,
  },
  filterSection: {
    marginBottom: SPACING.xl,
  },
  filterSectionTitle: {
    fontSize: FONT_SIZES.lg,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: SPACING.md,
  },
  filterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  filterOption: {
    width: '31%',
    aspectRatio: 1,
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
    padding: SPACING.sm,
  },
  filterOptionActive: {
    backgroundColor: '#e0e7ff',
    borderColor: COLORS.primary,
  },
  filterOptionIcon: {
    fontSize: 32,
    marginBottom: SPACING.xs,
  },
  filterOptionText: {
    fontSize: FONT_SIZES.sm,
    fontWeight: '600',
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  filterOptionTextActive: {
    color: COLORS.primary,
  },
  areaList: {
    gap: SPACING.xs,
  },
  areaOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SPACING.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  areaOptionActive: {
    backgroundColor: '#e0e7ff',
    borderColor: COLORS.primary,
  },
  areaOptionText: {
    fontSize: FONT_SIZES.md,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  areaOptionTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 20,
    color: COLORS.primary,
    fontWeight: '700',
  },
  modalFooter: {
    flexDirection: 'row',
    gap: SPACING.md,
    padding: SPACING.lg,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  resetButton: {
    flex: 1,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  resetButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: COLORS.textSecondary,
  },
  applyButton: {
    flex: 2,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyButtonText: {
    fontSize: FONT_SIZES.md,
    fontWeight: '700',
    color: '#fff',
  },
});