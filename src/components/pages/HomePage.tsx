// WI-HPI
import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, Search, User, Menu, Phone, Mail, 
  Facebook, Linkedin, Twitter, Instagram, ChevronRight, 
  Star, ShieldCheck, RefreshCw, Truck, Lock, ArrowRight,
  CheckCircle2, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Image } from '@/components/ui/image';

// --- Constants & Theme ---
const BRAND_GREEN = '#006838'; // Derived from screenshot
const BRAND_DARK = '#1a1a1a';

// --- Mock Data (Sourced from Markdown) ---

const CATEGORIES = [
  { id: 1, name: 'CNC Metal Cutting', image: 'https://atplonline.co.in/wp-content/uploads/2024/11/category1.webp' },
  { id: 2, name: 'CNC ZNC & Drill EDM', image: 'https://atplonline.co.in/wp-content/uploads/2024/12/cnc-edm-cutting.webp' },
  { id: 3, name: 'Die Casting', image: 'https://atplonline.co.in/wp-content/uploads/2024/11/cate3.webp' },
  { id: 4, name: 'Laser Machine', image: 'https://atplonline.co.in/wp-content/uploads/2024/11/Laser-Machine.webp' },
  { id: 5, name: 'Milling Machine', image: 'https://atplonline.co.in/wp-content/uploads/2024/11/cate5.webp' },
];

const LASER_PRODUCTS = [
  { id: 101, name: 'LENS 220 (1064mm)', price: 7500, originalPrice: 8500, discount: 12, image: 'https://atplonline.co.in/wp-content/uploads/2024/11/B1-300x300.jpg' },
  { id: 102, name: 'Galvo Cable', price: 2500, originalPrice: 3500, discount: 29, image: 'https://atplonline.co.in/wp-content/uploads/2024/11/F1-300x300.jpg' },
  { id: 103, name: 'Galvo Scanner (1064mm)', price: 22500, originalPrice: 25000, discount: 10, image: 'https://atplonline.co.in/wp-content/uploads/2024/11/E1-300x300.jpg' },
  { id: 104, name: 'EMI Filter 220 AC', price: 580, originalPrice: 650, discount: 11, image: 'https://atplonline.co.in/wp-content/uploads/2024/11/C1-300x300.jpg' },
  { id: 105, name: 'Monitor Stand', price: 3000, originalPrice: 3500, discount: 14, image: 'https://atplonline.co.in/wp-content/uploads/2024/11/H6-Photoroom-300x300.jpg' },
  { id: 106, name: 'SMPS 24V', price: 2750, originalPrice: 3000, discount: 8, image: 'https://atplonline.co.in/wp-content/uploads/2024/11/J1-Photoroom-1-300x300.jpg' },
  { id: 107, name: 'Red Light Pointer', price: 1350, originalPrice: 1500, discount: 10, image: 'https://atplonline.co.in/wp-content/uploads/2024/11/D1-300x300.jpg' },
  { id: 108, name: 'SMPS 5V', price: 1200, originalPrice: 1500, discount: 20, image: 'https://atplonline.co.in/wp-content/uploads/2024/11/K4-Photoroom-300x300.jpg' },
];

const MILLING_PRODUCTS = [
  { id: 201, name: 'Clock Spring', price: 2250, originalPrice: 2812, discount: 20, image: 'https://atplonline.co.in/wp-content/uploads/2024/11/A1-Clock-Spring-2250-300x300.jpg' },
  { id: 202, name: 'Feed Reverse Bevel Gear', price: 3550, originalPrice: 3727, discount: 5, image: 'https://atplonline.co.in/wp-content/uploads/2025/03/Untitled-design-4-69-300x300.webp' },
  { id: 203, name: 'Quill Pinion Shaft', price: 4850, originalPrice: 5092, discount: 5, image: 'https://atplonline.co.in/wp-content/uploads/2025/03/Untitled-design-4-61-300x300.webp' },
  { id: 204, name: 'Quill Skirt (B 128)', price: 3750, originalPrice: 3937, discount: 5, image: 'https://atplonline.co.in/wp-content/uploads/2025/03/Untitled-design-5-50-300x300.webp' },
  { id: 205, name: 'TEE BOLT', price: 2250, originalPrice: 2812, discount: 0, image: 'https://atplonline.co.in/wp-content/uploads/2024/11/A32-TEE-BOLT-RS.-2250.jpg', soldOut: true },
];

const NEW_ARRIVALS = [
  { id: 301, name: 'Feed Reverse Clutch', price: 1950, originalPrice: 2047, discount: 5, image: 'https://atplonline.co.in/wp-content/uploads/2025/03/Untitled-design-5-57-300x300.webp' },
  { id: 302, name: 'Clutch Cam Ring', price: 2500, originalPrice: 2677, discount: 7, image: 'https://atplonline.co.in/wp-content/uploads/2025/03/WhatsApp_Image_2025-02-12_at_4.22.18_PM__1_-removebg-preview-300x300.webp' },
  { id: 303, name: 'Gear Shaft (A 57)', price: 9850, originalPrice: 10342, discount: 5, image: 'https://atplonline.co.in/wp-content/uploads/2025/03/Untitled-design-4-65-300x300.webp' },
  { id: 304, name: 'Pinion Shaft Hub Sleeve', price: 2850, originalPrice: 2992, discount: 5, image: 'https://atplonline.co.in/wp-content/uploads/2025/03/Untitled-design-2-61-300x300.webp' },
  { id: 305, name: 'Overload Clutch Assembly', price: 9850, originalPrice: 10342, discount: 5, image: 'https://atplonline.co.in/wp-content/uploads/2025/03/Untitled-design-4-58-300x300.webp' },
];

const BRANDS = [
  'https://atplonline.co.in/wp-content/uploads/2025/01/atpl-client-3-150x150.jpg',
  'https://atplonline.co.in/wp-content/uploads/2025/01/atpl-client-2-1-150x150.jpg',
  'https://atplonline.co.in/wp-content/uploads/2025/01/atpl-client-1-1-150x150.jpg',
  'https://atplonline.co.in/wp-content/uploads/2025/01/atpl-client-7-150x150.jpg',
  'https://atplonline.co.in/wp-content/uploads/2025/01/atpl-client-6-150x150.jpg',
  'https://atplonline.co.in/wp-content/uploads/2025/01/atpl-client-5-150x150.jpg',
];

// --- Components ---

const AnimatedSection = ({ children, className, delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div 
      ref={ref}
      className={cn("transition-all duration-700 ease-out", className)}
      style={{ 
        opacity: isInView ? 1 : 0, 
        transform: isInView ? 'translateY(0)' : 'translateY(30px)',
        transitionDelay: `${delay}ms`
      }}
    >
      {children}
    </div>
  );
};

const ProductCard = ({ product }: { product: any }) => {
  return (
    <Card className="group overflow-hidden border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all duration-300 bg-white h-full flex flex-col">
      <div className="relative pt-[100%] overflow-hidden bg-gray-50">
        <Image src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105" />
        {product.discount > 0 && (
          <Badge className="absolute top-2 left-2 bg-green-600 hover:bg-green-700 text-white border-none px-2 py-1 text-xs">
            -{product.discount}%
          </Badge>
        )}
        {product.soldOut && (
          <Badge variant="secondary" className="absolute top-2 right-2 bg-gray-800 text-white border-none px-2 py-1 text-xs">
            Sold Out
          </Badge>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-white/90 backdrop-blur-sm flex gap-2 justify-center">
          <Button 
            size="sm" 
            className="flex-1 bg-[#006838] hover:bg-[#00502b] text-white rounded-full shadow-md"
            onClick={(e) => {
              e.preventDefault();
              // Add to cart logic
            }}
          >
            <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="flex-1 border-[#006838] text-[#006838] hover:bg-[#006838] hover:text-white rounded-full shadow-md"
            onClick={(e) => {
              e.preventDefault();
              // View details logic
            }}
          >
            <ChevronRight className="w-4 h-4 mr-1" /> View Details
          </Button>
        </div>
      </div>
      <CardContent className="p-4 flex-grow flex flex-col text-center">
        <h3 className="font-medium text-sm text-gray-800 line-clamp-2 mb-2 group-hover:text-[#006838] transition-colors">
          {product.name}
        </h3>
        <div className="mt-auto space-y-1">
          {product.originalPrice > product.price && (
            <span className="text-xs text-gray-400 line-through block">
              ₹{product.originalPrice.toLocaleString()}
            </span>
          )}
          <span className="text-lg font-bold text-[#006838]">
            ₹{product.price.toLocaleString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

const SectionHeader = ({ title }: { title: string }) => (
  <div className="flex items-center justify-between mb-8">
    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 relative inline-block">
      {title}
      <span className="absolute -bottom-2 left-0 w-1/2 h-1 bg-[#006838] rounded-full"></span>
    </h2>
    <Button variant="ghost" className="text-[#006838] hover:text-[#00502b] hover:bg-green-50">
      View All <ChevronRight className="w-4 h-4 ml-1" />
    </Button>
  </div>
);

// --- Main Page Component ---

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
      
      {/* Top Bar */}
      <div className="bg-[#006838] text-white py-2 text-xs md:text-sm hidden md:block">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-6">
            <span className="flex items-center"><Phone className="w-3 h-3 mr-2" /> +91 981 891 2000</span>
            <span className="flex items-center"><Mail className="w-3 h-3 mr-2" /> sales@atplonline.in</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>One Stop E-Shop for All Industrial Products</span>
            <div className="flex items-center space-x-2 border-l border-green-600 pl-4">
              <Facebook className="w-3 h-3 cursor-pointer hover:text-green-200" />
              <Linkedin className="w-3 h-3 cursor-pointer hover:text-green-200" />
              <Twitter className="w-3 h-3 cursor-pointer hover:text-green-200" />
              <Instagram className="w-3 h-3 cursor-pointer hover:text-green-200" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={cn("sticky top-0 z-50 bg-white transition-all duration-300 border-b border-gray-100", isScrolled ? "shadow-md py-2" : "py-4")}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <div className="flex-shrink-0">
              <a href="/" className="flex items-center gap-2">
                <div className="w-10 h-10 bg-[#006838] rounded-lg flex items-center justify-center text-white font-bold text-xl">A</div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg leading-none tracking-tight text-gray-900">ATPL</span>
                  <span className="text-[10px] text-gray-500 tracking-widest uppercase">Online</span>
                </div>
              </a>
            </div>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
              <Input 
                type="text" 
                placeholder="Search for products..." 
                className="w-full pl-4 pr-12 py-5 rounded-full border-gray-200 focus:border-[#006838] focus:ring-1 focus:ring-[#006838] bg-gray-50"
              />
              <Button size="icon" className="absolute right-1 top-1 bottom-1 rounded-full bg-[#006838] hover:bg-[#00502b] w-8 h-8 my-auto">
                <Search className="w-4 h-4 text-white" />
              </Button>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2 md:space-x-4">
              <Button variant="ghost" size="icon" className="hidden md:flex hover:text-[#006838]">
                <User className="w-5 h-5" />
              </Button>
              <div className="relative">
                <Button variant="ghost" size="icon" className="hover:text-[#006838]">
                  <ShoppingCart className="w-5 h-5" />
                  <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full">0</span>
                </Button>
              </div>
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[300px]">
                  <div className="flex flex-col gap-6 mt-8">
                    <Input placeholder="Search..." />
                    <nav className="flex flex-col space-y-4">
                      <a href="#" className="text-lg font-medium hover:text-[#006838]">Home</a>
                      <a href="#" className="text-lg font-medium hover:text-[#006838]">Shop</a>
                      <a href="#" className="text-lg font-medium hover:text-[#006838]">Categories</a>
                      <a href="#" className="text-lg font-medium hover:text-[#006838]">Contact</a>
                    </nav>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center justify-center space-x-8 mt-4 text-sm font-medium text-gray-600">
            <a href="#" className="hover:text-[#006838] transition-colors">Home</a>
            <a href="#" className="hover:text-[#006838] transition-colors">Laser Machines</a>
            <a href="#" className="hover:text-[#006838] transition-colors">Milling Machines</a>
            <a href="#" className="hover:text-[#006838] transition-colors">Spares</a>
            <a href="#" className="hover:text-[#006838] transition-colors">About Us</a>
            <a href="#" className="hover:text-[#006838] transition-colors">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative bg-gray-900 overflow-hidden min-h-[500px] md:min-h-[600px] flex items-center">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-100 to-gray-900 z-0">
          <div className="absolute right-0 top-0 w-full md:w-2/3 h-full bg-[#111] transform -skew-x-12 translate-x-20 md:translate-x-40 origin-top"></div>
          {/* Hexagon Pattern Overlay */}
          <div className="absolute right-0 top-0 w-1/2 h-full opacity-10" 
               style={{ backgroundImage: 'radial-gradient(#006838 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10 grid md:grid-cols-2 gap-12 items-center h-full py-12">
          {/* Left: Product Collage */}
          <AnimatedSection className="relative h-[300px] md:h-[450px] w-full">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-green-100 rounded-full blur-3xl opacity-50"></div>
            <Image src="https://atplonline.co.in/wp-content/uploads/2024/11/baner2.jpeg" alt="Industrial Machinery" className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-700" />
          </AnimatedSection>

          {/* Right: Text Content */}
          <AnimatedSection delay={200} className="text-white text-center md:text-left">
            <Badge className="mb-4 bg-[#006838] hover:bg-[#00502b] text-white px-4 py-1 text-sm uppercase tracking-wider">
              Premium Quality
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Power Up <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">Your Machines</span>
            </h1>
            <p className="text-gray-400 text-lg mb-8 max-w-lg mx-auto md:mx-0">
              Discover the best premium milling and laser spares to enhance your production efficiency.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button size="lg" className="bg-[#006838] hover:bg-[#00502b] text-white rounded-full px-8 h-12 text-base">
                Shop Now <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-black rounded-full px-8 h-12 text-base bg-transparent">
                View Catalog
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Laser Machines Section with Sidebar */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader title="Laser Machines" />
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Product Grid (Left) */}
            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {LASER_PRODUCTS.map((product, idx) => (
                <AnimatedSection key={product.id} delay={idx * 50}>
                  <ProductCard product={product} />
                </AnimatedSection>
              ))}
            </div>

            {/* Sidebar / Promo Card (Right) */}
            <AnimatedSection delay={400} className="w-full lg:w-[280px] flex-shrink-0">
              <div className="h-full min-h-[400px] bg-gray-900 rounded-xl overflow-hidden relative group">
                <Image src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800" alt="Who We Are" className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
                <div className="relative z-10 p-8 h-full flex flex-col justify-end text-white">
                  <h3 className="text-2xl font-bold mb-4">Who We Are</h3>
                  <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                    Discover our journey, values, and commitment to bringing cutting-edge technology to the Indian manufacturing industry.
                  </p>
                  <Button className="w-full bg-[#006838] hover:bg-[#00502b] text-white border-none">
                    About Us
                  </Button>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Shop By Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop By Categories</h2>
            <div className="w-24 h-1 bg-[#006838] mx-auto rounded-full"></div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {CATEGORIES.map((cat, idx) => (
              <AnimatedSection key={cat.id} delay={idx * 100}>
                <a href="#" className="group flex flex-col items-center text-center">
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white shadow-md p-4 mb-4 group-hover:shadow-xl group-hover:scale-105 transition-all duration-300 border-2 border-transparent group-hover:border-[#006838] flex items-center justify-center overflow-hidden">
                    <Image src={cat.image} alt={cat.name} className="w-full h-full object-contain" />
                  </div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-[#006838] transition-colors">{cat.name}</h3>
                </a>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Milling Machines */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader title="Milling Machines" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {MILLING_PRODUCTS.map((product, idx) => (
              <AnimatedSection key={product.id} delay={idx * 50}>
                <ProductCard product={product} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-20 bg-fixed bg-cover bg-center" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?auto=format&fit=crop&q=80&w=2000)' }}>
        <div className="absolute inset-0 bg-black/70"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <AnimatedSection className="p-6 border border-white/20 rounded-lg backdrop-blur-sm bg-white/5">
              <div className="text-5xl font-bold mb-2 text-[#006838]">19</div>
              <div className="text-lg font-medium uppercase tracking-wider">Years of Experience</div>
            </AnimatedSection>
            <AnimatedSection delay={100} className="p-6 border border-white/20 rounded-lg backdrop-blur-sm bg-white/5">
              <div className="text-5xl font-bold mb-2 text-[#006838]">11k</div>
              <div className="text-lg font-medium uppercase tracking-wider">Satisfied Clients</div>
            </AnimatedSection>
            <AnimatedSection delay={200} className="p-6 border border-white/20 rounded-lg backdrop-blur-sm bg-white/5">
              <div className="text-5xl font-bold mb-2 text-[#006838]">179+</div>
              <div className="text-lg font-medium uppercase tracking-wider">Machine Models</div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <SectionHeader title="New Arrivals" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {NEW_ARRIVALS.map((product, idx) => (
              <AnimatedSection key={product.id} delay={idx * 50}>
                <ProductCard product={product} />
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Reach Out Banner */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row">
            <div className="p-8 md:p-12 flex-1 flex flex-col justify-center">
              <h2 className="text-3xl font-bold mb-4 text-gray-900">Reach Out to Us</h2>
              <p className="text-gray-600 mb-8 text-lg">
                Have questions or need assistance? Reach out to us, and our team will be happy to help.
              </p>
              <div>
                <Button size="lg" className="bg-[#006838] hover:bg-[#00502b] text-white rounded-full px-8">
                  Contact Us
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 bg-gray-200 relative min-h-[300px]">
              <Image src="https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&q=80&w=800" alt="Customer Support" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-white via-transparent to-transparent md:bg-gradient-to-r md:from-white md:via-transparent"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Brands */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-gray-900">Our Brands</h2>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12 opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
            {BRANDS.map((brand, idx) => (
              <Image key={idx} src={brand} alt="Brand Logo" className="h-12 md:h-16 object-contain hover:scale-110 transition-transform" />
            ))}
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-12 border-t border-gray-100 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4 text-[#006838]">
                <RefreshCw className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-gray-900">Return within 7 days</h4>
              <p className="text-sm text-gray-500">No questions asked</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4 text-[#006838]">
                <Lock className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-gray-900">Secure Payments</h4>
              <p className="text-sm text-gray-500">100% Safe & Secure</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4 text-[#006838]">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-gray-900">100% Original</h4>
              <p className="text-sm text-gray-500">Guaranteed Authentic</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4 text-[#006838]">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-gray-900">Buyer Protection</h4>
              <p className="text-sm text-gray-500">Full coverage</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 pt-16 pb-8 border-t border-gray-200 text-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
            {/* Company Info */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-[#006838] rounded flex items-center justify-center text-white font-bold">A</div>
                <span className="font-bold text-lg text-gray-900">ATPL Online</span>
              </div>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Your trusted partner in tech innovation and automation. Revolutionizing industries with smart tech solutions.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-gray-600 hover:bg-[#006838] hover:text-white transition-colors">
                  <Facebook className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-gray-600 hover:bg-[#006838] hover:text-white transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
                <a href="#" className="w-8 h-8 rounded-full bg-white shadow flex items-center justify-center text-gray-600 hover:bg-[#006838] hover:text-white transition-colors">
                  <Instagram className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-gray-900 text-lg mb-6">Quick Links</h4>
              <ul className="space-y-3 text-gray-600">
                <li><a href="#" className="hover:text-[#006838] transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-[#006838] transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-[#006838] transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-[#006838] transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-[#006838] transition-colors">Privacy Policy</a></li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-bold text-gray-900 text-lg mb-6">Categories</h4>
              <ul className="space-y-3 text-gray-600">
                <li><a href="#" className="hover:text-[#006838] transition-colors">Laser Machines</a></li>
                <li><a href="#" className="hover:text-[#006838] transition-colors">Milling Machines</a></li>
                <li><a href="#" className="hover:text-[#006838] transition-colors">CNC Parts</a></li>
                <li><a href="#" className="hover:text-[#006838] transition-colors">Spares</a></li>
                <li><a href="#" className="hover:text-[#006838] transition-colors">New Arrivals</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-gray-900 text-lg mb-6">Contact Details</h4>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start">
                  <Phone className="w-5 h-5 mr-3 text-[#006838] mt-0.5" />
                  <span>+91 981 891 2000</span>
                </li>
                <li className="flex items-start">
                  <Mail className="w-5 h-5 mr-3 text-[#006838] mt-0.5" />
                  <span>sales@atplonline.in</span>
                </li>
                <li className="flex items-start">
                  <Truck className="w-5 h-5 mr-3 text-[#006838] mt-0.5" />
                  <span>New Delhi, India</span>
                </li>
              </ul>
            </div>
          </div>

          <Separator className="mb-8" />

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500">© 2024 ATPL Online. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <Image src="https://atplonline.co.in/wp-content/uploads/2024/12/safe-secure-1.webp" alt="Payment Methods" className="h-6 opacity-80" />
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}