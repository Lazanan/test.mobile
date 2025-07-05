import AsyncStorage from '@react-native-async-storage/async-storage';
import rawProducts from '../data/products.json';
import { ProductDTO } from '../dtos/ProductDTO';

const PRODUCTS_STORAGE_KEY = '@App:products';

class ProductAPI {
  private static instance: ProductAPI;
  private products: ProductDTO[] = [];
  private isInitialized = false;

  private constructor() {}

  // Singleton
  public static getInstance(): ProductAPI {
    if (!ProductAPI.instance) {
      ProductAPI.instance = new ProductAPI();
    }
    return ProductAPI.instance;
  }

  // Chargement initial des données (JSON ou stockage local)
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const storedProductsJson = await AsyncStorage.getItem(PRODUCTS_STORAGE_KEY);

      if (storedProductsJson) {
        this.products = JSON.parse(storedProductsJson);
      } else {
        this.products = rawProducts.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description,
          price: p.price,
          stock: p.stock,
          category: p.category,
          vendeur: p.vendeurs,
          image: p.image,
        }));
        await this.persist();
      }
    } catch (error) {
      console.error("Erreur d'initialisation des produits :", error);
      this.products = [];
    }

    this.isInitialized = true;
  }

  // Sauvegarde dans AsyncStorage
  private async persist(): Promise<void> {
    try {
      const json = JSON.stringify(this.products);
      await AsyncStorage.setItem(PRODUCTS_STORAGE_KEY, json);
    } catch (error) {
      console.error("Erreur de sauvegarde des produits :", error);
    }
  }

  // Récupère tous les produits
  public async getAll(): Promise<ProductDTO[]> {
    console.log("Chargement des produits...");
    await new Promise(resolve => setTimeout(resolve, 800)); // simulation latence
    return [...this.products];
  }

  // Récupère un produit par ID
  public async getById(id: string): Promise<ProductDTO | undefined> {
    return this.products.find(p => p.id === id);
  }

  // Ajoute un nouveau produit
  public async addProduct(productData: Omit<ProductDTO, 'id'>): Promise<ProductDTO> {
    const newProduct: ProductDTO = { id: String(Date.now()), ...productData };
    this.products.unshift(newProduct);
    await this.persist();
    return newProduct;
  }

  // Met à jour un produit existant
  public async updateProduct(id: string, updateData: Partial<Omit<ProductDTO, 'id'>>): Promise<ProductDTO> {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Produit introuvable.');

    const updated = { ...this.products[index], ...updateData };
    this.products[index] = updated;
    await this.persist();
    return updated;
  }

  // Supprime un produit
  public async deleteProduct(id: string): Promise<void> {
    const initialCount = this.products.length;
    this.products = this.products.filter(p => p.id !== id);
    if (this.products.length === initialCount) throw new Error('Produit introuvable.');

    await this.persist();
  }
}

// Export singleton
export const productApi = ProductAPI.getInstance();
