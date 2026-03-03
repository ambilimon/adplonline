// Product Detail Page for ADPLOnline
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ShoppingCart, Search, User, Menu, Phone, Mail,
    Facebook, Linkedin, Twitter, Instagram, ChevronRight, ChevronDown,
    Star, ShieldCheck, Truck, Lock, ArrowRight,
    CheckCircle2, X, Grid, Package, Zap, Settings, Minus, Plus,
    ZoomIn, FileText, Download, AlertCircle, MapPin
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { Image } from '@/components/ui/image';

// HTML Sanitization function to prevent XSS attacks
const sanitizeHtml = (html: string): string => {
    // Basic HTML sanitization - remove script tags, event handlers, and javascript: URLs
    return html
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/on\w+="[^"]*"/gi, '')
        .replace(/on\w+='[^']*'/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/data:/gi, '');
};
interface Review {
    id: string;
    author: string;
    rating: number;
    date: string;
    comment: string;
    verified: boolean;
}

interface BulkPricing {
    minQty: number;
    price: number;
}

interface ShippingMethod {
    name: string;
    cost: number;
    timeframe: string;
}

interface Document {
    name: string;
    url: string;
    size: string;
}

interface RelatedProduct {
    id: string;
    name: string;
    price: number;
    image: string;
    slug: string;
}

interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    longDescription: string;
    price: number;
    originalPrice: number;
    discount: number;
    sku: string;
    availability: 'in-stock' | 'low-stock' | 'out-of-stock';
    stockCount: number;
    images: string[];
    specifications: Record<string, string>;
    bulkPricing: BulkPricing[];
    category: string;
    subcategory: string;
    reviews: Review[];
    rating: number;
    reviewCount: number;
    documents: Document[];
    warranty: string;
    shipping: {
        methods: ShippingMethod[];
        estimatedDays: number;
    };
    relatedProducts: RelatedProduct[];
    brand: string;
}

// Mock Products Database - In production, this would come from API
const MOCK_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'PRECi Centre Machining Center LV Series',
        slug: 'preci-centre-machining-center-lv-series',
        description: 'High-precision CNC machining center for industrial applications',
        longDescription: `
    <h2>Overview</h2>
    <p>The PREC i Centre LV Series represents the pinnacle of precision machining technology. Designed for high-precision industrial applications, this machining center delivers exceptional accuracy and reliability.</p>
    
    <h3>Key Features</h3>
    <ul>
      <li>High-speed spindle with precision bearings</li>
      <li>Advanced CNC control system</li>
      <li>Rigid machine structure for stability</li>
      <li>Automatic tool changer</li>
      <li>Coolant system for extended tool life</li>
    </ul>
    
    <h3>Applications</h3>
    <p>Ideal for die and mold making, precision parts manufacturing, aerospace components, and medical device production.</p>
   `,
        price: 4500000,
        originalPrice: 5200000,
        discount: 13,
        sku: 'PRE-LV-2024',
        availability: 'in-stock',
        stockCount: 5,
        images: [
            'https://atplonline.co.in/wp-content/uploads/2024/11/product-main.jpg',
            'https://atplonline.co.in/wp-content/uploads/2024/11/product-1.jpg',
            'https://atplonline.co.in/wp-content/uploads/2024/11/product-2.jpg',
            'https://atplonline.co.in/wp-content/uploads/2024/11/product-3.jpg'
        ],
        specifications: {
            'Spindle Speed': '10,000 RPM',
            'Travel X/Y/Z': '600/500/500 mm',
            'Table Size': '800 x 500 mm',
            'Tool Capacity': '24 tools',
            'Positioning Accuracy': '±0.005 mm',
            'Repeatability': '±0.003 mm',
            'Motor': '15 kW AC Servo',
            'Voltage': '380V 3-Phase',
            'Weight': '4500 kg',
            'Dimensions': '2800 x 2200 x 2400 mm'
        },
        bulkPricing: [
            { minQty: 2, price: 4300000 },
            { minQty: 5, price: 4100000 }
        ],
        category: 'Machines',
        subcategory: 'CNC Machining Centers',
        reviews: [
            { id: '1', author: 'Rajesh Kumar', rating: 5, date: '2024-12-15', comment: 'Excellent precision and build quality. Highly recommended for industrial use.', verified: true },
            { id: '2', author: 'Amit Sharma', rating: 4, date: '2024-11-20', comment: 'Good machine with great support from ATPL. Minor issues with initial setup.', verified: true },
            { id: '3', author: 'Suresh Patel', rating: 5, date: '2024-10-05', comment: 'Outstanding performance. Our production efficiency increased by 40%.', verified: true }
        ],
        rating: 4.7,
        reviewCount: 23,
        documents: [
            { name: 'Product Brochure', url: '/docs/brochure.pdf', size: '2.5 MB' },
            { name: 'Technical Specifications', url: '/docs/specs.pdf', size: '1.2 MB' },
            { name: 'User Manual', url: '/docs/manual.pdf', size: '5.8 MB' }
        ],
        warranty: '2 Years Comprehensive Warranty',
        shipping: {
            methods: [
                { name: 'Standard Delivery', cost: 50000, timeframe: '15-20 business days' },
                { name: 'Express Delivery', cost: 85000, timeframe: '7-10 business days' },
                { name: 'Installation Included', cost: 150000, timeframe: '10-15 business days' }
            ],
            estimatedDays: 15
        },
        relatedProducts: [
            { id: '101', name: 'LENS 220 (1064mm)', price: 7500, image: 'https://atplonline.co.in/wp-content/uploads/2024/11/B1-300x300.jpg', slug: 'lens-220' },
            { id: '102', name: 'Galvo Scanner', price: 22500, image: 'https://atplonline.co.in/wp-content/uploads/2024/11/E1-300x300.jpg', slug: 'galvo-scanner' },
            { id: '201', name: 'Clock Spring', price: 2250, image: 'https://atplonline.co.in/wp-content/uploads/2024/11/A1-Clock-Spring-2250-300x300.jpg', slug: 'clock-spring' },
            { id: '103', name: 'SMPS 24V', price: 2750, image: 'https://atplonline.co.in/wp-content/uploads/2024/11/J1-Photoroom-1-300x300.jpg', slug: 'smps-24v' }
        ],
        brand: 'PRECi'
    },
    // Add more products here for testing different slugs
    {
        id: '101',
        name: 'LENS 220 (1064nm)',
        slug: 'lens-220',
        description: 'High-quality focusing lens for laser machines',
        longDescription: `<h2>Product Overview</h2><p>Premium quality focusing lens for industrial laser cutting and engraving machines.</p><h3>Specifications</h3><ul><li>Wavelength: 1064nm</li><li>Focal Length: 150mm</li><li>Material: ZnSe</li></ul>`,
        price: 7500,
        originalPrice: 9000,
        discount: 17,
        sku: 'LENS-220-1064',
        availability: 'in-stock',
        stockCount: 50,
        images: ['https://atplonline.co.in/wp-content/uploads/2024/11/B1-300x300.jpg'],
        specifications: {
            'Wavelength': '1064nm',
            'Focal Length': '150mm',
            'Material': 'ZnSe',
            'Diameter': '20mm'
        },
        bulkPricing: [{ minQty: 10, price: 6500 }],
        category: 'Laser Machines',
        subcategory: 'Optical Parts',
        reviews: [{ id: '1', author: 'Tech Solutions', rating: 5, date: '2024-09-10', comment: 'Excellent lens quality', verified: true }],
        rating: 5.0,
        reviewCount: 12,
        documents: [{ name: 'Data Sheet', url: '/docs/lens-220.pdf', size: '500 KB' }],
        warranty: '1 Year Warranty',
        shipping: { methods: [{ name: 'Standard', cost: 200, timeframe: '3-5 days' }], estimatedDays: 5 },
        relatedProducts: [],
        brand: 'ATPL'
    }
];

// Breadcrumb Component
const Breadcrumb = ({ items }: { items: { label: string; href?: string }[] }) => (
    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6" aria-label="Breadcrumb">
        <Link to="/" className="hover:text-[#006838] transition-colors">Home</Link>
        {items.map((item, index) => (
            <React.Fragment key={index}>
                <ChevronRight className="w-4 h-4" />
                {item.href ? (
                    <Link to={item.href} className="hover:text-[#006838] transition-colors">{item.label}</Link>
                ) : (
                    <span className="text-gray-900 font-medium">{item.label}</span>
                )}
            </React.Fragment>
        ))}
    </nav>
);

// Image Gallery Component
const ImageGallery = ({ images, productName }: { images: string[]; productName: string }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const imageRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!imageRef.current) return;
        const rect = imageRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomPosition({ x, y });
    };

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div
                ref={imageRef}
                className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-zoom-in"
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
                onMouseMove={handleMouseMove}
                onClick={() => setIsZoomed(!isZoomed)}
            >
                <Image
                    src={images[selectedIndex]}
                    alt={`${productName} - Image ${selectedIndex + 1}`}
                    className={cn(
                        "w-full h-full object-contain transition-transform duration-300",
                        isZoomed && "scale-150"
                    )}
                    style={isZoomed ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` } : undefined}
                />
                <div className="absolute top-4 right-4 bg-white/90 p-2 rounded-full shadow-md">
                    <ZoomIn className="w-5 h-5 text-gray-600" />
                </div>
            </div>

            {/* Thumbnail Gallery */}
            <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedIndex(index)}
                        className={cn(
                            "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                            selectedIndex === index ? "border-[#006838]" : "border-transparent hover:border-gray-300"
                        )}
                    >
                        <Image
                            src={image}
                            alt={`${productName} thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>
        </div>
    );
};

// Star Rating Component
const StarRating = ({ rating, showValue = true }: { rating: number; showValue?: boolean }) => (
    <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
            <Star
                key={star}
                className={cn(
                    "w-4 h-4",
                    star <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                )}
            />
        ))}
        {showValue && <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>}
    </div>
);

// Availability Badge Component
const AvailabilityBadge = ({ availability, stockCount }: { availability: string; stockCount: number }) => {
    const config = {
        'in-stock': { color: 'bg-green-100 text-green-700', icon: CheckCircle2, text: 'In Stock' },
        'low-stock': { color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle, text: `Low Stock (${stockCount} left)` },
        'out-of-stock': { color: 'bg-red-100 text-red-700', icon: X, text: 'Out of Stock' }
    };
    const { color, icon: Icon, text } = config[availability as keyof typeof config] || config['out-of-stock'];

    return (
        <Badge className={cn("flex items-center gap-1 px-3 py-1", color)}>
            <Icon className="w-3 h-3" />
            {text}
        </Badge>
    );
};

// Quantity Selector Component
const QuantitySelector = ({ value, onChange, max }: { value: number; onChange: (val: number) => void; max: number }) => (
    <div className="flex items-center border border-gray-200 rounded-lg">
        <button
            onClick={() => onChange(Math.max(1, value - 1))}
            className="p-3 hover:bg-gray-50 transition-colors rounded-l-lg"
            aria-label="Decrease quantity"
        >
            <Minus className="w-4 h-4" />
        </button>
        <input
            type="number"
            value={value}
            onChange={(e) => onChange(Math.min(max, Math.max(1, parseInt(e.target.value) || 1)))}
            className="w-16 text-center border-x border-gray-200 py-2 focus:outline-none"
            min={1}
            max={max}
        />
        <button
            onClick={() => onChange(Math.min(max, value + 1))}
            className="p-3 hover:bg-gray-50 transition-colors rounded-r-lg"
            aria-label="Increase quantity"
        >
            <Plus className="w-4 h-4" />
        </button>
    </div>
);

// Specifications Table Component
const SpecificationsTable = ({ specifications }: { specifications: Record<string, string> }) => (
    <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full">
            <tbody>
                {Object.entries(specifications).map(([key, value], index) => (
                    <tr key={key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-600 border-r border-gray-200 w-1/2">{key}</td>
                        <td className="px-4 py-3 text-sm text-gray-900">{value}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

// Review Card Component
const ReviewCard = ({ review }: { review: Review }) => (
    <div className="border-b border-gray-100 pb-4 last:border-0">
        <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#006838] rounded-full flex items-center justify-center text-white text-sm font-medium">
                    {review.author.charAt(0)}
                </div>
                <span className="font-medium text-gray-900">{review.author}</span>
                {review.verified && (
                    <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> Verified
                    </Badge>
                )}
            </div>
            <span className="text-sm text-gray-500">{review.date}</span>
        </div>
        <StarRating rating={review.rating} showValue={false} />
        <p className="mt-2 text-gray-600 text-sm">{review.comment}</p>
    </div>
);

// Related Product Card
const RelatedProductCard = ({ product }: { product: RelatedProduct }) => (
    <Card className="group overflow-hidden border border-gray-100 hover:border-green-200 hover:shadow-lg transition-all duration-300">
        <div className="relative pt-[100%] overflow-hidden bg-gray-50">
            <Image
                src={product.image}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
            />
        </div>
        <CardContent className="p-4 text-center">
            <h3 className="font-medium text-sm text-gray-800 line-clamp-2 mb-2 group-hover:text-[#006838] transition-colors">
                {product.name}
            </h3>
            <span className="text-lg font-bold text-[#006838]">
                ₹{product.price.toLocaleString()}
            </span>
        </CardContent>
    </Card>
);

// Mega Menu (copied from HomePage for consistency)
const MENU_CATEGORIES = [
    { name: 'CNC Machines', href: '/products/cnc', icon: Grid, desc: 'Precision CNC spares' },
    { name: 'Laser Machines', href: '/products/laser', icon: Zap, desc: 'Laser optics & parts' },
    { name: 'Milling Machines', href: '/products/milling', icon: Settings, desc: 'Milling components' },
    { name: 'EDM Machines', href: '/products/edm', icon: ChevronDown, desc: 'EDM wire & electrodes' },
    { name: 'Machine Spares', href: '/products/spares', icon: Package, desc: 'Universal spares' },
    { name: 'Accessories', href: '/products/accessories', icon: Settings, desc: 'Tools & accessories' },
];

const FEATURED_PRODUCTS = [
    { name: 'LENS 220 (1064mm)', href: '/product/lens-220', price: '₹7,500' },
    { name: 'Galvo Scanner', href: '/product/galvo-scanner', price: '₹22,500' },
    { name: 'Clock Spring', href: '/product/clock-spring', price: '₹2,250' },
];

const MegaMenu = ({ activeMenu, setActiveMenu }: { activeMenu: string | null, setActiveMenu: (menu: string | null) => void }) => (
    <div
        className="absolute top-full left-0 right-0 bg-white shadow-xl border-t border-gray-100 z-40 transform opacity-0 invisible -translate-y-2 transition-all duration-300"
        style={{
            opacity: activeMenu ? 1 : 0,
            visibility: activeMenu ? 'visible' : 'hidden',
            transform: activeMenu ? 'translateY(0)' : 'translateY(-10px)'
        }}
        onMouseLeave={() => setActiveMenu(null)}
    >
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-4 gap-8">
                <div className="border-r border-gray-100 pr-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                        <Package className="w-4 h-4 mr-2 text-[#006838]" />
                        Featured Products
                    </h3>
                    <ul className="space-y-3">
                        {FEATURED_PRODUCTS.map((product, idx) => (
                            <li key={idx}>
                                <a href={product.href} className="text-sm text-gray-600 hover:text-[#006838] transition-colors block">
                                    {product.name}
                                </a>
                                <span className="text-xs text-[#006838] font-semibold">{product.price}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="col-span-2 border-r border-gray-100 pr-6">
                    <h3 className="font-bold text-gray-900 mb-4 flex items-center">
                        <Grid className="w-4 h-4 mr-2 text-[#006838]" />
                        Categories
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {MENU_CATEGORIES.map((category, idx) => (
                            <a key={idx} href={category.href} className="flex items-center p-3 rounded-lg hover:bg-green-50 transition-colors group">
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3 group-hover:bg-[#006838] transition-colors">
                                    <category.icon className="w-5 h-5 text-[#006838] group-hover:text-white" />
                                </div>
                                <div>
                                    <span className="font-medium text-gray-900 block">{category.name}</span>
                                    <span className="text-xs text-gray-500">{category.desc}</span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
                <div className="relative rounded-xl overflow-hidden h-full min-h-[200px]">
                    <div className="absolute inset-0 bg-gradient-to-br from-[#006838] to-[#004d2a]">
                        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '10px 10px' }}></div>
                    </div>
                    <div className="relative z-10 p-6 h-full flex flex-col justify-center text-white">
                        <h4 className="font-bold text-xl mb-2">New Arrivals</h4>
                        <p className="text-sm text-green-100 mb-4">Check out our latest laser & milling machine spares</p>
                        <Button size="sm" className="bg-white text-[#006838] hover:bg-green-50 w-fit">
                            Shop Now <ArrowRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100 flex gap-6">
                <a href="/products" className="text-sm text-gray-500 hover:text-[#006838] transition-colors">All Products</a>
                <a href="/products/cnc" className="text-sm text-gray-500 hover:text-[#006838] transition-colors">CNC Machines</a>
                <a href="/products/laser" className="text-sm text-gray-500 hover:text-[#006838] transition-colors">Laser Machines</a>
                <a href="/products/milling" className="text-sm text-gray-500 hover:text-[#006838] transition-colors">Milling Machines</a>
            </div>
        </div>
    </div>
);

// Mobile Mega Menu
const MobileMegaMenu = () => {
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

    return (
        <div className="flex flex-col space-y-2">
            {MENU_CATEGORIES.map((category, idx) => (
                <div key={idx} className="border-b border-gray-100 pb-2">
                    <button
                        onClick={() => setExpandedCategory(expandedCategory === category.name ? null : category.name)}
                        className="w-full flex items-center justify-between py-2 text-gray-700 hover:text-[#006838]"
                    >
                        <span className="font-medium">{category.name}</span>
                        <ChevronDown className={cn("w-4 h-4 transition-transform", expandedCategory === category.name && "rotate-180")} />
                    </button>
                    {expandedCategory === category.name && (
                        <div className="pl-4 mt-2 space-y-2">
                            <p className="text-sm text-gray-500">{category.desc}</p>
                            <a href={category.href} className="block text-sm text-[#006838] hover:underline">
                                View All {category.name} →
                            </a>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

// Main Product Detail Page Component
export default function ProductDetailPage() {
    const { slug } = useParams<{ slug: string }>();
    const [quantity, setQuantity] = useState(1);
    const [selectedBulkPrice, setSelectedBulkPrice] = useState<number | null>(null);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Find product by slug - in production this would be an API call
    const product = useMemo(() => {
        if (!slug) return MOCK_PRODUCTS[0];
        const found = MOCK_PRODUCTS.find(p => p.slug === slug);
        return found || null;
    }, [slug]);

    // Simulate loading state (in production, remove this and use actual API)
    useEffect(() => {
        setIsLoading(true);
        setError(null);

        // Simulate network delay
        const timer = setTimeout(() => {
            if (!product) {
                setError('Product not found. The product you are looking for does not exist.');
            }
            setIsLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [slug, product]);

    // Scroll handler
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Calculate price based on quantity
    const currentPrice = selectedBulkPrice || product?.price || 0;
    const totalPrice = currentPrice * quantity;

    // Breadcrumb items
    const breadcrumbItems = product ? [
        { label: 'Products', href: '/products' },
        { label: product.category, href: `/category/${product.category.toLowerCase()}` },
        { label: product.subcategory, href: `/category/${product.category.toLowerCase()}/${product.subcategory.toLowerCase().replace(/ /g, '-')}` },
        { label: product.name }
    ] : [];

    // Show loading state
    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-[#006838] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600">Loading product...</p>
                </div>
            </div>
        );
    }

    // Show error state
    if (error || !product) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <X className="w-10 h-10 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
                    <p className="text-gray-600 mb-8">{error || 'The product you are looking for does not exist or has been removed.'}</p>
                    <Link
                        to="/products"
                        className="inline-flex items-center gap-2 bg-[#006838] text-white px-6 py-3 rounded-full hover:bg-[#00502b] transition-colors"
                    >
                        <ArrowRight className="w-4 h-4" />
                        Browse Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans text-gray-900">
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

            {/* Header */}
            <header className={cn("sticky top-0 z-50 bg-white transition-all duration-300 border-b border-gray-100", isScrolled ? "shadow-md py-2" : "py-4")}>
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex-shrink-0">
                            <Link to="/" className="flex items-center gap-2">
                                <div className="w-10 h-10 bg-[#006838] rounded-lg flex items-center justify-center text-white font-bold text-xl">A</div>
                                <div className="flex flex-col">
                                    <span className="font-bold text-lg leading-none tracking-tight text-gray-900">ATPL</span>
                                    <span className="text-[10px] text-gray-500 tracking-widest uppercase">Online</span>
                                </div>
                            </Link>
                        </div>

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
                                        <nav className="flex flex-col space-y-2">
                                            <Link to="/" className="text-lg font-medium hover:text-[#006838] py-2 border-b border-gray-100">Home</Link>
                                            <MobileMegaMenu />
                                            <Link to="/about-us" className="text-lg font-medium hover:text-[#006838] py-2 border-b border-gray-100">About Us</Link>
                                            <Link to="/contact-us" className="text-lg font-medium hover:text-[#006838] py-2 border-b border-gray-100">Contact</Link>
                                        </nav>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>

                    <nav className="hidden md:flex items-center justify-center mt-4 text-sm font-medium text-gray-600 relative">
                        <Link to="/" className="hover:text-[#006838] transition-colors px-4 py-2">Home</Link>

                        <div
                            className="relative"
                            onMouseEnter={() => setActiveMenu('products')}
                            onMouseLeave={() => setActiveMenu(null)}
                        >
                            <button className="flex items-center hover:text-[#006838] transition-colors px-4 py-2">
                                Products <ChevronDown className={cn("w-4 h-4 ml-1 transition-transform", activeMenu === 'products' && "rotate-180")} />
                            </button>
                            <MegaMenu activeMenu={activeMenu} setActiveMenu={setActiveMenu} />
                        </div>

                        <Link to="/products/spares" className="hover:text-[#006838] transition-colors px-4 py-2">Spares</Link>
                        <Link to="/about-us" className="hover:text-[#006838] transition-colors px-4 py-2">About Us</Link>
                        <Link to="/contact-us" className="hover:text-[#006838] transition-colors px-4 py-2">Contact</Link>
                    </nav>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {/* Breadcrumb */}
                <Breadcrumb items={breadcrumbItems} />

                {/* Product Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
                    {/* Left Column - Image Gallery */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <ImageGallery images={product.images} productName={product.name} />
                    </motion.div>

                    {/* Right Column - Product Information */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="space-y-6"
                    >
                        {/* Brand */}
                        <span className="text-sm text-gray-500 uppercase tracking-wider">{product.brand}</span>

                        {/* Title */}
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                            {product.name}
                        </h1>

                        {/* Rating & Reviews */}
                        <div className="flex items-center gap-4">
                            <StarRating rating={product.rating} />
                            <span className="text-sm text-gray-500">({product.reviewCount} reviews)</span>
                            <Link to="#reviews" className="text-sm text-[#006838] hover:underline">
                                Write a review
                            </Link>
                        </div>

                        {/* SKU */}
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>SKU:</span>
                            <span className="font-mono bg-gray-100 px-2 py-1 rounded">{product.sku}</span>
                        </div>

                        {/* Pricing */}
                        <div className="space-y-2">
                            <div className="flex items-baseline gap-3">
                                <span className="text-3xl font-bold text-[#006838]">
                                    ₹{currentPrice.toLocaleString()}
                                </span>
                                {product.originalPrice > product.price && (
                                    <>
                                        <span className="text-xl text-gray-400 line-through">
                                            ₹{product.originalPrice.toLocaleString()}
                                        </span>
                                        <Badge className="bg-red-500 text-white">
                                            -{product.discount}%
                                        </Badge>
                                    </>
                                )}
                            </div>

                            {/* Bulk Pricing */}
                            {product.bulkPricing.length > 0 && (
                                <div className="space-y-2 pt-2">
                                    <span className="text-sm font-medium text-gray-700">Bulk Pricing:</span>
                                    <div className="flex flex-wrap gap-2">
                                        {product.bulkPricing.map((bulk, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedBulkPrice(bulk.price)}
                                                className={cn(
                                                    "px-3 py-1 rounded-full text-sm border transition-colors",
                                                    selectedBulkPrice === bulk.price
                                                        ? "border-[#006838] bg-[#006838] text-white"
                                                        : "border-gray-200 hover:border-[#006838]"
                                                )}
                                            >
                                                {bulk.minQty}+ units: ₹{bulk.price.toLocaleString()}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Availability */}
                        <div className="flex items-center gap-4">
                            <AvailabilityBadge availability={product.availability} stockCount={product.stockCount} />
                            {product.availability === 'in-stock' && (
                                <span className="text-sm text-gray-500 flex items-center">
                                    <Truck className="w-4 h-4 mr-1" />
                                    Est. delivery: {product.shipping.estimatedDays} days
                                </span>
                            )}
                        </div>

                        <Separator />

                        {/* Quantity & Add to Cart */}
                        <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                                <div className="w-full sm:w-auto">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Quantity:</label>
                                    <QuantitySelector
                                        value={quantity}
                                        onChange={setQuantity}
                                        max={product.stockCount}
                                    />
                                </div>

                                <div className="flex-1 w-full">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Total Price:</label>
                                    <div className="text-2xl font-bold text-gray-900">
                                        ₹{totalPrice.toLocaleString()}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    size="lg"
                                    className="flex-1 bg-[#006838] hover:bg-[#00502b] text-white rounded-full h-12 text-base"
                                    disabled={product.availability === 'out-of-stock'}
                                >
                                    <ShoppingCart className="w-5 h-5 mr-2" />
                                    Add to Cart
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    className="flex-1 border-[#006838] text-[#006838] hover:bg-[#006838] hover:text-white rounded-full h-12 text-base"
                                >
                                    Get Quote
                                </Button>
                            </div>
                        </div>

                        {/* Warranty Badge */}
                        <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
                            <ShieldCheck className="w-8 h-8 text-[#006838]" />
                            <div>
                                <span className="font-medium text-gray-900 block">{product.warranty}</span>
                                <span className="text-sm text-gray-500">Comprehensive coverage for peace of mind</span>
                            </div>
                        </div>

                        {/* Quick Contact */}
                        <div className="flex flex-col sm:flex-row gap-3 text-sm">
                            <a href="tel:+919818912000" className="flex items-center gap-2 text-gray-600 hover:text-[#006838]">
                                <Phone className="w-4 h-4" />
                                +91 981 891 2000
                            </a>
                            <a href="mailto:sales@atplonline.in" className="flex items-center gap-2 text-gray-600 hover:text-[#006838]">
                                <Mail className="w-4 h-4" />
                                sales@atplonline.in
                            </a>
                            <Link to="/contact-us" className="flex items-center gap-2 text-[#006838] hover:underline">
                                Contact Form →
                            </Link>
                        </div>
                    </motion.div>
                </div>

                {/* Product Details Tabs */}
                <div className="mb-16">
                    <div className="border-b border-gray-200">
                        <nav className="flex gap-8">
                            {['Description', 'Specifications', 'Reviews', 'Documents', 'Shipping'].map((tab, idx) => (
                                <button
                                    key={tab}
                                    className={cn(
                                        "py-4 border-b-2 font-medium text-sm transition-colors",
                                        idx === 0 ? "border-[#006838] text-[#006838]" : "border-transparent text-gray-500 hover:text-gray-700"
                                    )}
                                >
                                    {tab}
                                </button>
                            ))}
                        </nav>
                    </div>

                    <div className="py-8">
                        {/* Description Tab */}
                        <div className="prose max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: sanitizeHtml(product.longDescription) }} />
                        </div>
                    </div>
                </div>

                {/* Specifications Section */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Technical Specifications</h2>
                    <SpecificationsTable specifications={product.specifications} />
                </section>

                {/* Reviews Section */}
                <section id="reviews" className="mb-16">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
                        <Button className="bg-[#006838] hover:bg-[#00502b]">
                            Write a Review
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6 bg-gray-50 rounded-xl">
                            <div className="text-5xl font-bold text-[#006838] mb-2">{product.rating}</div>
                            <StarRating rating={product.rating} />
                            <p className="text-sm text-gray-500 mt-2">Based on {product.reviewCount} reviews</p>
                        </div>

                        <div className="md:col-span-2 space-y-4">
                            {product.reviews.map((review) => (
                                <ReviewCard key={review.id} review={review} />
                            ))}
                        </div>
                    </div>
                </section>

                {/* Documents Section */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Technical Documentation</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {product.documents.map((doc, idx) => (
                            <a
                                key={idx}
                                href={doc.url}
                                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-[#006838] hover:bg-green-50 transition-colors group"
                            >
                                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                                    <FileText className="w-6 h-6 text-red-500" />
                                </div>
                                <div className="flex-1">
                                    <span className="font-medium text-gray-900 block group-hover:text-[#006838]">{doc.name}</span>
                                    <span className="text-sm text-gray-500">{doc.size}</span>
                                </div>
                                <Download className="w-5 h-5 text-gray-400 group-hover:text-[#006838]" />
                            </a>
                        ))}
                    </div>
                </section>

                {/* Shipping Information */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-gray-600">
                                <Truck className="w-5 h-5 text-[#006838]" />
                                <span>Estimated delivery: {product.shipping.estimatedDays} business days</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <MapPin className="w-5 h-5 text-[#006838]" />
                                <span>Delivery across India</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <Lock className="w-5 h-5 text-[#006838]" />
                                <span>Secure packaging for machinery</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <h3 className="font-medium text-gray-900">Shipping Options:</h3>
                            {product.shipping.methods.map((method, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div>
                                        <span className="font-medium text-gray-900 block">{method.name}</span>
                                        <span className="text-sm text-gray-500">{method.timeframe}</span>
                                    </div>
                                    <span className="font-semibold text-[#006838]">
                                        {method.cost === 0 ? 'Free' : `₹${method.cost.toLocaleString()}`}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Related Products */}
                <section className="mb-16">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Related Products</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {product.relatedProducts.map((product) => (
                            <Link key={product.id} to={`/product/${product.slug}`}>
                                <RelatedProductCard product={product} />
                            </Link>
                        ))}
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="bg-gray-100 pt-16 pb-8 border-t border-gray-200 text-sm">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                        <div>
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 bg-[#006838] rounded flex items-center justify-center text-white font-bold">A</div>
                                <span className="font-bold text-lg text-gray-900">ATPL Online</span>
                            </div>
                            <p className="text-gray-600 mb-6 leading-relaxed">
                                Your trusted partner in tech innovation and automation.
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

                        <div>
                            <h4 className="font-bold text-gray-900 text-lg mb-6">Quick Links</h4>
                            <ul className="space-y-3 text-gray-600">
                                <li><Link to="/about-us" className="hover:text-[#006838] transition-colors">About Us</Link></li>
                                <li><Link to="/contact-us" className="hover:text-[#006838] transition-colors">Contact Us</Link></li>
                                <li><Link to="/blog" className="hover:text-[#006838] transition-colors">Blog</Link></li>
                                <li><a href="#" className="hover:text-[#006838] transition-colors">Terms & Conditions</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold text-gray-900 text-lg mb-6">Categories</h4>
                            <ul className="space-y-3 text-gray-600">
                                <li><Link to="/products/laser" className="hover:text-[#006838] transition-colors">Laser Machines</Link></li>
                                <li><Link to="/products/milling" className="hover:text-[#006838] transition-colors">Milling Machines</Link></li>
                                <li><Link to="/products/cnc" className="hover:text-[#006838] transition-colors">CNC Parts</Link></li>
                                <li><Link to="/products/spares" className="hover:text-[#006838] transition-colors">Spares</Link></li>
                            </ul>
                        </div>

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
                    </div>
                </div>
            </footer>
        </div>
    );
}
