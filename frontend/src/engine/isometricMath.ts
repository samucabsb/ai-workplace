/**
 * Isometric 2.5D Projection Mathematics
 * CortexLab Spatial Engine
 */

export interface Point2D {
  x: number;
  y: number;
}

export interface IsoPoint {
  isoX: number;
  isoY: number;
}

export const DEFAULT_TILE_WIDTH = 120;
export const DEFAULT_TILE_HEIGHT = 60;

/**
 * Converts Cartesian grid coordinates (gridX, gridY) into 2.5D isometric screen coordinates.
 */
export function cartesianToIso(
  gridX: number,
  gridY: number,
  tileWidth: number = DEFAULT_TILE_WIDTH,
  tileHeight: number = DEFAULT_TILE_HEIGHT,
  originX: number = 0,
  originY: number = 0
): IsoPoint {
  const isoX = originX + (gridX - gridY) * (tileWidth / 2);
  const isoY = originY + (gridX + gridY) * (tileHeight / 2);
  return { isoX, isoY };
}

/**
 * Converts screen isometric pixel coordinates back into Cartesian grid coordinates.
 */
export function isoToCartesian(
  screenX: number,
  screenY: number,
  tileWidth: number = DEFAULT_TILE_WIDTH,
  tileHeight: number = DEFAULT_TILE_HEIGHT,
  originX: number = 0,
  originY: number = 0
): Point2D {
  const relativeX = screenX - originX;
  const relativeY = screenY - originY;

  const x = (relativeX / (tileWidth / 2) + relativeY / (tileHeight / 2)) / 2;
  const y = (relativeY / (tileHeight / 2) - relativeX / (tileWidth / 2)) / 2;

  return { x: Math.round(x), y: Math.round(y) };
}

/**
 * Calculates depth sorting z-index based on isometric depth (gridX + gridY).
 */
export function getIsoZIndex(gridX: number, gridY: number, elevation: number = 0): number {
  return Math.floor((gridX + gridY) * 10 + elevation);
}

/**
 * Generates an SVG cubic bezier path string connecting two isometric coordinates.
 */
export function generateConduitSvgPath(
  start: IsoPoint,
  end: IsoPoint,
  curvatureFactor: number = 0.25
): string {
  const midX = (start.isoX + end.isoX) / 2;
  const midY = (start.isoY + end.isoY) / 2;

  // Add subtle arc perpendicular to the conduit vector
  const dx = end.isoX - start.isoX;
  const dy = end.isoY - start.isoY;
  const ctrlX = midX - dy * curvatureFactor;
  const ctrlY = midY + dx * curvatureFactor;

  return `M ${start.isoX} ${start.isoY} Q ${ctrlX} ${ctrlY} ${end.isoX} ${end.isoY}`;
}
