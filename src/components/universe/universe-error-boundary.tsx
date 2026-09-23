"use client";

import { Component, type ReactNode } from "react";

type Props = { fallback: ReactNode; children: ReactNode };
type State = { hasError: boolean };

/**
 * Catches a runtime failure inside the 3D scene (e.g. a WebGL context that
 * dies after mount) so the visitor gets a real fallback instead of a blank
 * central area. `hasWebGL()` in universe-home.tsx catches the more common
 * "no WebGL at all" case before this even mounts; this is the second layer.
 */
export class UniverseErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error("[universe] 3D scene failed to render:", error);
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}
