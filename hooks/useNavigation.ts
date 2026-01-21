import { useState } from "react";
import { Product } from "../components/ProductCard";

type View = "home" | "product" | "cart";

export function useNavigation() {
  const [view, setView] = useState<View>("home");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const goToHome = () => {
    setView("home");
    setSelectedProduct(null);
  };

  const goToCart = () => {
    setView("cart");
  };

  const goToProduct = (product: Product) => {
    setSelectedProduct(product);
    setView("product");
  };

  return {
    view,
    selectedProduct,
    goToHome,
    goToCart,
    goToProduct
  };
}
