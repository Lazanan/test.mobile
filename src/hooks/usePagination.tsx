// src/hooks/usePagination.ts
import { useMemo } from "react";

export const DOTS = "..."; // Symbole pour les ellipses

// Fonction utilitaire pour créer une plage de nombres
const range = (start: number, end: number) => {
  let length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

interface PaginationParams {
  totalPages: number;
  siblingCount?: number; // Nombre de pages à afficher de chaque côté de la page actuelle
  currentPage: number;
}

export const usePagination = ({
  totalPages,
  siblingCount = 0,
  currentPage,
}: PaginationParams) => {
  const paginationRange = useMemo(() => {
    // Nombre total de numéros à afficher (ex: 1 (première page) + 1 (dernière page) + 1 (page actuelle) + 2*siblingCount + 2 (ellipses))
    const totalPageNumbers = siblingCount + 5;

    // Cas 1: Si le nombre de pages est inférieur au nombre que nous voulons afficher, on affiche tout.
    if (totalPageNumbers >= totalPages) {
      return range(1, totalPages);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    // Cas 2: Pas d'ellipses à gauche, mais à droite oui.
    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);
      return [...leftRange, DOTS, totalPages];
    }

    // Cas 3: Pas d'ellipses à droite, mais à gauche oui.
    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(totalPages - rightItemCount + 1, totalPages);
      return [firstPageIndex, DOTS, ...rightRange];
    }

    // Cas 4: Ellipses des deux côtés.
    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }

    // Par défaut (ne devrait pas arriver avec les conditions ci-dessus, mais pour la sécurité)
    return range(1, totalPages);
  }, [totalPages, siblingCount, currentPage]);

  return paginationRange;
};