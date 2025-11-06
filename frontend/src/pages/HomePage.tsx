import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-10 right-10 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center p-6 backdrop-blur-sm">
        <div className="text-white text-3xl font-bold tracking-tight">
          Todo<span className="text-yellow-400">Pro</span>
        </div>
        <div className="space-x-4">
          <Link 
            to="/login" 
            className="text-white/90 hover:text-white transition-colors duration-300 font-medium"
          >
            Connexion
          </Link>
          <Link 
            to="/register" 
            className="bg-white/10 backdrop-blur-sm text-white px-6 py-2 rounded-full hover:bg-white/20 transition-all duration-300 border border-white/20 font-medium"
          >
            Inscription
          </Link>
        </div>
      </nav>
      
      {/* Hero Section */}
      <div className="relative z-10 flex items-center justify-center min-h-[85vh]">
        <div className="text-center text-white max-w-4xl px-6">
          <h1 className="text-6xl md:text-7xl font-bold mb-8 leading-tight">
            <span className="inline-block animate-fade-in-up">Organisez</span>{' '}
            <span className="inline-block animate-fade-in-up animation-delay-200 bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
              vos tâches
            </span>{' '}
            <span className="inline-block animate-fade-in-up animation-delay-400">
              comme jamais
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-12 opacity-90 animate-fade-in-up animation-delay-600 leading-relaxed">
            TodoPro révolutionne votre productivité avec une interface moderne,
            <br />
            des animations fluides et une expérience utilisateur exceptionnelle
          </p>
          
          <div className="space-y-4 md:space-y-0 md:space-x-6 md:flex md:justify-center animate-fade-in-up animation-delay-800">
            <Link 
              to="/register" 
              className="group inline-flex items-center justify-center bg-gradient-to-r from-yellow-400 to-pink-500 text-gray-900 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105"
            >
              <span>Commencer gratuitement</span>
              <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            
            <Link 
              to="/login" 
              className="inline-flex items-center justify-center border-2 border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/10 hover:border-white/50 transition-all duration-300 backdrop-blur-sm"
            >
              Se connecter
            </Link>
          </div>
        </div>
      </div>

      {/* Features floating cards */}
      {/* <div className="absolute bottom-10 left-10 right-10 hidden lg:flex justify-between items-end space-x-6 z-10">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 animate-float">
          <div className="text-4xl mb-3">🚀</div>
          <h3 className="text-white font-semibold mb-2">Ultra Rapide</h3>
          <p className="text-white/70 text-sm">Interface optimisée pour la vitesse</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 animate-float animation-delay-1000">
          <div className="text-4xl mb-3">🎨</div>
          <h3 className="text-white font-semibold mb-2">Design Moderne</h3>
          <p className="text-white/70 text-sm">Interface élégante et intuitive</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 animate-float animation-delay-2000">
          <div className="text-4xl mb-3">⚡</div>
          <h3 className="text-white font-semibold mb-2">Synchronisation</h3>
          <p className="text-white/70 text-sm">Temps réel sur tous vos appareils</p>
        </div>
      </div> */}
    </div>
  );
};

export default HomePage;