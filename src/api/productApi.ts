import rawProducts from '../data/products.json';
import { ProductDTO } from '../dtos/ProductDTO';

// Simule un mapping de la base de données vers le DTO
const products: ProductDTO[] = rawProducts.map(p => ({
  id: p.id,
  name: p.name,
  description: p.description,
  price: p.price,
  stock: p.stock,
  category: p.category,
  vendeur: p.vendeurs, 
  image: p.image,
}));

const getAll = (): Promise<ProductDTO[]> => {
  return new Promise(resolve => setTimeout(() => resolve(products), 1000));
};

const getById = (id: string): Promise<ProductDTO | undefined> => {
  return new Promise(resolve =>
    setTimeout(() => resolve(products.find(p => p.id === id)), 500)
  );
};

const addProduct = (productData: Omit<ProductDTO, 'id'>): Promise<ProductDTO> => {
    return new Promise(resolve => {
        setTimeout(() => {
            const newProduct: ProductDTO = {
                id: String(Date.now()),
                ...productData,
            };
            products.unshift(newProduct); // Ajoute le produit au début de la liste
            resolve(newProduct);
        }, 1200);
    });
};

export const productApi = {
  getAll,
  getById,
  addProduct,
  // Ajoutez ici les fonctions pour update et delete
};