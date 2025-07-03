import AsyncStorage from '@react-native-async-storage/async-storage';
import rawProducts from '../data/products.json'; // Utilisé uniquement pour le premier lancement
import { ProductDTO } from '../dtos/ProductDTO';

const PRODUCTS_STORAGE_KEY = '@App:products';

class ProductAPI {
  private static instance: ProductAPI;
  private products: ProductDTO[] = [];
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): ProductAPI {
    if (!ProductAPI.instance) {
      ProductAPI.instance = new ProductAPI();
    }
    return ProductAPI.instance;
  }
  
  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const storedProductsJson = await AsyncStorage.getItem(PRODUCTS_STORAGE_KEY);
      
      if (storedProductsJson) {
        this.products = JSON.parse(storedProductsJson);
      } else {
        // Premier lancement : on charge depuis le fichier JSON
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
        // Et on sauvegarde immédiatement pour les lancements futurs
        await this.persist();
      }
    } catch (error) {
      console.error("Erreur lors de l'initialisation des données produits", error);
      // Fallback au cas où
      this.products = [];
    }
    
    this.isInitialized = true;
  }

  private async persist(): Promise<void> {
    try {
      const jsonValue = JSON.stringify(this.products);
      await AsyncStorage.setItem(PRODUCTS_STORAGE_KEY, jsonValue);
    } catch (error) {
      console.error("Erreur lors de la persistance des produits.", error);
    }
  }

  // Les méthodes CRUD modifient le tableau en mémoire PUIS persistent les changements.
  
  public async getAll(): Promise<ProductDTO[]> {
    return [...this.products];
  }

  /**
   * Récupère un produit spécifique par son ID.
   * @param id - L'ID du produit à trouver.
   * @returns Une promesse qui résout avec le ProductDTO trouvé ou undefined.
   */
  public async getById(id: string): Promise<ProductDTO | undefined> {
    // Cette opération est rapide car elle se fait sur le tableau déjà en mémoire.
    return this.products.find(p => p.id === id);
  }

  public async addProduct(productData: Omit<ProductDTO, 'id'>): Promise<ProductDTO> {
    const newProduct: ProductDTO = { id: String(Date.now()), ...productData };
    this.products.unshift(newProduct);
    await this.persist();
    return newProduct;
  }

  public async updateProduct(id: string, updateData: Partial<Omit<ProductDTO, 'id'>>): Promise<ProductDTO> {
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex === -1) throw new Error('Produit non trouvé.');
    
    const updatedProduct = { ...this.products[productIndex], ...updateData };
    this.products[productIndex] = updatedProduct;
    await this.persist();
    return updatedProduct;
  }

  public async deleteProduct(id: string): Promise<void> {
    const initialLength = this.products.length;
    this.products = this.products.filter(p => p.id !== id);
    if (this.products.length === initialLength) throw new Error('Produit non trouvé.');
    
    await this.persist();
  }
}

export const productApi = ProductAPI.getInstance();