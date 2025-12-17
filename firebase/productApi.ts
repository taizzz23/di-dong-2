// firebase/productApi.ts
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig"; // Đảm bảo import đúng config

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;          // ✅ Đổi từ optional thành required
  brand: string;          // ✅ Thêm brand (required cho ProductCard)
  stock: number;          // ✅ Đổi từ optional thành required
  type: string;           // ✅ Thêm type
  consoleLine?: string;
  condition: string;      // ✅ Thêm condition
  location: string;       // ✅ Thêm location
  rating: number;         // ✅ Thêm rating (required cho ProductCard)
  description?: string;
  category?: string;
  createdAt?: any;
}

// ✅ Hàm getProducts - fetch từ Firestore
export const getProducts = async (): Promise<Product[]> => {
  try {
    console.log("🔄 Fetching products from Firestore...");
    
    const productsRef = collection(db, "products");
    const querySnapshot = await getDocs(productsRef);
    
    console.log(`📦 Found ${querySnapshot.size} products`);
    
    const products: Product[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      console.log(`📄 Document ${doc.id}:`, data);
      
      // Convert stock từ string sang number
      const stockValue = data.stock;
      let stockNumber = 0;
      
      if (typeof stockValue === 'string') {
        stockNumber = parseInt(stockValue) || 0;
      } else if (typeof stockValue === 'number') {
        stockNumber = stockValue;
      }
      
      // Ensure rating is number
      const ratingNumber = typeof data.rating === 'number' ? data.rating : 0;
      
      products.push({
        id: doc.id,
        name: data.name || "No Name",
        price: data.price || 0,
        image: data.image || "",
        brand: data.brand || "Unknown Brand",      // ✅ Thêm brand
        stock: stockNumber,
        type: data.type || "uncategorized",        // ✅ Thêm type
        consoleLine: data.consoleLine || "",
        condition: data.condition || "New",        // ✅ Thêm condition
        location: data.location || "Unknown Location", // ✅ Thêm location
        rating: ratingNumber,                      // ✅ Thêm rating
        description: data.description || "",
        category: data.category || "",
        createdAt: data.createdAt || new Date()
      });
    });
    
    console.log("✅ Products array:", products);
    return products;
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    return [];
  }
};