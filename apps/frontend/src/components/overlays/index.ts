// ── Overlay / Modal / Drawer Design System ────────────────────────────────

// Variant engine + animation constants
export type {
  DrawerPlacement,
  DrawerSize,
  DrawerVariantsOptions,
  ModalSize,
  ModalVariantsOptions,
} from './overlayVariants'
export {
  BACKDROP_ANIMATION,
  backdropClass,
  DRAWER_ANIMATIONS,
  DRAWER_HEIGHTS,
  DRAWER_WIDTHS,
  drawerVariants,
  MODAL_ANIMATION,
  MODAL_SIZES,
  modalVariants,
} from './overlayVariants'

// Hooks
export type {
  UseDrawerOptions,
  UseDrawerReturn,
  UseModalOptions,
  UseModalReturn,
} from './useOverlay'
export { useDrawer, useFocusTrap,useModal } from './useOverlay'

// Modal
export type {
  ModalBodyProps,
  ModalFooterAlign,
  ModalFooterProps,
  ModalHeaderProps,
  ModalProps,
  ModalTitleProps,
} from './Modal'
export {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from './Modal'

// Drawer
export type {
  DrawerBodyProps,
  DrawerFooterProps,
  DrawerHeaderProps,
  DrawerProps,
  DrawerTitleProps,
} from './Drawer'
export {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from './Drawer'

// AlertDialog
export type { AlertDialogProps, AlertDialogVariant } from './AlertDialog'
export { AlertDialog } from './AlertDialog'
