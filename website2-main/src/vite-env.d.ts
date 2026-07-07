/// <reference types="vite/client" />
declare module '*.module.less' {
    const classes: { readonly [key: string]: string }
    export default classes
}
declare module "js-md5" {
    export function md5(message: string): string;
}