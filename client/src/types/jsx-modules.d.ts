import * as React from 'react';

declare module '*.jsx' {
  const Component: React.ComponentType<any>;
  export default Component;
}
