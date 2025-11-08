import React from 'react'

export default function Footer(){
  return (
    <footer className="container mt-12">
      <div className="card">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-muted">
            © 2024 CARVFi - Web3 Identity Platform
          </div>
          <div className="flex gap-6">
            <a href="#" className="text-muted hover:text-accent transition-colors">Twitter</a>
            <a href="#" className="text-muted hover:text-accent transition-colors">GitHub</a>
            <a href="#" className="text-muted hover:text-accent transition-colors">Discord</a>
            <a href="#" className="text-muted hover:text-accent transition-colors">Docs</a>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-700 text-center">
          <p className="text-sm text-muted">
            Built with ❤️ for the Solana ecosystem
          </p>
        </div>
      </div>
    </footer>
  )
}
