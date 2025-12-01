// src/context/FavoritesContext.js
import React, { createContext, useEffect, useState } from 'react';

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]); // array of product ids
  const [loading, setLoading] = useState(false);
  const USER_NAME = 'guest'; // placeholder; replace with auth user id if using auth

  async function loadFavorites() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('favorites').select('product_id').eq('user_name', USER_NAME);
      if (!error && data) setFavorites(data.map((r) => r.product_id));
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function addFavorite(productId) {
    if (favorites.includes(productId)) return;
    setFavorites((p) => [...p, productId]);
    const { error } = await supabase.from('favorites').insert([{ user_name: USER_NAME, product_id: productId }]);
    if (error) {
      console.error('addFavorite error', error);
      setFavorites((p) => p.filter((id) => id !== productId));
    }
  }

  async function removeFavorite(productId) {
    setFavorites((p) => p.filter((id) => id !== productId));
    const { error } = await supabase.from('favorites').delete().match({ user_name: USER_NAME, product_id: productId });
    if (error) console.error('removeFavorite error', error);
  }

  useEffect(() => {
    loadFavorites();
  }, []);

  return (
    <FavoritesContext.Provider value={{ favorites, loading, loadFavorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
