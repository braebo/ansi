interface PaintOptions {
    /**
     * Whether to print objects in a single line.
     *
     * @default true
     */
    inline?: boolean;
    /**
     * Prepends a prefix to each line.
     * @default ''
     */
    prefix?: string;
    /**
     * Characters in an inline array/object before auto-expanding.
     * @default 50
     */
    printWidth?: number;
}
export declare function paint(v: any, opts?: PaintOptions): string;
export {};
