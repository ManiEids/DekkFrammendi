// Tire size constants
export const WIDTHS = Array.from({ length: (350 - 135) / 5 + 1 }, (_, i) => 135 + i * 5);
export const HEIGHTS = Array.from({ length: 90 - 10 + 1 }, (_, i) => 10 + i);
export const RIM_SIZES = Array.from({ length: 24 - 10 + 1 }, (_, i) => 10 + i);
