import React from "react";
import Preloader from "../components/common/preloader/Preloader";

export function withSuspense<WCP>(WrappedComponent: React.ComponentType<WCP>) {
  return (props: WCP) => (
    <React.Suspense fallback={<Preloader />}>
      <WrappedComponent {...(props as any)} />
    </React.Suspense>
  );
}
