import React from 'react'
import { Link } from 'react-router-dom'
import { FaInstagram, FaTwitter, FaFacebookF, FaLinkedinIn, FaApple, FaGooglePlay } from 'react-icons/fa'

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                <span className="text-white text-xl font-bold">C</span>
              </div>
              <span className="text-2xl font-bold text-white">
                Crave<span className="text-primary-500">Drop</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400">
              Delivering happiness to your doorstep. The fastest, easiest way to get your favorite food.
            </p>
            <div className="flex gap-3">
              {[FaInstagram, FaTwitter, FaFacebookF, FaLinkedinIn].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-dark-800 flex items-center justify-center hover:bg-primary-500 hover:text-white transition-all duration-300">
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Company</h4>
            <ul className="space-y-3 text-sm">
              {['About Us', 'Careers', 'Blog', 'Press'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-primary-400 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-4">Support</h4>
            <ul className="space-y-3 text-sm">
              {['Help Center', 'Terms of Service', 'Privacy Policy', 'Contact Us'].map((item) => (
                <li key={item}>
                  <a href="#" className="hover:text-primary-400 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* App Download */}
          <div>
            <h4 className="text-white font-bold mb-4">Get the App</h4>
            <div className="space-y-3">
              <button className="flex items-center gap-3 bg-dark-800 hover:bg-dark-700 px-4 py-3 rounded-xl transition-colors w-full">
                <FaApple className="text-2xl" />
                <div className="text-left">
                  <p className="text-xs text-gray-400">Download on the</p>
                  <p className="text-sm font-semibold text-white">App Store</p>
                </div>
              </button>
              <button className="flex items-center gap-3 bg-dark-800 hover:bg-dark-700 px-4 py-3 rounded-xl transition-colors w-full">
                <FaGooglePlay className="text-2xl" />
                <div className="text-left">
                  <p className="text-xs text-gray-400">Get it on</p>
                  <p className="text-sm font-semibold text-white">Google Play</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-dark-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500"> 2026 CraveDrop. All rights reserved.</p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-primary-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-primary-400 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  )
}