import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { ProductDTO } from '../dtos/ProductDTO';
import { productApi } from '../api/productApi';
import { shuffleArray } from '../utils/shuffleArray';

interface ProductContextType {
  products: ProductDTO[];
  isLoading: boolean;
  addProduct: (productData: Omit<ProductDTO, 'id'>) => Promise<void>;
  updateProduct: (id: string, updateData: Partial<Omit<ProductDTO, 'id'>>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  loadProducts: () => Promise<void>;
}

export const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  

  // Fonction pour charger les données initiales
  const loadProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      // L'initialisation depuis AsyncStorage est déjà gérée dans l'API
      const initialProducts = await productApi.getAll();
      setProducts(shuffleArray(initialProducts));
    } catch (error) {
      console.error("Failed to load products:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Charger les produits au premier montage
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  // FONCTIONS QUI MODIFIENT L'API ET L'ÉTAT LOCAL
  
  const addProduct = async (productData: Omit<ProductDTO, 'id'>) => {
    const newProduct = await productApi.addProduct(productData);
    // Met à jour l'état local pour un rafraîchissement instantané de l'UI
    setProducts(currentProducts => [newProduct, ...currentProducts]);
  };

  const updateProduct = async (id: string, updateData: Partial<Omit<ProductDTO, 'id'>>) => {
    const updatedProduct = await productApi.updateProduct(id, updateData);
    setProducts(currentProducts => 
      currentProducts.map(p => (p.id === id ? updatedProduct : p))
    );
  };

  const deleteProduct = async (id: string) => {
    await productApi.deleteProduct(id);
    setProducts(currentProducts => currentProducts.filter(p => p.id !== id));
  };

  return (
    <ProductContext.Provider value={{ products, isLoading, addProduct, updateProduct, deleteProduct, loadProducts }}>
      {children}
    </ProductContext.Provider>
  );
};