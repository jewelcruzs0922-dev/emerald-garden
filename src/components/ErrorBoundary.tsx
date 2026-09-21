"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  name?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Catches rendering errors in its subtree so a single broken section
 * doesn't take down the whole page. Logs the error and shows a
 * graceful fallback.
 */
export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    const name = this.props.name ?? "ErrorBoundary";
    console.error(`[emerald-garden] ${name} caught:`, error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <section className="section" style={{ textAlign: "center" }}>
            <div className="wrap wrap--narrow">
              <p className="muted">Something went wrong loading this section.</p>
            </div>
          </section>
        )
      );
    }
    return this.props.children;
  }
}
