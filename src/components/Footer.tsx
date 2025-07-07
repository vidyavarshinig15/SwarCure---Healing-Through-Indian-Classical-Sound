
import React from 'react';
import { Button } from '@/components/ui/button';
import { Headphones } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-primary to-secondary text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Headphones className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold">SwarCure</span>
            </div>
            <p className="text-white/80 mb-6 max-w-md">
              Healing through Indian classical sound. AI-powered music wellness rooted in tradition, 
              designed to improve mental health across India.
            </p>
            <div className="flex space-x-4">
              <Button variant="outline" className="border-white/30 text-white hover:bg-white hover:text-primary">
                Download App
              </Button>
              <div className="px-4 py-2 bg-white/10 rounded-lg">
                <span className="text-sm">🏥 ABHA Integrated</span>
              </div>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-white/80">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Sound Collections</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Specialists</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-white/80">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">ABHA Integration</a></li>
            </ul>
          </div>
        </div>
        
        {/* Bottom */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm mb-4 md:mb-0">
              © 2024 SwarCure. All rights reserved. Crafted with ❤️ for Indian wellness.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">Facebook</a>
              <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">Instagram</a>
              <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">Twitter</a>
              <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">YouTube</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
