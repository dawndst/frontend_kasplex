import { useMediaQuery } from 'react-responsive'

const useResponsive = () => {
    const userAgent = typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    const isMobileByUserAgent = Boolean(
        userAgent.match(
            /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
        )
    );
    const isMobileByWidth = useMediaQuery({ maxWidth: 797 })
    const isMobile = isMobileByUserAgent || isMobileByWidth;
    const isDesktop = useMediaQuery({ minWidth: 1024 })
    return { isMobile, isDesktop }
}

export default useResponsive