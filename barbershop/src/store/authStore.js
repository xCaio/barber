import { create } from 'zustand';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../config/firebase';
import { getUserProfile, logoutUser } from '../services/authService';
import { ROLES } from '../constants';

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  loading: false,
  initialized: false,

  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  setLoading: (loading) => set({ loading }),

  isAdmin: () => {
    const role = get().profile?.role;
    return role === ROLES.ADMIN || role === ROLES.BARBER;
  },

  isClient: () => get().profile?.role === ROLES.CLIENT,

  initAuth: () => {
    if (get().initialized) return;

    if (!isFirebaseConfigured || !auth) {
      set({ loading: false, initialized: true, user: null, profile: null });
      return;
    }

    set({ loading: true });

    onAuthStateChanged(auth, async (user) => {
      set({ user, loading: true });
      if (user) {
        try {
          const profile = await getUserProfile(user.uid);
          set({ profile });
        } catch {
          set({ profile: null });
        }
      } else {
        set({ profile: null });
      }
      set({ loading: false, initialized: true });
    });

    set({ initialized: true });
  },

  logout: async () => {
    await logoutUser();
    set({ user: null, profile: null });
  },

  refreshProfile: async () => {
    const { user } = get();
    if (!user) return;
    const profile = await getUserProfile(user.uid);
    set({ profile });
  },
}));
