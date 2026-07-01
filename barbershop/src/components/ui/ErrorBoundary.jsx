import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-primary flex items-center justify-center p-6">
          <div className="max-w-lg bg-card border border-secondary rounded-2xl p-8 text-center">
            <h1 className="text-2xl font-bold text-secondary mb-3">Algo deu errado</h1>
            <p className="text-gray-400 text-sm mb-4">
              {this.state.error?.message || 'Erro inesperado na aplicação.'}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-5 py-2 bg-button rounded-xl text-text font-bold cursor-pointer"
            >
              Recarregar página
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
