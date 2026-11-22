import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type FormEvent } from 'react';
import OrbitImages, { type OrbitCardItem } from '../components/dom/OrbitImages';
import { useAppStore } from '../store/useAppStore';

const WHATSAPP_DIRECT_LINK = 'https://wa.link/05138r';
const WHATSAPP_GROUP_LINK = 'https://chat.whatsapp.com/IaBJyTRhZcACMFKUOrYndg';

interface RubricRow {
  criteria: string;
  weight: string;
}

interface CompetitionTrackOption {
  label: string;
  objective?: string;
  format?: string;
  rules?: string;
  progression?: string;
  deliverables?: string;
  rubricLabel?: string;
  rubric?: RubricRow[];
}

interface CompetitionSections {
  statement?: string[];
  theme?: string[];
  overview?: string[];
  tracks?: CompetitionTrackOption[];
  participation?: string[];
  format?: string[];
  instructions?: string[];
  rules?: string[];
  scoring?: string[];
  rubric?: {
    unitLabel?: string;
    subtitle?: string;
    rows: RubricRow[];
  };
  submission?: string[];
  announcement?: string[];
}

interface CompetitionItem extends OrbitCardItem {
  id: string;
  code: string;
  title: string;
  badge: string;
  category: string;
  eligibility: string;
  shortEligibility: string;
  minGrade: number;
  maxGrade: number;
  isTeam: boolean;
  prefix: string;
  description: string;
  shortDesc: string;
  accentColor: string;
  accentRgb: string;
  sections: CompetitionSections;
}

const COMPETITIONS: CompetitionItem[] = [
  {
    id: 'logo',
    code: "SYNC'26",
    title: 'Logo Design',
    badge: 'BRAND IDENTITY',
    category: 'Identity & Branding',
    eligibility: 'Grades 6–13 • Individual',
    shortEligibility: 'G6–13',
    minGrade: 6,
    maxGrade: 13,
    isTeam: false,
    prefix: 'LGD',
    description: 'Rebrand Spice Lane or craft a startup mark for Orbitly.',
    shortDesc:
      'Choose between Option A (Spice Lane Rebrand) or Option B (Orbitly Startup Logo) and deliver a scalable vector master with a complete presentation board.',
    accentColor: '#FF3B5C',
    accentRgb: '255, 59, 92',
    sections: {
      tracks: [
        {
          label: 'Option A: Spice Lane Rebrand',
          objective:
            'Rebrand "Spice Lane," an established culinary brand expanding into modern global markets.',
          deliverables:
            'Vector master file (.AI or .SVG), Logo Presentation Board (.PDF) including primary mark, secondary mark, color palette, and usage guidelines.',
          rubricLabel: 'Weight',
          rubric: [
            { criteria: 'Concept Originality & Relevance', weight: '30%' },
            { criteria: 'Vector Quality & Scalability', weight: '30%' },
            { criteria: 'Versatility Across Media', weight: '20%' },
            { criteria: 'Presentation & Brand Guidelines', weight: '20%' },
          ],
        },
        {
          label: 'Option B: Orbitly Startup Logo',
          objective:
            'Create a brand mark for "Orbitly," a tech startup focusing on automated cloud workflow management.',
          deliverables:
            'Vector master file (.AI or .SVG) and a monochrome/color application presentation (.PDF).',
          rubricLabel: 'Weight',
          rubric: [
            { criteria: 'Conceptual Clarity & Innovation', weight: '35%' },
            { criteria: 'Scalability & Simplicity', weight: '25%' },
            { criteria: 'Modern Visual Appeal', weight: '20%' },
            { criteria: 'Presentation & Documentation', weight: '20%' },
          ],
        },
      ],
    },
  },
  {
    id: 'poster',
    code: "SYNC'26",
    title: 'Graphic Design',
    badge: 'POSTER & VISUAL ART',
    category: 'Graphic Design',
    eligibility: 'Grades 6–13 • Individual',
    shortEligibility: 'G6–13',
    minGrade: 6,
    maxGrade: 13,
    isTeam: false,
    prefix: 'GRD',
    description: 'Design a villain movie teaser or PulseBand social poster.',
    shortDesc:
      'Choose between Option A (Villain-Led Movie Teaser Poster) or Option B (PulseBand Social Media Poster) and execute print-ready or digital campaign artwork.',
    accentColor: '#FF7A2F',
    accentRgb: '255, 122, 47',
    sections: {
      tracks: [
        {
          label: 'Option A: Villain-Led Movie Teaser Poster',
          objective:
            'Create a teaser poster focused on the primary antagonist of an upcoming fictional film.',
          deliverables:
            'High-resolution print-ready PDF (CMYK, 300 DPI) and digital viewable JPG/PNG (RGB).',
          rubricLabel: 'Weight',
          rubric: [
            { criteria: 'Visual Composition & Layout', weight: '30%' },
            { criteria: 'Typography & Hierarchy', weight: '25%' },
            { criteria: 'Theme Alignment & Atmosphere', weight: '25%' },
            { criteria: 'Technical Execution & Quality', weight: '20%' },
          ],
        },
        {
          label: 'Option B: PulseBand Social Media Poster',
          objective:
            'Design a promotional social media poster for "PulseBand," a next-gen fitness wearable.',
          deliverables: '1080x1350 px (4:5 ratio) PNG/JPG digital export.',
          rubricLabel: 'Weight',
          rubric: [
            { criteria: 'Brand Alignment & Visual Impact', weight: '30%' },
            { criteria: 'Clarity of Information & Call to Action', weight: '25%' },
            { criteria: 'Creative Concept & Asset Integration', weight: '25%' },
            { criteria: 'Technical Precision', weight: '20%' },
          ],
        },
      ],
    },
  },
  {
    id: 'aspect',
    code: "SYNC'26",
    title: 'Aspect',
    badge: 'ESPORTS TOURNAMENT',
    category: 'Esports Arena',
    eligibility: 'Inter-School: Valorant • Intra-School: Call of Duty 4',
    shortEligibility: 'ESPORTS',
    minGrade: 6,
    maxGrade: 13,
    isTeam: false,
    prefix: 'ASP',
    description: 'Compete in Valorant (Inter-School) or Call of Duty 4 (Intra-School).',
    shortDesc:
      'The official SYNC esports tournament featuring 5v5 Valorant for Inter-School brackets and Call of Duty 4 LAN play for Intra-School competitors.',
    accentColor: '#FFD026',
    accentRgb: '255, 208, 38',
    sections: {
      tracks: [
        {
          label: 'Inter-School Tournament: Valorant',
          format:
            '5v5 Competitive Tournament (Single/Double Elimination depending on bracket size).',
          rules:
            'Tournament rules follow standard competitive map pools and match settings. All players must use registered accounts.',
          progression: 'Match wins determine bracket advancement.',
        },
        {
          label: 'Intra-School Tournament: Call of Duty 4',
          format: 'Search & Destroy / Free-For-All local network tournament.',
          rules:
            'Standard competitive mod rules apply. Hardware provided or configured per event setup.',
          progression: 'Stage progression based on round wins and bracket standings.',
        },
      ],
    },
  },
  {
    id: 'odyssey',
    code: "SYNC'26",
    title: 'Odyssey',
    badge: 'IT QUIZ COMPETITION',
    category: 'Team ICT Championship',
    eligibility: 'Inter-School Teams Only • Max 4 Participants',
    shortEligibility: 'TEAM MAX 4',
    minGrade: 10,
    maxGrade: 13,
    isTeam: true,
    prefix: 'ODY',
    description: 'Multi-round inter-school IT quiz culminating live at SYNC’26.',
    shortDesc:
      'Inter-school IT quiz competition progressing through two online rounds to a live stage finale during ICT Day (sync’26).',
    accentColor: '#2EE66B',
    accentRgb: '46, 230, 107',
    sections: {
      participation: [
        'Inter-school teams only. Maximum of 4 participants per team.',
      ],
      format: [
        'Round 1 (Online): General IT knowledge screening quiz (Timed multiple-choice format).',
        'Round 2 (Online): Advanced technical, computational, and history-of-computing online assessment.',
        "Final Round (Live): Stage quiz hosted live during the ICT Day (sync'26) event.",
      ],
      scoring: [
        'Points awarded per correct response with penalty systems active during specific buzzer/rapid-fire stages in the finals.',
      ],
    },
  },
  {
    id: 'gamedesign',
    code: "SYNC'26",
    title: 'Game Designing',
    badge: 'ROGUELIKE / BOSS-RUSH',
    category: 'Game Development',
    eligibility: 'Solo or Teams up to 4 Members',
    shortEligibility: 'SOLO / MAX 4',
    minGrade: 6,
    maxGrade: 13,
    isTeam: false,
    prefix: 'GMD',
    description: 'Build a Roguelike or Boss-Rush game in Tech & Fantasy.',
    shortDesc:
      'Create a Roguelike or Boss-Rush game set in a Technology and Fantasy theme, hosted on itch.io as a Windows executable with a public GitHub repository.',
    accentColor: '#1AD6FF',
    accentRgb: '26, 214, 255',
    sections: {
      participation: ['Solo participants or teams of up to 4 members.'],
      theme: [
        'Create a Roguelike or Boss-Rush game set in a Technology and Fantasy theme.',
      ],
      instructions: [
        'Game Engine: Participants may use any game engine (such as Godot, Unity, or GDevelop).',
        'Asset Policy: Free third-party assets are allowed (with proper attribution); paid assets are strictly prohibited.',
      ],
      submission: [
        'Host the game on itch.io as a downloadable Windows executable (.zip) (do not use the web player option) and provide a public GitHub repository link.',
      ],
      rubric: {
        unitLabel: 'Points',
        subtitle: 'Maximum 100 Points',
        rows: [
          { criteria: 'Gameplay & Genre Mechanics', weight: '35 points' },
          { criteria: 'Theme Integration: Technology & Fantasy', weight: '20 points' },
          { criteria: 'Technical Execution & Build Stability', weight: '20 points' },
          { criteria: 'Visuals, Audio & User Experience', weight: '15 points' },
          { criteria: 'Originality & Polish', weight: '10 points' },
        ],
      },
    },
  },
  {
    id: 'webdev',
    code: "SYNC'26",
    title: 'Web Design',
    badge: 'UI & WEB INTERFACE',
    category: 'Web & UI Design',
    eligibility: 'Grades 6–13 • Individual',
    shortEligibility: 'G6–13',
    minGrade: 6,
    maxGrade: 13,
    isTeam: false,
    prefix: 'WEB',
    description: 'Build a responsive web interface or interactive Figma prototype.',
    shortDesc:
      'Create a responsive, functional, and visually compelling web page or interface based on the prompt provided during the competition window.',
    accentColor: '#3B6EFF',
    accentRgb: '59, 110, 255',
    sections: {
      overview: [
        'Objective: Create a responsive, functional, and visually compelling web page or interface based on the prompt provided during the competition window.',
      ],
      submission: [
        'Deliverables: Source files (HTML/CSS/JS) or Figma design prototype link with interactive components fully configured.',
      ],
      rubric: {
        unitLabel: 'Weight',
        rows: [
          { criteria: 'UI Aesthetics & Visual Polish', weight: '30%' },
          { criteria: 'User Experience & Navigation Logic', weight: '30%' },
          { criteria: 'Responsiveness & Layout Architecture', weight: '20%' },
          { criteria: 'Code Structure / Prototype Functionality', weight: '20%' },
        ],
      },
    },
  },
  {
    id: 'algorithm',
    code: "SYNC'26",
    title: 'Algorithm',
    badge: 'ALGORITHMIC CHALLENGES',
    category: 'Code & Logic',
    eligibility: 'Grades 6–13 • C++ / Python / Java',
    shortEligibility: 'G6–13',
    minGrade: 6,
    maxGrade: 13,
    isTeam: false,
    prefix: 'ALG',
    description: 'Optimize algorithmic challenges for time and space complexity.',
    shortDesc:
      'Solve a series of algorithmic challenges, optimizing for computational efficiency, time complexity, and memory management.',
    accentColor: '#7C4DFF',
    accentRgb: '124, 77, 255',
    sections: {
      overview: [
        'Objective: Solve a series of algorithmic challenges, optimizing for computational efficiency, time complexity, and memory management.',
      ],
      submission: [
        'Deliverables: Code submissions via the designated online judging platform (Supported languages: C++, Python, Java).',
      ],
      rubric: {
        unitLabel: 'Weight',
        rows: [
          { criteria: 'Correctness & Test Case Coverage', weight: '50%' },
          { criteria: 'Time Complexity Optimization', weight: '25%' },
          { criteria: 'Space Complexity Optimization', weight: '15%' },
          { criteria: 'Code Quality & Structure', weight: '10%' },
        ],
      },
    },
  },
  {
    id: 'videoedit',
    code: "SYNC'26",
    title: 'Video Editing',
    badge: 'MOTION & TRAILERS',
    category: 'Visual Storytelling',
    eligibility: 'Grades 6–13 • Individual',
    shortEligibility: 'G6–13',
    minGrade: 6,
    maxGrade: 13,
    isTeam: false,
    prefix: 'VID',
    description: 'Edit a BrightLoop product intro or PulseBand vertical teaser.',
    shortDesc:
      'Choose between Option A (BrightLoop Product Intro Video) or Option B (PulseBand Teaser Video) and submit your final MP4 export with the project archive.',
    accentColor: '#E040FB',
    accentRgb: '224, 64, 251',
    sections: {
      tracks: [
        {
          label: 'Option A: BrightLoop Product Intro Video',
          objective:
            'Edit a dynamic 30-to-60 second product introduction video for "BrightLoop," a smart lighting solution.',
          deliverables: 'MP4 export (1080p, H.264), Project File archive link.',
          rubricLabel: 'Weight',
          rubric: [
            { criteria: 'Pacing & Rhythmic Editing', weight: '30%' },
            { criteria: 'Audio Design & Sound Effects', weight: '25%' },
            { criteria: 'Visual Transitions & Color Grading', weight: '25%' },
            { criteria: 'Overall Engagement & Narrative Flow', weight: '20%' },
          ],
        },
        {
          label: 'Option B: PulseBand Teaser Video',
          objective:
            'Cut a 15-to-30 second high-energy teaser trailer for the upcoming "PulseBand" launch.',
          deliverables:
            'MP4 export (9:16 vertical aspect ratio, 1080x1920), Project File archive.',
          rubricLabel: 'Weight',
          rubric: [
            { criteria: 'Visual Impact & Energy', weight: '35%' },
            { criteria: 'Audio-Visual Syncing', weight: '25%' },
            { criteria: 'Creative Motion Effects', weight: '20%' },
            { criteria: 'Brand Messaging Clarity', weight: '20%' },
          ],
        },
      ],
    },
  },
  {
    id: 'iot',
    code: "SYNC'26",
    title: 'IoT Innovation',
    badge: 'OPEN-THEME IOT',
    category: 'Internet of Things',
    eligibility: 'Individual or Team • Strictly IoT-Based',
    shortEligibility: 'IOT / OPEN',
    minGrade: 6,
    maxGrade: 13,
    isTeam: false,
    prefix: 'IOT',
    description: 'Build an original open-theme Internet of Things innovation.',
    shortDesc:
      'An open-theme premier innovation competition focused strictly on Internet of Things (IoT) solutions with interconnected network capability and data exchange.',
    accentColor: '#41D2A2',
    accentRgb: '65, 210, 162',
    sections: {
      overview: [
        'IoT Innovation is a premier innovation competition focused entirely on the Internet of Things (IoT). The competition operates on an open-theme basis, providing participants with the creative freedom to address any issue across any industry, provided the core solution is strictly IoT-based.',
        'All participants must strictly adhere to the following guidelines regarding project scope, deliverables, originality, and intellectual property.',
      ],
      theme: [
        'Open Theme: Participants are free to identify and solve a problem in any sector (e.g., agriculture, healthcare, smart homes, industrial automation). There are no restrictions on the chosen field.',
        'Mandatory IoT Requirement: The innovation must be fundamentally based on IoT technology. This can be hardware-focused, software-focused, or a hybrid of both, but interconnected network capability and data exchange are mandatory criteria for qualification.',
      ],
      submission: [
        'Each participating individual or team is required to submit exactly two main deliverables for the evaluation process:',
        'Presentation Video (Maximum 10 Minutes): A formal video presentation where the primary innovator presents the product, covering (1) a brief introduction outlining the specific issue or problem at hand, (2) a comprehensive introduction of the proposed IoT solution, and (3) a practical demonstration or detailed explanation of how the innovation functions in real-world scenarios. Overtime submissions will be subject to point deductions.',
        'Project Document (The "Product CV"): A comprehensive technical document detailing the life cycle and architecture of the innovation, including core mechanisms, technical architecture, and system flow; hardware components and software frameworks utilized; and any additional technical specifications, schematics, or relevant background data.',
      ],
      rules: [
        'Originality & Authenticity: The submission must be a genuine, original innovation. Direct copies, replicas, or slightly modified versions of existing market products will result in immediate disqualification.',
        'Patent & Intellectual Property Disclosures: Ensure proper attribution and legal clarity are included in the Project Document.',
      ],
    },
  },
];

interface TeamMember {
  name: string;
  grade: string;
}

function generateConfirmationId(prefix: string) {
  const rand = Math.random().toString(36).substring(2, 7).toUpperCase();
  const time = Date.now().toString(36).slice(-4).toUpperCase();
  return `SYNC-${prefix}-${time}${rand}`;
}

function validateSriLankanPhone(phone: string) {
  const cleaned = phone.replace(/[\s\-()]/g, '');
  return /^(\+94|0094|0)?7[01245678][0-9]{7}$/.test(cleaned);
}

function validateEmail(email: string) {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());
}

interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
  accentColor?: string;
  accentRgb?: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: SelectOption[];
  placeholder?: string;
  accentColor: string;
  accentRgb: string;
  compact?: boolean;
}

function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  accentColor,
  accentRgb,
  compact = false,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState<number>(-1);
  const [openUpward, setOpenUpward] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((o) => o.value === value);

  const toggleOpen = () => {
    if (!isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUpward(spaceBelow < 230 && rect.top > spaceBelow);
    }
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setIsOpen(false);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHoveredIdx((prev) => (prev + 1) % options.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHoveredIdx((prev) => (prev - 1 + options.length) % options.length);
      } else if (e.key === 'Enter' && hoveredIdx >= 0 && hoveredIdx < options.length) {
        e.preventDefault();
        onChange(options[hoveredIdx].value);
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [isOpen, hoveredIdx, options, onChange]);

  return (
    <div ref={containerRef} className="relative font-mono text-xs select-none">
      <button
        type="button"
        onClick={toggleOpen}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`w-full min-h-[44px] sm:min-h-0 flex items-center justify-between gap-2 text-left transition-all cursor-pointer ${compact ? 'px-3 py-2 rounded-lg' : 'px-3.5 py-2.5 rounded-xl'
          } bg-black/85 border text-sm sm:text-xs focus:outline-none`}
        style={{
          borderColor: isOpen
            ? accentColor
            : selectedOption
              ? `rgba(${accentRgb}, 0.5)`
              : 'rgba(255, 255, 255, 0.18)',
          boxShadow: isOpen
            ? `0 0 18px rgba(${accentRgb}, 0.35), inset 0 0 10px rgba(${accentRgb}, 0.12)`
            : 'none',
          background: isOpen
            ? `linear-gradient(135deg, rgba(${accentRgb}, 0.16) 0%, rgba(5, 10, 8, 0.96) 100%)`
            : 'rgba(0, 0, 0, 0.82)',
        }}
      >
        <span className="flex items-center gap-2.5 min-w-0 truncate">
          <span
            className="w-2 h-2 rounded-full shrink-0 transition-transform duration-200"
            style={{
              backgroundColor: selectedOption
                ? selectedOption.accentColor ?? accentColor
                : `rgba(${accentRgb}, 0.45)`,
              boxShadow: selectedOption
                ? `0 0 8px ${selectedOption.accentColor ?? accentColor}`
                : 'none',
              transform: isOpen ? 'scale(1.25)' : 'scale(1)',
            }}
          />
          {selectedOption ? (
            <span className="truncate text-white font-medium">
              {selectedOption.label}
              {selectedOption.sublabel && (
                <span className="text-white/55 font-normal ml-1.5 text-[11px]">
                  ({selectedOption.sublabel})
                </span>
              )}
            </span>
          ) : (
            <span className="truncate text-white/45">{placeholder}</span>
          )}
        </span>

        <svg
          className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
            }`}
          style={{ color: accentColor }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.4}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div
          role="listbox"
          className={`absolute left-0 right-0 z-50 ${openUpward ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
            } rounded-xl bg-[#050a08]/98 backdrop-blur-xl border overflow-hidden`}
          style={{
            borderColor: accentColor,
            boxShadow: `0 16px 40px rgba(0, 0, 0, 0.92), 0 0 26px rgba(${accentRgb}, 0.32)`,
          }}
        >
          <div
            className="h-0.5 w-full"
            style={{
              background: `linear-gradient(90deg, transparent, ${accentColor}, transparent)`,
            }}
          />
          <div className="max-h-56 overflow-y-auto py-1 divide-y divide-white/[0.05]">
            {options.map((opt, idx) => {
              const isSelected = opt.value === value;
              const isHovered = hoveredIdx === idx;
              const itemColor = opt.accentColor ?? accentColor;
              const itemRgb = opt.accentRgb ?? accentRgb;

              return (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(-1)}
                  onClick={() => {
                    onChange(opt.value);
                    setIsOpen(false);
                  }}
                  className="w-full min-h-[44px] sm:min-h-0 px-3.5 py-2.5 text-left flex items-center justify-between gap-2 transition-colors cursor-pointer"
                  style={{
                    backgroundColor: isSelected
                      ? `rgba(${itemRgb}, 0.22)`
                      : isHovered
                        ? `rgba(${itemRgb}, 0.12)`
                        : 'transparent',
                    borderLeft:
                      isSelected || isHovered
                        ? `3px solid ${itemColor}`
                        : '3px solid transparent',
                  }}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{
                        backgroundColor: itemColor,
                        opacity: isSelected || isHovered ? 1 : 0.55,
                        boxShadow:
                          isSelected || isHovered ? `0 0 8px ${itemColor}` : 'none',
                      }}
                    />
                    <div className="truncate">
                      <span
                        className={`text-xs ${isSelected ? 'font-bold text-white' : 'text-white/85'
                          }`}
                        style={isSelected ? { color: itemColor } : undefined}
                      >
                        {opt.label}
                      </span>
                      {opt.sublabel && (
                        <span className="block sm:inline sm:ml-1.5 text-[10px] text-white/50">
                          {opt.sublabel}
                        </span>
                      )}
                    </div>
                  </div>

                  {isSelected && (
                    <span
                      className="text-xs font-bold shrink-0"
                      style={{ color: itemColor }}
                    >
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function RegistrationsPage() {
  const isHolding = useAppStore((state) => state.isHolding);

  // Responsive viewport mode (< 1024px shows shrunk crystal + foreground-arc orbit)
  const [isCompactOrbit, setIsCompactOrbit] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < 1024
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)');
    const update = () => setIsCompactOrbit(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Modals state
  const [detailComp, setDetailComp] = useState<CompetitionItem | null>(null);
  const [isRegOpen, setIsRegOpen] = useState(false);
  const [selectedCompId, setSelectedCompId] = useState<string>('logo');

  // Card-to-modal FLIP expansion refs
  const originRectRef = useRef<DOMRect | null>(null);
  const detailBackdropRef = useRef<HTMLDivElement | null>(null);
  const detailModalRef = useRef<HTMLDivElement | null>(null);
  const isClosingDetailRef = useRef(false);

  // Form fields state
  const [partType, setPartType] = useState<'intra' | 'inter'>('intra');
  const [schoolName, setSchoolName] = useState('Dharmaraja College');
  const [fullName, setFullName] = useState('');
  const [grade, setGrade] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { name: '', grade: '' },
    { name: '', grade: '' },
    { name: '', grade: '' },
  ]);

  // Validation & submission status
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitState, setSubmitState] = useState<'form' | 'loading' | 'success' | 'error'>('form');
  const [confirmationId, setConfirmationId] = useState('');
  const [submittedName, setSubmittedName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const activeComp =
    COMPETITIONS.find((c) => c.id === selectedCompId) ?? COMPETITIONS[0];

  const closeDetailsModal = useCallback((afterClose?: () => void) => {
    if (isClosingDetailRef.current) return;
    const modalEl = detailModalRef.current;
    const backdropEl = detailBackdropRef.current;
    const src = originRectRef.current;

    if (modalEl && src && typeof modalEl.animate === 'function') {
      isClosingDetailRef.current = true;
      const finalRect = modalEl.getBoundingClientRect();
      const dx = src.left + src.width / 2 - (finalRect.left + finalRect.width / 2);
      const dy = src.top + src.height / 2 - (finalRect.top + finalRect.height / 2);
      const sx = Math.max(0.12, src.width / finalRect.width);
      const sy = Math.max(0.12, src.height / finalRect.height);

      backdropEl?.animate([{ opacity: 1 }, { opacity: 0 }], {
        duration: 280,
        easing: 'ease-out',
        fill: 'forwards',
      });

      const anim = modalEl.animate(
        [
          {
            transform: 'translate3d(0px, 0px, 0) scale(1, 1)',
            opacity: 1,
            borderRadius: '16px',
          },
          {
            transform: `translate3d(${dx}px, ${dy}px, 0) scale(${sx}, ${sy})`,
            opacity: 0,
            borderRadius: '22px',
          },
        ],
        {
          duration: 300,
          easing: 'cubic-bezier(0.32, 0, 0.67, 0)',
          fill: 'forwards',
        }
      );

      anim.onfinish = () => {
        isClosingDetailRef.current = false;
        setDetailComp(null);
        afterClose?.();
      };
      return;
    }

    setDetailComp(null);
    afterClose?.();
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (detailComp) {
          closeDetailsModal();
        }
        setIsRegOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [detailComp, closeDetailsModal]);

  useLayoutEffect(() => {
    if (!detailComp) return;
    isClosingDetailRef.current = false;
    const modalEl = detailModalRef.current;
    const backdropEl = detailBackdropRef.current;
    if (!modalEl || typeof modalEl.animate !== 'function') return;

    const finalRect = modalEl.getBoundingClientRect();
    const src = originRectRef.current;

    backdropEl?.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 380,
      easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
      fill: 'both',
    });

    if (src && finalRect.width > 0 && finalRect.height > 0) {
      const dx = src.left + src.width / 2 - (finalRect.left + finalRect.width / 2);
      const dy = src.top + src.height / 2 - (finalRect.top + finalRect.height / 2);
      const sx = Math.max(0.12, src.width / finalRect.width);
      const sy = Math.max(0.12, src.height / finalRect.height);

      modalEl.animate(
        [
          {
            transform: `translate3d(${dx}px, ${dy}px, 0) scale(${sx}, ${sy})`,
            opacity: 0.6,
            borderRadius: '22px',
          },
          {
            transform: 'translate3d(0px, 0px, 0) scale(1, 1)',
            opacity: 1,
            borderRadius: '16px',
          },
        ],
        {
          duration: 480,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          fill: 'both',
        }
      );
    } else {
      modalEl.animate(
        [
          { transform: 'scale(0.86)', opacity: 0 },
          { transform: 'scale(1)', opacity: 1 },
        ],
        {
          duration: 360,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          fill: 'both',
        }
      );
    }
  }, [detailComp]);

  const openDetailsModal = (index: number, rect?: DOMRect) => {
    const comp = COMPETITIONS[index];
    if (comp) {
      originRectRef.current = rect ?? null;
      setDetailComp(comp);
    }
  };

  const openRegistrationModal = (compId?: string) => {
    const targetId = compId ?? selectedCompId;
    setSelectedCompId(targetId);
    setGrade('');
    setTeamName('');
    setErrors({});
    setSubmitState('form');
    setIsRegOpen(true);
  };

  const handlePartTypeChange = (val: 'intra' | 'inter') => {
    setPartType(val);
    if (val === 'intra') {
      setSchoolName('Dharmaraja College');
    } else if (schoolName === 'Dharmaraja College') {
      setSchoolName('');
    }
  };

  const handleAddMember = () => {
    if (teamMembers.length < 3) {
      setTeamMembers((prev) => [...prev, { name: '', grade: '' }]);
    }
  };

  const handleRemoveMember = () => {
    if (teamMembers.length > 1) {
      setTeamMembers((prev) => prev.slice(0, -1));
    }
  };

  const handleMemberChange = (idx: number, field: keyof TeamMember, value: string) => {
    setTeamMembers((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, [field]: value } : m))
    );
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    const trimmedSchool = schoolName.trim();
    if (!trimmedSchool) {
      newErrors.school = 'School name is required.';
    } else if (partType === 'intra' && !/dharmaraja/i.test(trimmedSchool)) {
      newErrors.school = 'Intra-School participation is restricted to Dharmaraja College.';
    }

    if (activeComp.isTeam) {
      if (!teamName || (teamName !== 'Team A' && teamName !== 'Team B')) {
        newErrors.teamName = 'Please select Team A or Team B.';
      }
      if (fullName.trim().length < 2) {
        newErrors.fullName = "Captain's full name is required.";
      }
      const gNum = parseInt(grade, 10);
      if (!grade || isNaN(gNum) || gNum < 10 || gNum > 13) {
        newErrors.grade = 'Team competition is strictly for Grades 10–13.';
      }
      if (!validateEmail(email)) {
        newErrors.email = 'Valid email address is required.';
      }
      if (!validateSriLankanPhone(phone)) {
        newErrors.phone = 'Valid Sri Lankan contact number is required (e.g. 0714906145).';
      }
      teamMembers.forEach((m, idx) => {
        if (m.name.trim().length < 2) {
          newErrors[`member_${idx}_name`] = `Member #${idx + 1} name is required.`;
        }
        const mg = parseInt(m.grade, 10);
        if (!m.grade || isNaN(mg) || mg < 10 || mg > 13) {
          newErrors[`member_${idx}_grade`] = 'Must be Grade 10–13.';
        }
      });
    } else {
      if (fullName.trim().length < 2) {
        newErrors.fullName = 'Full name must be at least 2 characters.';
      }
      const gNum = parseInt(grade, 10);
      if (
        !grade ||
        isNaN(gNum) ||
        gNum < activeComp.minGrade ||
        gNum > activeComp.maxGrade
      ) {
        newErrors.grade = `Please select a valid grade (${activeComp.minGrade}–${activeComp.maxGrade}).`;
      }
      if (!validateEmail(email)) {
        newErrors.email = 'Please enter a valid email address.';
      }
      if (!validateSriLankanPhone(phone)) {
        newErrors.phone = 'Please enter a valid Sri Lankan mobile number (e.g. 0714906145).';
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setSubmitState('loading');

    const confId = generateConfirmationId(activeComp.prefix);
    const payload = {
      confirmationId: confId,
      competitionId: activeComp.id,
      competitionName: activeComp.title,
      participationType: partType,
      schoolName: trimmedSchool,
      fullName: fullName.trim(),
      grade,
      email: email.trim(),
      contactNumber: phone.trim(),
      teamName: activeComp.isTeam ? teamName.trim() : undefined,
      teamMembers: activeComp.isTeam ? teamMembers : undefined,
      timestamp: new Date().toISOString(),
    };

    try {
      await new Promise((r) => setTimeout(r, 650));
      const existing = JSON.parse(
        localStorage.getItem('SYNC_REGISTRATIONS_STORE') || '[]'
      );
      existing.push(payload);
      localStorage.setItem('SYNC_REGISTRATIONS_STORE', JSON.stringify(existing));

      setConfirmationId(confId);
      setSubmittedName(fullName.trim());
      setSubmitState('success');
    } catch (err) {
      setErrorMessage(
        err instanceof Error
          ? err.message
          : 'Unable to record registration. Please retry or contact coordinator.'
      );
      setSubmitState('error');
    }
  };

  const gradeOptions: number[] = [];
  for (let g = activeComp.minGrade; g <= activeComp.maxGrade; g++) {
    gradeOptions.push(g);
  }

  return (
    <div className="relative w-full h-screen h-[100dvh] flex flex-col items-center justify-center pt-12 pb-0 pl-11 pr-0 sm:pl-12 sm:pr-0 md:pt-14 md:pl-16 md:pr-6 lg:pt-12 lg:pb-0 lg:pl-[calc(3.5rem+4rem)] lg:pr-16 overflow-hidden pointer-events-none">
      {/* Mobile HUD Header (underneath z-50 modals) */}
      <div
        aria-hidden="true"
        className="md:hidden pointer-events-none absolute top-[58px] left-14 sm:left-16 right-[124px] z-10 flex flex-col gap-1 font-mono uppercase tracking-[0.2em]"
      >
        <div className="border-l-2 border-mint-leaf/60 pl-2">
          <div className="font-ethnocentric text-[10px] sm:text-[11px] leading-tight text-white/90 tracking-wider">
            COMPETITIONS
          </div>
          <div className="text-[8px] tracking-[0.14em] text-white/45 mt-0.5">
            SELECT CARD TO REGISTER
          </div>
        </div>
      </div>

      {/* Top Action Bar inside Registrations Arena */}
      <div className="absolute top-[58px] md:top-16 md:mt-4 right-3 sm:right-4 md:right-10 z-30 flex flex-wrap items-center gap-2.5 pointer-events-auto font-mono">
        <a
          href="./pdf/Sync Competition Rulebook.pdf"
          download="Sync Competition Rulebook.pdf"
          aria-label="Download Rule Book"
          className="group min-h-[40px] lg:min-h-0 inline-flex items-center justify-center px-3 py-2 lg:px-2.5 lg:py-2.5 lg:hover:px-3.5 rounded-lg bg-mint-leaf text-black font-bold hover:bg-white shadow-[0_0_20px_rgba(65,210,162,0.4)] transition-all duration-300 ease-out overflow-hidden cursor-pointer"
        >
          <svg
            className="w-4 h-4 shrink-0 transition-transform duration-300 ease-out"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.4}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V3"
            />
          </svg>
          <span className="ml-2 text-[10px] tracking-[0.14em] whitespace-nowrap uppercase lg:max-w-0 lg:opacity-0 lg:ml-0 lg:translate-x-2 lg:group-hover:max-w-[180px] lg:group-hover:opacity-100 lg:group-hover:ml-2 lg:group-hover:translate-x-0 overflow-hidden lg:tracking-[0.16em] transition-all duration-300 ease-out">
            <span className="lg:hidden">Rule Book</span>
            <span className="hidden lg:inline">Download Rule Book</span>
          </span>
        </a>
      </div>

      {/* Floating WhatsApp Community Icon (Bottom-Right)
      <a
        href={WHATSAPP_GROUP_LINK}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Join WhatsApp Community"
        title="Join WhatsApp Community"
        className="fixed bottom-3 right-3 sm:bottom-4 sm:right-4 md:bottom-8 md:right-10 z-30 pointer-events-auto flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-black/80 backdrop-blur-md border border-mint-leaf/50 hover:border-mint-leaf hover:scale-110 shadow-[0_0_20px_rgba(65,210,162,0.35)] transition-all duration-300"
      >
        <img
          src="./images/whatsapp.png"
          alt="Join WhatsApp Community"
          className="w-8 h-8 sm:w-9 sm:h-9 object-contain"
          draggable={false}
        />
      </a> */}

      {/* 8 Competition Cards Orbiting the 3D Crystal (Full 3D Tilted Ring on Mobile/Tablet & Desktop) */}
      {isCompactOrbit ? (
        <div className="relative w-full flex flex-col items-center pointer-events-auto">
          <div className="w-full flex justify-center overflow-x-clip">
            <div className="w-[130%] max-w-[540px] md:w-full md:max-w-[600px] shrink-0">
              <OrbitImages
                key="crystal-orbit-cards-mobile"
                className="orbit-compact"
                images={COMPETITIONS.map((c) => ({
                  ...c,
                  description: undefined,
                  eligibility: c.shortEligibility,
                }))}
                shape="ellipse"
                baseWidth={640}
                radiusX={276}
                radiusY={92}
                rotation={-8}
                duration={34}
                paused={!!detailComp || isRegOpen}
                speedMultiplier={isHolding ? 4.2 : 1}
                itemSize={86}
                itemWidth={92}
                itemHeight={104}
                itemRadius={8}
                depth={0.68}
                tilt3d={26}
                backOcclusion={{
                  fadeOutStart: 0.86,
                  fadeOutEnd: 0.64,
                  fadeInStart: 0.74,
                  fadeInEnd: 0.95,
                  backDepthRamp: 0.08,
                }}
                hoverScale={1.03}
                showPath
                pathColor="rgba(65, 210, 162, 0.38)"
                pathWidth={1.5}
                clickToFront
                onItemClick={(idx, _src, rect) => openDetailsModal(idx, rect)}
                onRegister={(idx, rect) => openDetailsModal(idx, rect)}
              />
            </div>
          </div>
          <div className="absolute top-full mt-3 px-3 py-1 rounded-full border border-white/15 bg-black/60 backdrop-blur-sm font-mono text-[9px] tracking-[0.2em] text-white/60 uppercase whitespace-nowrap">
            SWIPE TO ORBIT <span className="text-mint-leaf">//</span> TAP CARD TO INSPECT
          </div>
        </div>
      ) : (
        <div className="w-full max-w-5xl pointer-events-auto">
          <OrbitImages
            key="crystal-orbit-cards-v2"
            images={COMPETITIONS.map((c) => ({
              ...c,
              eligibility: c.shortEligibility,
            }))}
            shape="ellipse"
            radiusX={450}
            radiusY={125}
            rotation={-8}
            duration={34}
            paused={!!detailComp || isRegOpen}
            speedMultiplier={isHolding ? 4.2 : 1}
            itemSize={150}
            itemWidth={176}
            itemHeight={122}
            itemRadius={10}
            depth={0.65}
            showPath
            pathColor="rgba(65, 210, 162, 0.35)"
            pathWidth={1.5}
            clickToFront
            onItemClick={(idx, _src, rect) => openDetailsModal(idx, rect)}
            onRegister={(idx, rect) => openDetailsModal(idx, rect)}
          />
        </div>
      )}

      {/* =====================================================================
          COMPETITION DETAILS MODAL (Ported from Sync_2026)
      ===================================================================== */}
      {detailComp && (
        <div
          ref={detailBackdropRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md pointer-events-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDetailsModal();
          }}
        >
          <div
            ref={detailModalRef}
            className="sync-modal-frame w-full max-w-3xl max-h-[88dvh] flex flex-col rounded-2xl shadow-2xl origin-center will-change-transform"
            style={
              {
                '--card-accent': detailComp.accentColor,
                '--card-rgb': detailComp.accentRgb,
                boxShadow: `0 0 45px rgba(${detailComp.accentRgb}, 0.25)`,
              } as CSSProperties
            }
          >
            <div className="sync-modal-inner max-h-[calc(88dvh-3px)]">
              {/* Modal Header */}
              <div
                className="p-4 sm:p-6 border-b border-white/10 flex items-start justify-between gap-3 sm:gap-4"
                style={{
                  background: `linear-gradient(135deg, rgba(${detailComp.accentRgb}, 0.22) 0%, rgba(6, 12, 10, 0.95) 70%)`,
                }}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5 font-mono text-[10px] tracking-[0.18em] sm:tracking-[0.2em] uppercase">
                    <span
                      className="px-2.5 py-0.5 rounded-full border font-semibold"
                      style={{
                        color: detailComp.accentColor,
                        borderColor: `rgba(${detailComp.accentRgb}, 0.45)`,
                        backgroundColor: `rgba(${detailComp.accentRgb}, 0.12)`,
                      }}
                    >
                      {detailComp.badge}
                    </span>
                    <span className="text-white/60">• {detailComp.eligibility}</span>
                  </div>
                  <h3 className="font-ethnocentric text-base sm:text-2xl text-white tracking-wider uppercase break-words">
                    {detailComp.title}
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => closeDetailsModal()}
                  className="min-w-[40px] min-h-[40px] flex items-center justify-center p-2 rounded-lg bg-white/5 border border-white/15 text-white/70 hover:text-white hover:border-white/40 transition-colors cursor-pointer shrink-0"
                  aria-label="Close modal"
                >
                  ✕
                </button>
              </div>

              {/* Modal Scrollable Body */}
              <div data-lenis-prevent className="p-4 sm:p-6 overflow-y-auto overscroll-contain flex-1 min-h-0 space-y-5 font-mono text-xs text-white/85">
                <p className="text-white/90 text-xs sm:text-sm leading-relaxed border-l-2 pl-3" style={{ borderColor: detailComp.accentColor }}>
                  {detailComp.shortDesc}
                </p>

                {detailComp.sections.statement && (
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                    <h4
                      className="font-mono font-bold text-xs tracking-[0.2em] uppercase"
                      style={{ color: detailComp.accentColor }}
                    >
                      Challenge Statement
                    </h4>
                    {detailComp.sections.statement.map((s, i) => (
                      <p key={i} className="leading-relaxed text-white/80">
                        {s}
                      </p>
                    ))}
                  </div>
                )}

                {detailComp.sections.theme && (
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                    <h4
                      className="font-mono font-bold text-xs tracking-[0.2em] uppercase"
                      style={{ color: detailComp.accentColor }}
                    >
                      Theme & Aesthetic Vision
                    </h4>
                    {detailComp.sections.theme.map((t, i) => (
                      <p key={i} className="leading-relaxed text-white/80">
                        {t}
                      </p>
                    ))}
                  </div>
                )}

                {detailComp.sections.overview && (
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                    <h4
                      className="font-mono font-bold text-xs tracking-[0.2em] uppercase"
                      style={{ color: detailComp.accentColor }}
                    >
                      Overview
                    </h4>
                    {detailComp.sections.overview.map((o, i) => (
                      <p key={i} className="leading-relaxed text-white/80">
                        {o}
                      </p>
                    ))}
                  </div>
                )}

                {detailComp.sections.tracks && (
                  <div className="space-y-4">
                    {detailComp.sections.tracks.map((track, tIdx) => (
                      <div
                        key={tIdx}
                        className="p-4 rounded-xl bg-white/[0.03] border border-white/10 space-y-3"
                      >
                        <h4
                          className="font-mono font-bold text-xs sm:text-sm tracking-[0.14em] uppercase"
                          style={{ color: detailComp.accentColor }}
                        >
                          {track.label}
                        </h4>

                        <ul className="space-y-2">
                          {track.objective && (
                            <li className="flex items-start gap-2.5 text-white/80">
                              <span
                                className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                                style={{ backgroundColor: detailComp.accentColor }}
                              />
                              <span>
                                <strong className="text-white">Objective:</strong> {track.objective}
                              </span>
                            </li>
                          )}
                          {track.format && (
                            <li className="flex items-start gap-2.5 text-white/80">
                              <span
                                className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                                style={{ backgroundColor: detailComp.accentColor }}
                              />
                              <span>
                                <strong className="text-white">Format:</strong> {track.format}
                              </span>
                            </li>
                          )}
                          {track.rules && (
                            <li className="flex items-start gap-2.5 text-white/80">
                              <span
                                className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                                style={{ backgroundColor: detailComp.accentColor }}
                              />
                              <span>
                                <strong className="text-white">Rules:</strong> {track.rules}
                              </span>
                            </li>
                          )}
                          {track.progression && (
                            <li className="flex items-start gap-2.5 text-white/80">
                              <span
                                className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                                style={{ backgroundColor: detailComp.accentColor }}
                              />
                              <span>
                                <strong className="text-white">Scoring / Progression:</strong>{' '}
                                {track.progression}
                              </span>
                            </li>
                          )}
                          {track.deliverables && (
                            <li className="flex items-start gap-2.5 text-white/80">
                              <span
                                className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                                style={{ backgroundColor: detailComp.accentColor }}
                              />
                              <span>
                                <strong className="text-white">Deliverables:</strong>{' '}
                                {track.deliverables}
                              </span>
                            </li>
                          )}
                        </ul>

                        {track.rubric && track.rubric.length > 0 && (
                          <div className="pt-2">
                            <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/60 mb-2">
                              Scoring Rubric
                            </div>
                            <div className="rounded-lg border border-white/10 overflow-hidden">
                              <div className="grid grid-cols-[1fr_auto] gap-3 px-3 py-2 bg-white/[0.04] border-b border-white/10 text-[10px] font-bold uppercase tracking-wider text-white/75">
                                <span>Evaluation Criteria</span>
                                <span className="text-right">{track.rubricLabel ?? 'Weight'}</span>
                              </div>
                              {track.rubric.map((row, rIdx) => (
                                <div
                                  key={rIdx}
                                  className="grid grid-cols-[1fr_auto] gap-3 px-3 py-2 border-b last:border-b-0 border-white/[0.06] text-xs text-white/80"
                                >
                                  <span>{row.criteria}</span>
                                  <span
                                    className="font-bold text-right shrink-0"
                                    style={{ color: detailComp.accentColor }}
                                  >
                                    {row.weight}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {detailComp.sections.participation && (
                  <div>
                    <h4
                      className="font-mono font-bold text-xs tracking-[0.2em] uppercase mb-2.5"
                      style={{ color: detailComp.accentColor }}
                    >
                      Participation & Eligibility
                    </h4>
                    <ul className="space-y-1.5">
                      {detailComp.sections.participation.map((p, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-white/80">
                          <span
                            className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                            style={{ backgroundColor: detailComp.accentColor }}
                          />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {detailComp.sections.format && (
                  <div>
                    <h4
                      className="font-mono font-bold text-xs tracking-[0.2em] uppercase mb-2.5"
                      style={{ color: detailComp.accentColor }}
                    >
                      Competition Format
                    </h4>
                    <ul className="space-y-1.5">
                      {detailComp.sections.format.map((f, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-white/80">
                          <span
                            className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                            style={{ backgroundColor: detailComp.accentColor }}
                          />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {detailComp.sections.instructions && (
                  <div>
                    <h4
                      className="font-mono font-bold text-xs tracking-[0.2em] uppercase mb-2.5"
                      style={{ color: detailComp.accentColor }}
                    >
                      Instructions & Technical Guidelines
                    </h4>
                    <ul className="space-y-1.5">
                      {detailComp.sections.instructions.map((ins, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-white/80">
                          <span
                            className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                            style={{ backgroundColor: detailComp.accentColor }}
                          />
                          <span>{ins}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {detailComp.sections.rules && (
                  <div>
                    <h4
                      className="font-mono font-bold text-xs tracking-[0.2em] uppercase mb-2.5"
                      style={{ color: detailComp.accentColor }}
                    >
                      Official Rules
                    </h4>
                    <ul className="space-y-1.5">
                      {detailComp.sections.rules.map((r, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-white/80">
                          <span
                            className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                            style={{ backgroundColor: detailComp.accentColor }}
                          />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {detailComp.sections.scoring && (
                  <div>
                    <h4
                      className="font-mono font-bold text-xs tracking-[0.2em] uppercase mb-2.5"
                      style={{ color: detailComp.accentColor }}
                    >
                      Evaluation & Scoring Criteria
                    </h4>
                    <ul className="space-y-1.5">
                      {detailComp.sections.scoring.map((s, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-white/80">
                          <span
                            className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                            style={{ backgroundColor: detailComp.accentColor }}
                          />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {detailComp.sections.rubric && (
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
                      <h4
                        className="font-mono font-bold text-xs tracking-[0.2em] uppercase"
                        style={{ color: detailComp.accentColor }}
                      >
                        Scoring Rubric
                      </h4>
                      {detailComp.sections.rubric.subtitle && (
                        <span className="text-[10px] uppercase tracking-wider text-white/60">
                          {detailComp.sections.rubric.subtitle}
                        </span>
                      )}
                    </div>
                    <div className="rounded-xl border border-white/10 overflow-hidden bg-white/[0.02]">
                      <div className="grid grid-cols-[1fr_auto] gap-3 px-3.5 py-2.5 bg-white/[0.04] border-b border-white/10 text-[10px] font-bold uppercase tracking-wider text-white/75">
                        <span>Evaluation Criteria</span>
                        <span className="text-right">
                          {detailComp.sections.rubric.unitLabel ?? 'Weight'}
                        </span>
                      </div>
                      {detailComp.sections.rubric.rows.map((row, rIdx) => (
                        <div
                          key={rIdx}
                          className="grid grid-cols-[1fr_auto] gap-3 px-3.5 py-2.5 border-b last:border-b-0 border-white/[0.06] text-xs text-white/80"
                        >
                          <span>{row.criteria}</span>
                          <span
                            className="font-bold text-right shrink-0"
                            style={{ color: detailComp.accentColor }}
                          >
                            {row.weight}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {detailComp.sections.submission && (
                  <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10">
                    <h4
                      className="font-mono font-bold text-xs tracking-[0.2em] uppercase mb-2"
                      style={{ color: detailComp.accentColor }}
                    >
                      Submission Protocol
                    </h4>
                    <ul className="space-y-1.5 font-mono text-xs">
                      {detailComp.sections.submission.map((sub, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-white/80">
                          <span
                            className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                            style={{ backgroundColor: detailComp.accentColor }}
                          />
                          <span>{sub}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {detailComp.sections.announcement && (
                  <div className="p-4 rounded-xl bg-white/[0.04] border border-white/15 space-y-1.5">
                    <h4
                      className="font-mono font-bold text-xs tracking-[0.2em] uppercase"
                      style={{ color: detailComp.accentColor }}
                    >
                      Official Tournament Announcement
                    </h4>
                    {detailComp.sections.announcement.map((a, i) => (
                      <p key={i} className="leading-relaxed text-white/80">
                        {a}
                      </p>
                    ))}
                  </div>
                )}
              </div>

              {/* Modal Footer CTAs */}
              <div className="p-4 sm:p-5 border-t border-white/10 bg-black/80 flex flex-col-reverse sm:flex-row sm:flex-wrap items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 font-mono">
                <a
                  href={WHATSAPP_DIRECT_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-h-[44px] inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white hover:border-mint-leaf hover:text-mint-leaf text-xs uppercase tracking-wider transition-all"
                >
                  <span>Ask via WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={() => {
                    const id = detailComp.id;
                    closeDetailsModal(() => openRegistrationModal(id));
                  }}
                  className="min-h-[44px] inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-black transition-all cursor-pointer"
                  style={{
                    backgroundColor: detailComp.accentColor,
                    boxShadow: `0 0 20px rgba(${detailComp.accentRgb}, 0.45)`,
                  }}
                >
                  <span>REGISTER FOR THIS COMPETITION &rarr;</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          REGISTRATION FORM MODAL (Ported from Sync_2026)
      ===================================================================== */}
      {isRegOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md pointer-events-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsRegOpen(false);
          }}
        >
          <div
            className="sync-modal-frame w-full max-w-2xl max-h-[90dvh] flex flex-col rounded-2xl shadow-2xl"
            style={
              {
                '--card-accent': activeComp.accentColor,
                '--card-rgb': activeComp.accentRgb,
                boxShadow: `0 0 50px rgba(${activeComp.accentRgb}, 0.25)`,
              } as CSSProperties
            }
          >
            <div className="sync-modal-inner max-h-[calc(90dvh-3px)]">
              {/* Header */}
              <div
                className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between gap-3"
                style={{
                  background: `linear-gradient(135deg, rgba(${activeComp.accentRgb}, 0.22) 0%, rgba(6, 12, 10, 0.95) 70%)`,
                }}
              >
                <div className="min-w-0">
                  <h3 className="font-ethnocentric text-sm sm:text-xl text-white uppercase tracking-wider break-words">
                    REGISTER FOR {activeComp.title}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setIsRegOpen(false)}
                  className="min-w-[40px] min-h-[40px] flex items-center justify-center p-2 rounded-lg bg-white/5 border border-white/15 text-white/70 hover:text-white hover:border-white/40 transition-colors cursor-pointer shrink-0"
                  aria-label="Close registration modal"
                >
                  ✕
                </button>
              </div>

              {/* Form State */}
              {submitState === 'form' && (
                <form
                  onSubmit={handleFormSubmit}
                  data-lenis-prevent
                  className="p-4 sm:p-6 overflow-y-auto overscroll-contain flex-1 min-h-0 space-y-4 font-mono text-xs"
                >
                  {/* Competition Selector (Only the 8 Sync-26 Competitions) */}
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-white/70 mb-1.5">
                      Selected Competition <span style={{ color: activeComp.accentColor }}>*</span>
                    </label>
                    <CustomSelect
                      value={selectedCompId}
                      onChange={(val) => {
                        setSelectedCompId(val);
                        setGrade('');
                        setErrors({});
                      }}
                      options={COMPETITIONS.map((c) => ({
                        value: c.id,
                        label: c.title,
                        sublabel: `${c.category} • ${c.eligibility}`,
                        accentColor: c.accentColor,
                        accentRgb: c.accentRgb,
                      }))}
                      accentColor={activeComp.accentColor}
                      accentRgb={activeComp.accentRgb}
                    />
                  </div>

                  {/* Participation Type & School Name */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-white/70 mb-1.5">
                        Participation Type <span style={{ color: activeComp.accentColor }}>*</span>
                      </label>
                      <CustomSelect
                        value={partType}
                        onChange={(val) =>
                          handlePartTypeChange(val as 'intra' | 'inter')
                        }
                        options={[
                          {
                            value: 'intra',
                            label: 'Intra-School',
                            sublabel: 'Dharmaraja College',
                          },
                          {
                            value: 'inter',
                            label: 'Inter-School',
                            sublabel: 'Other School',
                          },
                        ]}
                        accentColor={activeComp.accentColor}
                        accentRgb={activeComp.accentRgb}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] uppercase tracking-wider text-white/70 mb-1.5">
                        School Name <span style={{ color: activeComp.accentColor }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={schoolName}
                        readOnly={partType === 'intra'}
                        onChange={(e) => setSchoolName(e.target.value)}
                        placeholder="Enter your school name"
                        className={`w-full min-h-[44px] sm:min-h-0 px-3.5 py-2.5 rounded-xl bg-black/80 border border-white/15 text-white text-base sm:text-xs focus:outline-none focus:border-mint-leaf ${partType === 'intra' ? 'opacity-75 cursor-not-allowed' : ''
                          }`}
                      />
                      {errors.school && (
                        <p className="text-[11px] text-red-400 mt-1">{errors.school}</p>
                      )}
                    </div>
                  </div>

                  {/* Individual vs Team Fields */}
                  {!activeComp.isTeam ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-white/70 mb-1.5">
                            Full Name <span style={{ color: activeComp.accentColor }}>*</span>
                          </label>
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="e.g. Mihin Rukshan"
                            className="w-full min-h-[44px] sm:min-h-0 px-3.5 py-2.5 rounded-xl bg-black/80 border border-white/15 text-white text-base sm:text-xs focus:outline-none focus:border-mint-leaf"
                          />
                          {errors.fullName && (
                            <p className="text-[11px] text-red-400 mt-1">{errors.fullName}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-white/70 mb-1.5">
                            Grade / Class{' '}
                            <span style={{ color: activeComp.accentColor }}>
                              * (Grades {activeComp.minGrade}–{activeComp.maxGrade})
                            </span>
                          </label>
                          <CustomSelect
                            value={grade}
                            onChange={(val) => setGrade(val)}
                            placeholder="Select Grade"
                            options={gradeOptions.map((g) => ({
                              value: String(g),
                              label: `Grade ${g}`,
                            }))}
                            accentColor={activeComp.accentColor}
                            accentRgb={activeComp.accentRgb}
                          />
                          {errors.grade && (
                            <p className="text-[11px] text-red-400 mt-1">{errors.grade}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-white/70 mb-1.5">
                            Email Address <span style={{ color: activeComp.accentColor }}>*</span>
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="participant@example.com"
                            className="w-full min-h-[44px] sm:min-h-0 px-3.5 py-2.5 rounded-xl bg-black/80 border border-white/15 text-white text-base sm:text-xs focus:outline-none focus:border-mint-leaf"
                          />
                          {errors.email && (
                            <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-white/70 mb-1.5">
                            WhatsApp / Contact Number{' '}
                            <span style={{ color: activeComp.accentColor }}>*</span>
                          </label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="0714906145 or +94 71 490 6145"
                            className="w-full min-h-[44px] sm:min-h-0 px-3.5 py-2.5 rounded-xl bg-black/80 border border-white/15 text-white text-base sm:text-xs focus:outline-none focus:border-mint-leaf"
                          />
                          {errors.phone && (
                            <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div
                        className="p-3 rounded-xl border text-[11px] leading-relaxed"
                        style={{
                          borderColor: `rgba(${activeComp.accentRgb}, 0.4)`,
                          backgroundColor: `rgba(${activeComp.accentRgb}, 0.1)`,
                          color: activeComp.accentColor,
                        }}
                      >
                        Team rule: Inter-school teams only. Strictly Grades 10–13. All members from the same school. Maximum 4 participants per team (including Captain).
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-white/70 mb-1.5">
                            Team <span style={{ color: activeComp.accentColor }}>*</span>
                          </label>
                          <CustomSelect
                            value={teamName}
                            onChange={(val) => setTeamName(val)}
                            placeholder="Select Team (Team A / Team B)"
                            options={[
                              { value: 'Team A', label: 'Team A' },
                              { value: 'Team B', label: 'Team B' },
                            ]}
                            accentColor={activeComp.accentColor}
                            accentRgb={activeComp.accentRgb}
                          />
                          {errors.teamName && (
                            <p className="text-[11px] text-red-400 mt-1">{errors.teamName}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-white/70 mb-1.5">
                            Team Captain's Full Name{' '}
                            <span style={{ color: activeComp.accentColor }}>*</span>
                          </label>
                          <input
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Captain's Full Name"
                            className="w-full min-h-[44px] sm:min-h-0 px-3.5 py-2.5 rounded-xl bg-black/80 border border-white/15 text-white text-base sm:text-xs focus:outline-none focus:border-mint-leaf"
                          />
                          {errors.fullName && (
                            <p className="text-[11px] text-red-400 mt-1">{errors.fullName}</p>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-white/70 mb-1.5">
                            Captain's Grade{' '}
                            <span style={{ color: activeComp.accentColor }}>* (10–13)</span>
                          </label>
                          <CustomSelect
                            value={grade}
                            onChange={(val) => setGrade(val)}
                            placeholder="Select Grade"
                            options={[10, 11, 12, 13].map((g) => ({
                              value: String(g),
                              label: `Grade ${g}`,
                            }))}
                            accentColor={activeComp.accentColor}
                            accentRgb={activeComp.accentRgb}
                          />
                          {errors.grade && (
                            <p className="text-[11px] text-red-400 mt-1">{errors.grade}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-white/70 mb-1.5">
                            Captain's Email{' '}
                            <span style={{ color: activeComp.accentColor }}>*</span>
                          </label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="captain@school.lk"
                            className="w-full min-h-[44px] sm:min-h-0 px-3.5 py-2.5 rounded-xl bg-black/80 border border-white/15 text-white text-base sm:text-xs focus:outline-none focus:border-mint-leaf"
                          />
                          {errors.email && (
                            <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-[10px] uppercase tracking-wider text-white/70 mb-1.5">
                            Captain's Phone{' '}
                            <span style={{ color: activeComp.accentColor }}>*</span>
                          </label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="0714906145"
                            className="w-full min-h-[44px] sm:min-h-0 px-3.5 py-2.5 rounded-xl bg-black/80 border border-white/15 text-white text-base sm:text-xs focus:outline-none focus:border-mint-leaf"
                          />
                          {errors.phone && (
                            <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>
                          )}
                        </div>
                      </div>

                      {/* Additional Team Members */}
                      <div className="pt-3 border-t border-white/10 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span
                            className="text-[11px] font-bold uppercase tracking-wider"
                            style={{ color: activeComp.accentColor }}
                          >
                            Additional Team Members (Up to 3 more)
                          </span>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={handleAddMember}
                              className="min-h-[36px] sm:min-h-0 px-3 py-1.5 sm:px-2.5 sm:py-1 rounded bg-white/5 border border-white/20 text-white hover:border-mint-leaf hover:text-mint-leaf text-[10px] cursor-pointer"
                            >
                              + Add Member
                            </button>
                            <button
                              type="button"
                              onClick={handleRemoveMember}
                              className="min-h-[36px] sm:min-h-0 px-3 py-1.5 sm:px-2.5 sm:py-1 rounded bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white text-[10px] cursor-pointer"
                            >
                              - Remove
                            </button>
                          </div>
                        </div>

                        {teamMembers.map((member, idx) => (
                          <div
                            key={idx}
                            className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/10"
                          >
                            <div className="sm:col-span-2">
                              <label className="block text-[10px] text-white/60 mb-1">
                                Member #{idx + 1} Full Name *
                              </label>
                              <input
                                type="text"
                                value={member.name}
                                onChange={(e) =>
                                  handleMemberChange(idx, 'name', e.target.value)
                                }
                                placeholder={`Member #${idx + 1} Name`}
                                className="w-full min-h-[44px] sm:min-h-0 px-3 py-2 rounded-lg bg-black/80 border border-white/15 text-white text-base sm:text-xs focus:outline-none focus:border-mint-leaf"
                              />
                              {errors[`member_${idx}_name`] && (
                                <p className="text-[10px] text-red-400 mt-0.5">
                                  {errors[`member_${idx}_name`]}
                                </p>
                              )}
                            </div>
                            <div>
                              <label className="block text-[10px] text-white/60 mb-1">
                                Grade * (10–13)
                              </label>
                              <CustomSelect
                                value={member.grade}
                                onChange={(val) =>
                                  handleMemberChange(idx, 'grade', val)
                                }
                                placeholder="Select Grade"
                                options={[10, 11, 12, 13].map((g) => ({
                                  value: String(g),
                                  label: `Grade ${g}`,
                                }))}
                                accentColor={activeComp.accentColor}
                                accentRgb={activeComp.accentRgb}
                                compact
                              />
                              {errors[`member_${idx}_grade`] && (
                                <p className="text-[10px] text-red-400 mt-0.5">
                                  {errors[`member_${idx}_grade`]}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {/* Form Actions */}
                  <div className="pt-4 border-t border-white/10 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => setIsRegOpen(false)}
                      className="min-h-[44px] sm:min-h-0 px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white/75 hover:text-white text-xs uppercase cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="min-h-[44px] sm:min-h-0 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-black transition-all cursor-pointer"
                      style={{
                        backgroundColor: activeComp.accentColor,
                        boxShadow: `0 0 20px rgba(${activeComp.accentRgb}, 0.45)`,
                      }}
                    >
                      SUBMIT REGISTRATION &rarr;
                    </button>
                  </div>
                </form>
              )}

              {/* Loading State */}
              {submitState === 'loading' && (
                <div className="p-12 text-center space-y-4 font-mono">
                  <div
                    className="w-12 h-12 mx-auto rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: activeComp.accentColor, borderTopColor: 'transparent' }}
                  />
                  <h4 className="font-ethnocentric text-sm sm:text-base text-white uppercase tracking-wider">
                    SUBMITTING REGISTRATION
                  </h4>
                  <p className="text-xs text-white/60">
                    Validating eligibility and recording registration...
                  </p>
                </div>
              )}

              {/* Success State */}
              {submitState === 'success' && (
                <div className="p-6 sm:p-10 overflow-y-auto overscroll-contain flex-1 min-h-0 text-center space-y-5 font-mono">
                  <div
                    className="w-14 h-14 mx-auto rounded-full border-2 flex items-center justify-center text-xl font-bold"
                    style={{
                      borderColor: activeComp.accentColor,
                      color: activeComp.accentColor,
                      boxShadow: `0 0 25px rgba(${activeComp.accentRgb}, 0.4)`,
                    }}
                  >
                    ✓
                  </div>
                  <div>
                    <h3
                      className="font-ethnocentric text-base sm:text-2xl uppercase tracking-wider mb-2"
                      style={{ color: activeComp.accentColor }}
                    >
                      REGISTRATION SUCCESSFUL
                    </h3>
                    <p className="text-white text-sm">
                      Thank you, <span className="font-bold">{submittedName}</span>!
                    </p>
                    <p className="text-white/65 text-xs mt-1">
                      Your registration for{' '}
                      <span className="text-white font-semibold">{activeComp.title}</span> has been received and verified.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-black/70 border border-white/15 inline-block max-w-full">
                    <div className="text-[10px] text-white/50 uppercase tracking-widest mb-1">
                      OFFICIAL CONFIRMATION ID
                    </div>
                    <div
                      className="font-bold text-base sm:text-lg tracking-wider break-all"
                      style={{ color: activeComp.accentColor }}
                    >
                      {confirmationId}
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <p className="text-xs text-white/65 max-w-md mx-auto">
                      Please join the official WhatsApp community to receive tournament updates, problem statements, and schedules:
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <a
                        href={WHATSAPP_GROUP_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="min-h-[44px] inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-black transition-all"
                        style={{
                          backgroundColor: activeComp.accentColor,
                          boxShadow: `0 0 20px rgba(${activeComp.accentRgb}, 0.45)`,
                        }}
                      >
                        JOIN WHATSAPP GROUP
                      </a>
                      <button
                        type="button"
                        onClick={() => setIsRegOpen(false)}
                        className="min-h-[44px] inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white hover:border-white/40 text-xs uppercase cursor-pointer"
                      >
                        CLOSE
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Error State */}
              {submitState === 'error' && (
                <div className="p-6 sm:p-10 overflow-y-auto overscroll-contain flex-1 min-h-0 text-center space-y-4 font-mono">
                  <h4 className="font-ethnocentric text-base sm:text-lg text-red-400 uppercase">
                    SUBMISSION ERROR
                  </h4>
                  <p className="text-xs text-white/75 max-w-md mx-auto">{errorMessage}</p>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSubmitState('form')}
                      className="min-h-[44px] inline-flex items-center justify-center px-4 py-2 rounded-xl bg-mint-leaf text-black font-bold text-xs uppercase cursor-pointer"
                    >
                      RETRY SUBMISSION
                    </button>
                    <a
                      href={WHATSAPP_DIRECT_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-h-[44px] inline-flex items-center justify-center px-4 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs uppercase"
                    >
                      CONTACT COORDINATOR
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
