export const RouteSceanConfig = {
    VIEW_PATH_PATTERN: /\/views\/(.+)\.(vue|tsx)$/,
    PATH_SEPARATOR: '/',
    MIN_DEPTH: 2,
    MAX_DEPTH: 3,
}
export type BreakPointKey = 'xs' | 's' | 'm' | 'l' | 'xl' | 'xxl'

export const breakpoints = {
    xs: 640,
    s: 640,
    m: 1024,
    l: 1280,
    xl: 1536,
    xxl: 1920,
}