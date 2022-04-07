
import { useLocalStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useFavorite = defineStore('favorite', () => {
  const favorite = useLocalStorage<{ university: string, major: string }[]>('favorite', []);
  const isFavorite = (university: string, major: string) => favorite.value.find(({ university: _university, major: _major }) => _university == university && _major == major) != undefined;
  const addFavorite = (university: string, major: string) => {
    favorite.value.push({ university, major })
  }
  const removeFavorite = (university: string, major: string) => {
    favorite.value = favorite.value.filter(({ university: _university, major: _major }) => _university != university || _major != major)
  }
  return { favorite, isFavorite, addFavorite, removeFavorite }
});
