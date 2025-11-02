import React, { createContext, useEffect, useState, useContext } from 'react';
import api from '../utils/api';
import { AuthContext } from './AuthContext';

export const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [wishlist, setWishlist] = useState([]); // Do NOT persist for guests
  const [loading, setLoading] = useState(false);

  const loadWishlist = async () => {
    if (!user) {
      setWishlist([]); // clear for guests on refresh
      return;
    }
    setLoading(true);
    try {
      const res = await api.get('/wishlist');
      setWishlist(res.data || []);
    } catch (_e) {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const addToWishlist = async (productId) => {
    if (!user) return; // guests cannot persist wishlist across refresh
    await api.post(`/wishlist/add/${productId}`);
    await loadWishlist();
  };

  const removeFromWishlist = async (productId) => {
    if (!user) return;
    await api.delete(`/wishlist/remove/${productId}`);
    await loadWishlist();
  };

  const isInWishlist = (productId) => wishlist.some(p => (p._id || p) === productId);

  const clearWishlist = () => setWishlist([]);

  return (
    <WishlistContext.Provider value={{ wishlist, loading, addToWishlist, removeFromWishlist, isInWishlist, reload: loadWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};