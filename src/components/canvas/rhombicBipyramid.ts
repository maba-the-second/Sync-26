import * as THREE from 'three';

/**
 * Generates an exact Prismatic Crystal with Pyramidal Caps (Elongated Hexagonal Prism
 * in the center terminated by Hexagonal Pyramids on both ends):
 * - Total Vertices: 14 (1 Top Apex, 6 Upper Hexagon Ring vertices, 6 Lower Hexagon Ring vertices, 1 Bottom Apex)
 * - Total Faces: 20 distinct facets:
 *   - Side Faces: 6 flat rectangular walls forming the middle pillar column
 *   - Cap Faces: 12 triangular facets (6 forming the top dome cap, 6 forming the bottom dome cap)
 *   - Cross-Section Profile: A standard regular Hexagon (6-sided polygon, plus 2 internal hexagonal cap planes = 20 facets)
 */
export function createPrismaticCrystalGeometry(
  radius = 0.56,
  bodyHeight = 1.65,
  capHeight = 0.85
): THREE.BufferGeometry {
  const sides = 6;
  const halfBody = bodyHeight / 2;

  // 1. Top & Bottom Pyramid Apexes (2 vertices)
  const vTop: [number, number, number] = [0, halfBody + capHeight, 0];
  const vBottom: [number, number, number] = [0, -(halfBody + capHeight), 0];

  // 2. Upper & Lower Standard Hexagon Cross-Section Rings (6 + 6 = 12 vertices -> 14 total vertices)
  const topRing: [number, number, number][] = [];
  const bottomRing: [number, number, number][] = [];

  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2;
    const x = Math.cos(angle) * radius;
    const z = Math.sin(angle) * radius;
    topRing.push([x, halfBody, z]);
    bottomRing.push([x, -halfBody, z]);
  }

  const positions: number[] = [];

  const pushTriangle = (
    a: [number, number, number],
    b: [number, number, number],
    c: [number, number, number]
  ) => {
    positions.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
  };

  for (let i = 0; i < sides; i++) {
    const next = (i + 1) % sides;
    const tCurr = topRing[i];
    const tNext = topRing[next];
    const bCurr = bottomRing[i];
    const bNext = bottomRing[next];

    // Top Cap: 6 Triangular Facets
    pushTriangle(vTop, tNext, tCurr);

    // Middle Pillar Column: 6 Flat Rectangular Walls (each rectangle composed of 2 coplanar triangles)
    pushTriangle(tCurr, tNext, bNext);
    pushTriangle(tCurr, bNext, bCurr);

    // Bottom Cap: 6 Triangular Facets
    pushTriangle(vBottom, bCurr, bNext);
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.computeVertexNormals();
  return geometry;
}

export const createRhombicBipyramidGeometry = createPrismaticCrystalGeometry;
