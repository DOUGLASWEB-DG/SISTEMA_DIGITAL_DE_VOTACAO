import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
  nomeDaPagina?: string;
}

interface State {
  hasError: boolean;
  errorMessage: string;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    errorMessage: ''
  };

  public static getDerivedStateFromError(error: Error): State {
    // Atualiza o state para que a próxima renderização mostre a UI de fallback.
    return { hasError: true, errorMessage: error.message };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // É aqui que o "dev sênior" brilha: no futuro, você pode enviar esse log
    // para um serviço de monitoramento (como Sentry ou Datadog) para o seu chefe ver!
    console.error('Erro capturado pelo Error Boundary:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      // Interface amigável que substitui a temida "tela branca"
      return (
        <div className="min-h-[400px] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center border border-gray-100">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-red-500 text-3xl font-bold">!</span>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Ops! Algo não saiu como esperado.</h2>
           <p className="text-gray-500 text-sm mb-6">
                A tela de {this.props.nomeDaPagina || 'nossas funcionalidades'} encontrou um problema inesperado. Nossa equipe já foi notificada.
            </p>
            
            {/* Opcional: Mostrar o erro técnico apenas em ambiente de desenvolvimento */}
            {process.env.NODE_ENV === 'development' && (
              <div className="bg-gray-50 p-3 rounded-lg text-left mb-6 overflow-x-auto border border-gray-200">
                <code className="text-xs text-red-600 font-mono">{this.state.errorMessage}</code>
              </div>
            )}

            <button
              onClick={() => window.location.reload()}
              className="w-full bg-blue-600 text-white font-medium py-2.5 px-4 rounded-xl hover:bg-blue-700 transition active:scale-95"
            >
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    // Se não houver erro, renderiza o componente filho normalmente
    return this.props.children;
  }
}