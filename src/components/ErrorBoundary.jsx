import { Component } from 'react'
import Button from './ui/Button'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-danger/10 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-danger" />
            </div>
            <h1 className="text-2xl font-bold text-light-100 mb-2">Algo deu errado</h1>
            <p className="text-dark-500 mb-6 text-sm">
              {this.state.error?.message || 'Erro inesperado'}
            </p>
            <Button onClick={() => { this.setState({ hasError: false }); window.location.href = '/' }}>
              Recarregar
            </Button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
