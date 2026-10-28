// Иконки нижнего меню и сердечка (SVG)
export const FeedIcon = () => (
  <svg viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2" /><path d="m10 9 5 3-5 3z" /></svg>
)
export const AddIcon = () => (
  <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4" /><path d="M12 8v8M8 12h8" /></svg>
)
export const GridIcon = () => (
  <svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></svg>
)
export const LoginIcon = () => (
  <svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4-6 8-6s7 2 8 6" /></svg>
)
export const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg viewBox="0 0 24 24" className={filled ? 'heart is-filled' : 'heart'}>
    <path d="M12 21s-7-4.4-9.3-9C1.2 8.8 3 5 6.6 5c2 0 3.4 1.1 4.4 2.6C12 6.1 13.4 5 15.4 5 19 5 20.8 8.8 19.3 12 17 16.6 12 21 12 21z" />
  </svg>
)
