import { create } from 'zustand'

interface UIState {
  isMobileMenuOpen: boolean
  isSearchModalOpen: boolean
  setMobileMenuOpen: (open: boolean) => void
  setSearchModalOpen: (open: boolean) => void
  toggleMobileMenu: () => void
  toggleSearchModal: () => void
}

export const useUIStore = create<UIState>()((set) => ({
  isMobileMenuOpen: false,
  isSearchModalOpen: false,

  setMobileMenuOpen: (open) => {
    set({ isMobileMenuOpen: open })
  },
  setSearchModalOpen: (open) => {
    set({ isSearchModalOpen: open })
  },
  toggleMobileMenu: () => {
    set((s) => ({ isMobileMenuOpen: !s.isMobileMenuOpen }))
  },
  toggleSearchModal: () => {
    set((s) => ({ isSearchModalOpen: !s.isSearchModalOpen }))
  },
}))
