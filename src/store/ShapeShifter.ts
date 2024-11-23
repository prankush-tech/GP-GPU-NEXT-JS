import { create } from 'zustand'

export const useShape = create((set) => ({
  shape: 0,
  toBoxShape: () => set(() => ({ shape: 1 })),
  toSphereShape: () => set(() => ({ shape: 0 })),
}))
