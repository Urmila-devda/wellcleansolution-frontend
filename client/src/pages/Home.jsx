import { useState, useEffect } from "react"
import Hero from "../components/Hero"
import BestSellers from "../components/BestSellers"
import WhyChooseUs from "../components/WhyChooseUs"
import Testimonials from "../components/Testimonials"
import FAQ from "../components/FAQ"
import ContactSection from "../components/ContactSection"
import { productsAPI } from "../services/api"
import { getProductImage, getImageUrl } from "../utils/imageMapper"

export default function Home({ 
  onAddToCart, 
  onQuickView 
}) {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // SEO setup
  useEffect(() => {
    document.title = "Home | WellClean Solutions"
    const metaDesc = document.querySelector('meta[name="description"]')
    if (metaDesc) {
      metaDesc.setAttribute(
        "content",
        "Welcome to WellClean Solutions - premium cleaning and hygiene products for sparkling clean homes and germ protection."
      )
    }
  }, [])

  // Fetch products from backend database once on mount
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true)
      try {
        const { data } = await productsAPI.getAll()

        // Map database imageKey into local static image object
        const formatted = data.map((prod) => ({
          ...prod,
          id: prod._id, // match React UI standard (id instead of _id)
          image: prod.images?.[0] ? getImageUrl(prod.images[0]) : getProductImage(prod.imageKey),
        }))

        setProducts(formatted)
      } catch (error) {
        console.error("Failed to load products from API:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div>
      <Hero />
      
      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center font-sans">
          <svg className="animate-spin h-8 w-8 text-brand-blue mb-2" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-xs font-semibold text-slate-400">Loading catalog products...</span>
        </div>
      ) : (
        <BestSellers
          products={products}
          onAddToCart={onAddToCart}
          onQuickView={onQuickView}
          isFeaturedOnly={true}
        />
      )}

      <WhyChooseUs />
      <Testimonials />
      <FAQ />
      <ContactSection />
    </div>
  )
}
