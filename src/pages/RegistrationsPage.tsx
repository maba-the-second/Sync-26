import OrbitImages, { type OrbitCardItem } from '../components/dom/OrbitImages';
import { useAppStore } from '../store/useAppStore';

const ORBIT_CARDS: OrbitCardItem[] = [
  {
    code: 'TRACK // 01',
    title: 'Logo Designing',
    description: 'Craft iconic minimal emblems and scalable brand marks.',
    accentColor: '#FF3B5C',
    accentRgb: '255, 59, 92',
  },
  {
    code: 'TRACK // 02',
    title: 'Poster Designing',
    description: 'Design bold typographic layouts and visual key art.',
    accentColor: '#FF7A2F',
    accentRgb: '255, 122, 47',
  },
  {
    code: 'TRACK // 03',
    title: 'Aspect',
    description: 'Explore creative direction, perspective, and visual craft.',
    accentColor: '#FFD026',
    accentRgb: '255, 208, 38',
  },
  {
    code: 'TRACK // 04',
    title: 'Odyssey',
    description: 'Navigate multi-stage challenges across digital frontiers.',
    accentColor: '#2EE66B',
    accentRgb: '46, 230, 107',
  },
  {
    code: 'TRACK // 05',
    title: 'Game Designing',
    description: 'Build interactive mechanics, playable systems, and worlds.',
    accentColor: '#1AD6FF',
    accentRgb: '26, 214, 255',
  },
  {
    code: 'TRACK // 06',
    title: 'Web Designing',
    description: 'Engineer responsive interfaces and modern web experiences.',
    accentColor: '#3B6EFF',
    accentRgb: '59, 110, 255',
  },
  {
    code: 'TRACK // 07',
    title: 'Algorithm',
    description: 'Solve complex computational problems with optimal logic.',
    accentColor: '#7C4DFF',
    accentRgb: '124, 77, 255',
  },
  {
    code: 'TRACK // 08',
    title: 'Video Editing',
    description: 'Cut, grade, and synchronize high-energy motion stories.',
    accentColor: '#E040FB',
    accentRgb: '224, 64, 251',
  },
];

export function RegistrationsPage() {
  const isHolding = useAppStore((state) => state.isHolding);

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center px-12 sm:px-16 overflow-hidden pointer-events-none">
      <div className="w-full max-w-5xl pointer-events-auto">
        <OrbitImages
          key="crystal-orbit-cards"
          images={ORBIT_CARDS}
          shape="ellipse"
          radiusX={440}
          radiusY={120}
          rotation={-8}
          duration={32}
          speedMultiplier={isHolding ? 4.2 : 1}
          itemSize={140}
          itemWidth={154}
          itemHeight={102}
          itemRadius={10}
          depth={0.65}
          showPath
          pathColor="rgba(65, 210, 162, 0.35)"
          pathWidth={1.5}
        />
      </div>
    </div>
  );
}
