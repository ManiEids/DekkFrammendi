// Tire size constants
export const WIDTHS = Array.from({ length: (335 - 135) / 5 + 1 }, (_, i) => 135 + i * 5);
export const HEIGHTS = Array.from({ length: (85 - 30) / 5 + 1 }, (_, i) => 30 + i * 5);
export const RIM_SIZES = Array.from({ length: (23 - 10) + 1 }, (_, i) => 10 + i);
