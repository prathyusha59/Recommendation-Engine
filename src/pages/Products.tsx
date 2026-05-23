import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  brand: string;
  imageUrl: string;
}

interface PageResponse {
  content: Product[];
  totalPages: number;
  totalElements: number;
  number: number;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "name_asc", label: "Name: A to Z" },
];

export default function Products() {
  const [pageData, setPageData] = useState<PageResponse | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const PAGE_SIZE = 12;

  useEffect(() => {
    api.get("/products/public/categories").then((res) => setCategories(res.data));
    api.get("/products/public/brands").then((res) => setBrands(res.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (selectedCategory) params.append("category", selectedCategory);
    if (selectedBrand) params.append("brand", selectedBrand);
    if (minPrice) params.append("minPrice", minPrice);
    if (maxPrice) params.append("maxPrice", maxPrice);
    params.append("sortBy", sortBy);
    params.append("page", currentPage.toString());
    params.append("size", PAGE_SIZE.toString());

    api.get(`/products/public/search?${params.toString()}`).then((res) => {
      setPageData(res.data);
      setLoading(false);
    });
  }, [search, selectedCategory, selectedBrand, minPrice, maxPrice, sortBy, currentPage]);

  const handleFilterChange = () => {
    setCurrentPage(0);
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSelectedBrand("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("newest");
    setCurrentPage(0);
  };

  const hasFilters = search || selectedCategory || selectedBrand || minPrice || maxPrice || sortBy !== "newest";

  return (
    <div className="w-full px-4 sm:px-6 md:px-10 py-8">

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">Products</h2>
          <p className="text-sm text-gray-500">
            {pageData ? `${pageData.totalElements} products found` : "Loading..."}
          </p>
        </div>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-red-400 hover:text-red-300 border border-red-500/20 px-3 py-1.5 rounded-lg transition-colors"
          >
            ✕ Clear Filters
          </button>
        )}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="🔍 Search products, brands, categories..."
        value={search}
        onChange={(e) => { setSearch(e.target.value); handleFilterChange(); }}
        className="w-full px-5 py-3 bg-[#111] border border-white/10 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-white/20 mb-4 text-sm"
      />

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={selectedCategory}
          onChange={(e) => { setSelectedCategory(e.target.value); handleFilterChange(); }}
          className="px-4 py-2 bg-[#111] border border-white/10 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-white/20 cursor-pointer"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={selectedBrand}
          onChange={(e) => { setSelectedBrand(e.target.value); handleFilterChange(); }}
          className="px-4 py-2 bg-[#111] border border-white/10 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-white/20 cursor-pointer"
        >
          <option value="">All Brands</option>
          {brands.map((brand) => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => { setMinPrice(e.target.value); handleFilterChange(); }}
          className="w-28 px-4 py-2 bg-[#111] border border-white/10 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-white/20"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => { setMaxPrice(e.target.value); handleFilterChange(); }}
          className="w-28 px-4 py-2 bg-[#111] border border-white/10 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-white/20"
        />

        <select
          value={sortBy}
          onChange={(e) => { setSortBy(e.target.value); handleFilterChange(); }}
          className="px-4 py-2 bg-[#111] border border-white/10 rounded-xl text-sm text-gray-300 focus:outline-none focus:border-white/20 cursor-pointer ml-auto"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Category Pills */}
      {categories.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-6">
          <button
            onClick={() => { setSelectedCategory(""); handleFilterChange(); }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
              !selectedCategory
                ? "bg-red-600 text-white border-red-600"
                : "bg-[#111] text-gray-400 border-white/10 hover:border-white/20"
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat === selectedCategory ? "" : cat); handleFilterChange(); }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-[#111] text-gray-400 border-white/10 hover:border-white/20"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-white/10 border-t-white/40 rounded-full animate-spin" />
        </div>
      )}

      {/* Grid */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {pageData?.content.map((product, index) => (
            <div
              key={`product-${product.id}-${index}`}
              onClick={() => navigate(`/products/${product.id}`)}
              className="group bg-[#111] border border-white/10 rounded-xl overflow-hidden cursor-pointer hover:border-white/25 hover:-translate-y-1 transition-all duration-200"
            >
              <div className="aspect-square overflow-hidden bg-[#1a1a1a]">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = `https://placehold.co/400x400/1a1a1a/555555?text=${encodeURIComponent(product.name)}`;
                  }}
                />
              </div>
              <div className="p-4">
                <h3 className="font-medium text-sm text-white truncate">{product.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">{product.brand}</p>
                <p className="text-xs text-gray-600">{product.category}</p>
                <p className="font-bold text-sm text-red-500 mt-2">{fmt(product.price)}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && pageData?.content.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
          <span className="text-5xl opacity-20">🔍</span>
          <p className="text-gray-400 font-medium">No products found</p>
          <p className="text-sm text-gray-600">Try a different search or filter</p>
          <button onClick={clearFilters} className="mt-2 text-sm text-red-400 hover:text-red-300">
            Clear all filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {pageData && pageData.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => { setCurrentPage(currentPage - 1); window.scrollTo(0, 0); }}
            disabled={currentPage === 0}
            className="py-2 px-4 text-sm font-medium text-gray-400 bg-[#111] border border-white/10 rounded-lg hover:border-white/20 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            ← Prev
          </button>
          {Array.from({ length: pageData.totalPages }, (_, i) => i).map((page) => (
            <button
              key={page}
              onClick={() => { setCurrentPage(page); window.scrollTo(0, 0); }}
              className={`w-9 h-9 text-sm font-medium rounded-lg border transition-colors cursor-pointer ${
                page === currentPage
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-[#111] text-gray-400 border-white/10 hover:border-white/20 hover:text-white"
              }`}
            >
              {page + 1}
            </button>
          ))}
          <button
            onClick={() => { setCurrentPage(currentPage + 1); window.scrollTo(0, 0); }}
            disabled={currentPage === pageData.totalPages - 1}
            className="py-2 px-4 text-sm font-medium text-gray-400 bg-[#111] border border-white/10 rounded-lg hover:border-white/20 hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}