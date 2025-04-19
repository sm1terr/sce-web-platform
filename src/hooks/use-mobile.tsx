import * as React from "react";

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false);

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    const handleChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    
    // Установка начального значения
    handleChange();
    
    // Слушаем изменения размера экрана
    mql.addEventListener("change", handleChange);
    
    // Очистка при размонтировании
    return () => mql.removeEventListener("change", handleChange);
  }, []);

  return isMobile;
}

// Экспортируем как именованную функцию, а не по умолчанию
// чтобы избежать ошибки с отсутствием экспорта по умолчанию
