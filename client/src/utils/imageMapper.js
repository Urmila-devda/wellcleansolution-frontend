import handwashImg from "../assets/handwash.png"
import toiletImg from "../assets/toilet_cleaner.png"
import glassImg from "../assets/glass_cleaner.png"
import floorImg from "../assets/floor_cleaner.png"
import dishwashImg from "../assets/dishwash.png"
import surfaceImg from "../assets/multi_surface.png"
import { API_BASE_URL } from "../config"

export const productImages = {
  handwash: handwashImg,
  toilet: toiletImg,
  glass: glassImg,
  floor: floorImg,
  dishwash: dishwashImg,
  surface: surfaceImg,
}

// Resolves relative upload paths to the backend server URL, leaves absolute URLs intact,
// and maps legacy keys to static assets.
export const getImageUrl = (imagePath) => {
  if (!imagePath) {
    return "https://via.placeholder.com/400x400.png?text=No+Image+Available"
  }

  if (
    imagePath.startsWith("http://") ||
    imagePath.startsWith("https://") ||
    imagePath.startsWith("data:")
  ) {
    return imagePath
  }

  if (imagePath.startsWith("/")) {
    return `${API_BASE_URL}${imagePath}`
  }

  if (productImages[imagePath]) {
    return productImages[imagePath]
  }

  // Fallback case: assume it is a local upload path without leading slash
  return `${API_BASE_URL}/uploads/${imagePath}`
}

export const getProductImage = (key) => {
  return getImageUrl(key)
}
