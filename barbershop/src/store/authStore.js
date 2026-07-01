import { create } from 'zustand';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../config/firebase';
import { getUserProfile, logoutUser } from '../services/authService';
import { ROLES } from '../constants';

export const useAuthStore = create((set, get) => ({
  user: null,
  profile: null,
  loading: true,
  profileLoading: false,
  initialized: false,

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

    onAuthStateChanged(auth, (user) => {
      set({ user, loading: false, initialized: true });

      if (user) {
        set({ profileLoading: true });
        getUserProfile(user.uid)
          .then((profile) => set({ profile, profileLoading: false }))
          .catch(() => set({ profile: null, profileLoading: false }));
      } else {
        set({ profile: null, profileLoading: false });
      }
    });
  },

  logout: async () => {
    await logoutUser();
    set({ user: null, profile: null, profileLoading: false });
  },

  refreshProfile: async () => {
    const { user } = get();
    if (!user) return;
    set({ profileLoading: true });
    try {
      const profile = await getUserProfile(user.uid);
      set({ profile, profileLoading: false });
    } catch {
      set({ profile: null, profileLoading: false });
    }
  },
}));
