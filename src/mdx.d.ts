// Lets stories import their MDX docs page (parameters.docs.page).
declare module '*.mdx' {
  import type { ComponentType } from 'react';

  const MDXContent: ComponentType;
  export default MDXContent;
}
