import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier/flat";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // React Three Fiber code is imperative by design: `useFrame` mutates
    // three.js objects every frame and object positions are set outside of
    // React render. The mode provider hydrates from localStorage in an
    // effect. The React Compiler purity rules don't fit either pattern.
    files: [
      "src/components/universe/**/*.{ts,tsx}",
      "src/components/mode/**/*.{ts,tsx}",
      "src/lib/use-media.ts",
    ],
    rules: {
      "react-hooks/immutability": "off",
      "react-hooks/refs": "off",
      "react-hooks/purity": "off",
      "react-hooks/set-state-in-effect": "off",
    },
  },
  // Turn off ESLint rules that would conflict with Prettier formatting.
  prettier,
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);

export default eslintConfig;
