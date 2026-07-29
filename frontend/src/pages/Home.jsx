import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";

function Home() {
  const [categories, setCategories] = useState([]);
  const [slides, setSlides] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  const defaultSlides = [
    {
      title: "Simple\nis More",
      link: "/shop",
      buttonText: "Shop Now",
      bgImage:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format",
    },
    {
      title: "New\nArrivals",
      link: "/shop",
      buttonText: "Discover",
      bgImage:
        "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&auto=format",
    },
    {
      title: "Summer\nCollection",
      link: "/shop",
      buttonText: "Explore",
      bgImage:
        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=1200&auto=format",
    },
  ];

  const activeSlides =
    slides && slides.length > 0
      ? slides.map((s) => ({
          title: s.title,
          link: "/shop",
          buttonText: "Shop Now",
          bgImage: s.image_url,
        }))
      : slides === null
        ? []
        : defaultSlides;

  useEffect(() => {
    if (activeSlides.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % activeSlides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [activeSlides.length]);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const { data } = await axios.get("/slides");
        setSlides(data);
      } catch (error) {
        console.error("Error fetching slides", error);
        setSlides([]); // fallback on error
      }
    };

    const fetchCategories = async () => {
      try {
        // The API already filters out empty categories and eager-loads products
        const { data } = await axios.get("/categories");
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
    fetchCategories();
  }, []);

  return (
    <div>
      {/* Hero Slider */}
      <div className="relative h-72 md:h-96 flex items-center overflow-hidden bg-gray-100">
        {slides === null ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div className="w-8 h-8 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {activeSlides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out flex justify-end items-start p-8 md:p-12 ${
                  index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
                style={{
                  backgroundImage: `url(${slide.bgImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Overlay for text readability */}
                <div className="absolute inset-0 z-0"></div>
                <div className="relative z-10 text-white text-right max-w-md">
                  <h1 className="text-4xl md:text-6xl font-bold leading-tight drop-shadow-lg whitespace-pre-line">
                    {slide.title}
                  </h1>
                  <Link
                    to={slide.link}
                    className="mt-4 inline-block bg-white text-gray-900 font-semibold px-6 py-2 rounded hover:bg-gray-100 transition-colors shadow"
                  >
                    {slide.buttonText}
                  </Link>
                </div>
              </div>
            ))}

            {/* Slider Controls */}
            {activeSlides.length > 1 && (
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
                {activeSlides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                      index === currentSlide
                        ? "bg-white"
                        : "bg-white/50 hover:bg-white/75"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  ></button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Dynamic Category Sections */}
      {loading ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-gray-200">
            Loading...
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-200 rounded h-64 animate-pulse"
              ></div>
            ))}
          </div>
        </div>
      ) : categories.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 text-center text-gray-500">
          No products available yet.
        </div>
      ) : (
        categories.map((category, index) => (
          <div key={category.id}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b-2 border-cyan-500">
                {category.name}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {category.products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
            {/* Divider between categories, except after the last one */}
            {index !== categories.length - 1 && (
              <div className="border-b border-gray-200 mx-8"></div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default Home;
