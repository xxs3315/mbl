/// <reference types="vite/client" />

// veaury 类型声明
declare module "veaury" {
  import { ComponentType } from "react";
  import { DefineComponent } from "vue";

  export interface VeauryOptions {
    react?: {
      createRoot?: any;
    };
  }

  export function setVeauryOptions(options: VeauryOptions): void;

  export function applyReactInVue<T = any>(
    ReactComponent: ComponentType<T>,
    options?: {
      useInjectPropsFromWrapper?: boolean;
      useInjectSlotsFromWrapper?: boolean;
    },
  ): DefineComponent<T>;

  export function applyPureReactInVue<T = any>(
    ReactComponent: ComponentType<T>,
  ): DefineComponent<T>;
}

// MixBoxLayout 组件类型声明
declare module "@xxs3315/mbl-lib" {
  import { ComponentType } from "react";

  export interface MixBoxLayoutProps {
    id?: string;
    content?: any;
    theme?: "light" | "dark";
    width?: string | number;
    height?: string | number;
    [key: string]: any;
  }

  export const MixBoxLayout: ComponentType<MixBoxLayoutProps>;
}

// 示例数据类型声明
declare module "@xxs3315/mbl-lib-example-data" {
  export const contents: any;
}
