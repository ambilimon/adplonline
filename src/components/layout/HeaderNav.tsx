// Shared Header Navigation Components
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Grid, Zap, Settings, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

// Menu Categories Data
export const MENU_CATEGORIES = [
    { name: 'CNC Machines', href: '/products/cnc', icon: Grid, desc: 'Precision CNC spares' },
    { name: 'Laser Machines', href: '/products/laser', icon: Zap, desc: 'Laser optics & parts' },
    { name: 'Milling Machines', href: '/products/milling', icon: Settings, desc: 'Milling components' },
    { name: 'EDM Machines', href: '/products/edm', icon: ChevronDown, desc: 'EDM wire & electrodes' },
    { name: 'Machine Spares', href: '/products/spares', icon: Package, desc: 'Universal spares' },
    { name: 'Accessories', href: '/products/accessories', icon: Settings, desc: 'Tools & accessories' },
];

export const FEATURED_PRODUCTS = [
    { name: 'LENS 220 (1064mm)', href: '/product/lens-220', price: '₹7,500' },
    { name: 'Galvo Scanner', href: '/product/galvo-scanner', price: '₹22,500' },
    { name: 'Clock Spring', href: '/product/clock-spring', price: '₹2,250' },
];

// Mega Menu Component
export const MegaMenu = ({ activeMenu, setActiveMenu }: { activeMenu: string | null, setActiveMenu: (menu: string | null) => void }) => (
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
                            Shop Now
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
export const MobileMegaMenu = () => {
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
