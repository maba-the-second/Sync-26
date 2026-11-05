import { useCallback, useEffect, useLayoutEffect, useRef, useState, type FormEvent } from 'react';
import OrbitImages, { type OrbitCardItem } from '../components/dom/OrbitImages';
import { useAppStore } from '../store/useAppStore';

const WHATSAPP_DIRECT_LINK = 'https://wa.link/05138r';
const WHATSAPP_GROUP_LINK = 'https://chat.whatsapp.com/IaBJyTRhZcACMFKUOrYndg';

interface CompetitionSections {
  statement?: string[];
  theme?: string[];
  overview?: string[];
  participation?: string[];
  format?: string[];
  instructions?: string[];
  rules?: string[];
  scoring?: string[];
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
    code: 'TRACK // 01',
    title: 'Logo Designing',
    badge: 'FUTURISTIC IDENTITY',
    category: 'Identity & Branding',
    eligibility: 'Grades 6–13 • Individual Only',
    shortEligibility: 'G6–13',
    minGrade: 6,
    maxGrade: 13,
    isTeam: false,
    prefix: 'LGD',
    description: 'Craft iconic minimal emblems and scalable brand marks.',
    shortDesc:
      'Create a memorable, futuristic identity that communicates innovation, digital transformation, and creative thinking.',
    accentColor: '#FF3B5C',
    accentRgb: '255, 59, 92',
    sections: {
      overview: [
        'Participants should design a futuristic, tech-inspired logo that embodies the spirit of innovation, digital transformation, and boundary-breaking creativity, suitable for a future-tech event.',
      ],
      participation: [
        'Students from Grade 6–13 of Dharmaraja College and other schools are eligible.',
        'Individual participation only; no team submissions. Each participant may submit only one entry.',
      ],
      instructions: [
        'Logos must be created digitally using professional design tools such as Adobe Illustrator, Photoshop, Figma, or equivalent.',
        'Submissions must include both a full-color version and a simplified monochrome version.',
        'The design should be scalable, usable on small digital icons and large posters.',
        'All work must be original; plagiarism and stock logo templates lead to disqualification.',
        'A short design note must accompany the logo, explaining the inspiration and concept.',
      ],
      scoring: [
        'Concept & Relevance: Aligning with future-tech vision.',
        'Creativity: Freshness, innovative symbolism, and uniqueness.',
        'Simplicity & Memorability: Clear and distinctive across contexts.',
        'Versatility: Scalability, monochrome, and print adaptability.',
        'Visual Impact: Professional balance and aesthetic poise.',
      ],
      submission: [
        'Export logo in .png and .jpg formats (both color & monochrome versions).',
        'Include short concept note text.',
        'Naming format: Logo_SchoolName_YourName.rar (Example: Logo_RoyalCollege_MihinRukshan.rar).',
        "Upload Google Drive public link via the SYNC '26 portal.",
      ],
    },
  },
  {
    id: 'poster',
    code: 'TRACK // 02',
    title: 'Poster Designing',
    badge: 'HAPPENING NOW',
    category: 'Graphic Design',
    eligibility: 'Grades 6–13 • Individual Only',
    shortEligibility: 'G6–13',
    minGrade: 6,
    maxGrade: 13,
    isTeam: false,
    prefix: 'PST',
    description: 'Design bold typographic layouts and visual key art.',
    shortDesc:
      'Create a futuristic promotional poster that feels like an event happening in real time.',
    accentColor: '#FF7A2F',
    accentRgb: '255, 122, 47',
    sections: {
      theme: [
        "Theme: 'Happening Now: A Futuristic Call to SYNC '26'",
        "Create a bold, futuristic graphic poster that captures the essence of the event in a 'happening now' style.",
        "Posters should reflect the dynamic energy, digital aesthetic, and innovative spirit of SYNC '26.",
        "The best submission may be featured as part of the official announcement of SYNC '26 on the main event day!",
      ],
      participation: [
        'Students from Grade 6–13 of Dharmaraja College and other schools are eligible to participate.',
        'Individual entries only; team participation is not permitted.',
        'Schools may send any number of participants. Registration must be completed by deadline.',
        'Each participant is limited to one poster submission.',
      ],
      instructions: [
        'Participants may use Adobe Photoshop, Illustrator, or any professional graphic design software.',
        "Designs must represent a 'Happening Now' SYNC '26 poster concept.",
        'Submissions must be original; plagiarism or use of stock templates will lead to disqualification.',
        'Standard poster dimensions recommended (A3 or A4 portrait), but creative layouts are valued.',
      ],
      scoring: [
        'Concept & Relevance (Capturing futuristic digital theme).',
        'Creativity (Originality and innovative approach).',
        'Visual Appeal (Composition, color, and lighting effects).',
        'Technical Skill (Use of design tools, layers, techniques).',
        'Audience Impact (Communicative visual energy).',
      ],
      submission: [
        'Poster file: Export final design in .png or .jpg format.',
        'Editable source file: Submit the working file (.psd, .ai, or equivalent) with all layers intact.',
        'File naming format: Poster_SchoolName_YourName.rar (Example: Poster_RoyalCollege_MihinRukshan.rar).',
        "Upload Google Drive link with public access via the official SYNC '26 website before deadline.",
      ],
    },
  },
  {
    id: 'aspect',
    code: 'TRACK // 03',
    title: 'Aspect',
    badge: 'CALL OF DUTY 3',
    category: 'Esports Arena',
    eligibility: 'Grades 6–13 • Competitive Gaming',
    shortEligibility: 'G6–13',
    minGrade: 6,
    maxGrade: 13,
    isTeam: false,
    prefix: 'ASP',
    description: 'Explore tactical esports warfare in Call of Duty 3.',
    shortDesc:
      'The premier esports battleground featuring Call of Duty 3. Tactical combat, reflex coordination, and competitive cyber warfare.',
    accentColor: '#FFD026',
    accentRgb: '255, 208, 38',
    sections: {
      overview: [
        'ASPECT is the official gaming championship of SYNC ’26, hosted by Dharmaraja College ICT Society.',
        'Official tournament game title: Call of Duty 3.',
        'Experience fast-paced tactical competition with professional tournament oversight.',
      ],
      announcement: [
        "Tournament rules, bracket structure, match rotation, schedule, and prize distribution will be officially announced through the SYNC '26 event channels and WhatsApp community.",
        'Stay connected via the official WhatsApp group for bracket releases and platform guidelines.',
      ],
      participation: [
        'Open to school students Grade 6–13.',
        'Players must register via the official form to reserve their bracket allocation.',
        'Join the official WhatsApp group for scrim updates, lobby codes, and coordinator briefings.',
      ],
    },
  },
  {
    id: 'odyssey',
    code: 'TRACK // 04',
    title: 'Odyssey',
    badge: 'KNOWLEDGE ARENA',
    category: 'Team ICT Championship',
    eligibility: 'Grades 10–13 • Teams Only (Max 5)',
    shortEligibility: 'TEAM 10–13',
    minGrade: 10,
    maxGrade: 13,
    isTeam: true,
    prefix: 'ODY',
    description: 'Navigate multi-stage ICT challenges across digital frontiers.',
    shortDesc:
      'Premier team-based ICT championship spanning fundamentals, emerging technologies, logic, and digital ethics.',
    accentColor: '#2EE66B',
    accentRgb: '46, 230, 107',
    sections: {
      overview: [
        'Tests students on a wide range of ICT topics: fundamentals, emerging tech, digital ethics, programming logic, and industry trends.',
        "Conducted in two online rounds followed by a final physical round at SYNC '26.",
      ],
      participation: [
        'Students of Grades 10–13 from schools across Sri Lanka.',
        'Teams only. No individual or mixed-school entries allowed.',
        'A maximum of 5 members per team, all from the same school.',
        'Strict limit of TWO teams per school.',
        'Registration must be completed by the specified deadline.',
      ],
      format: [
        "Round 1 — Online Preliminary: Hosted via official SYNC '26 portal with Zoom breakout rooms. MCQs & short-answer challenges. Top 8 teams advance.",
        'Round 2 — Online Semifinal: Advanced MCQs & scenario reasoning in breakout rooms. Top 2 teams advance to the Physical Final.',
        "Final Round — Physical at SYNC '26 Main Event: Onsite championship stage covering A/L & O/L ICT syllabus, programming logic, and tech innovation with live interactive scoring.",
      ],
      rules: [
        'All team members must keep functioning cameras and microphones on throughout online rounds.',
        'Team communication is permitted ONLY between registered members within assigned Zoom breakout rooms.',
        'Any form of cheating or external assistance results in immediate disqualification.',
        'Preset time limit per question; answers submitted after expiration are rejected.',
      ],
    },
  },
  {
    id: 'gamedesign',
    code: 'TRACK // 05',
    title: 'Game Designing',
    badge: 'INTERACTIVE WORLDS',
    category: 'Game Development',
    eligibility: 'Grades 6–13 • Individual Only',
    shortEligibility: 'G6–13',
    minGrade: 6,
    maxGrade: 13,
    isTeam: false,
    prefix: 'GMD',
    description: 'Build interactive mechanics, playable systems, and worlds.',
    shortDesc:
      'Engineer an original playable game experience featuring engaging mechanics, futuristic world-building, and responsive controls.',
    accentColor: '#1AD6FF',
    accentRgb: '26, 214, 255',
    sections: {
      theme: [
        "Theme: 'Beyond the Digital Frontier: Cybernetic Odyssey'",
        'Create an original 2D or 3D playable game that explores futuristic mechanics, digital realms, or sci-fi problem solving.',
      ],
      participation: [
        'Students from Grade 6–13 of Dharmaraja College and other schools are eligible to participate.',
        'Individual participation only; team entries are not permitted.',
        'All core game logic and level design must be the original work of the participant.',
      ],
      instructions: [
        'Participants may use Unity, Unreal Engine, Godot, Scratch, or HTML5/WebGL game frameworks.',
        'The submission must include a playable build (Windows executable or WebGL build) along with source project files.',
        'Include a brief README document explaining controls, game objectives, and engines/tools used.',
      ],
      scoring: [
        'Gameplay & Mechanics: Responsiveness, fun factor, and level design.',
        'Creativity & Theme Alignment: Originality and adherence to the futuristic theme.',
        'Visuals & Audio Polish: Atmosphere, UI clarity, and sound design.',
        'Technical Execution: Stability, performance, and clean implementation.',
      ],
      submission: [
        'Package the playable build and project source files into a .rar or .zip archive.',
        'Naming format: Game_SchoolName_YourName.rar.',
        "Upload the Google Drive link with public access via the official SYNC '26 portal before the deadline.",
      ],
    },
  },
  {
    id: 'webdev',
    code: 'TRACK // 06',
    title: 'Web Designing',
    badge: 'COMMAND CENTER CHALLENGE',
    category: 'Full-Stack & Web',
    eligibility: 'Grades 6–13 • Individual Only',
    shortEligibility: 'G6–13',
    minGrade: 6,
    maxGrade: 13,
    isTeam: false,
    prefix: 'WEB',
    description: 'Engineer responsive interfaces and modern web experiences.',
    shortDesc:
      'Design and develop an innovative digital platform that solves a practical problem through functionality, creativity, and excellent user experience.',
    accentColor: '#3B6EFF',
    accentRgb: '59, 110, 255',
    sections: {
      statement: [
        'With dozens of events happening across the year—debates, sports meets, exhibitions—the administration is struggling to keep everyone updated. Bob is tasked with building a digital command center for all school events: a place where students, teachers, and parents can stay informed and engaged.',
        'Key capabilities: Announcements and event pages; Interactive calendars and countdowns; Online registrations and ticketing; Optional live event updates or highlights.',
        'Challenge: Creating a scalable, interactive system that can handle multiple events smoothly with a clean user experience.',
      ],
      participation: [
        'Students from Grade 6–13 of Dharmaraja College and other schools are eligible to participate.',
        'Individual participation only—team entries are not accepted.',
        'Registration for the competition must be completed by the specified deadline.',
        'All submissions must represent original work. Copying existing solutions or plagiarizing content will result in disqualification.',
      ],
      instructions: [
        'Participants are required to develop a fully functional web application.',
        'Solutions may include interactive interfaces (web, desktop, or GUI), data processing, and visual outputs.',
        'Participants are free to use any suitable programming environment (HTML/CSS/JS, React, Angular, Vue.js, etc.).',
        'The final web application must be hosted online, using platforms such as GitHub Pages, Netlify, Vercel, or similar services.',
        'A README.md file must accompany the project repository documenting project purpose, technologies used, and step-by-step instructions to run.',
      ],
      scoring: [
        'Functionality: Does the application perform all required tasks correctly and efficiently?',
        'Design & User Experience: How intuitive, engaging, and visually appealing is the interface?',
        'Creativity & Innovation: Does the solution demonstrate original ideas, unique features, or creative approaches?',
        'Code Structure & Quality: Is the code clean, organized, and maintainable?',
        'Adding backend functionality, such as databases or APIs, will be considered a bonus and can improve scoring.',
        'Multiple submissions are not allowed. Only the first submitted version will be evaluated.',
      ],
      submission: [
        "Submit a public GitHub repository link containing the project code through the official SYNC '26 website before the deadline.",
        'Provide a hosted link to the live web application.',
        'Ensure all links are accessible and fully functional before the deadline. Modifications after the deadline will not be considered.',
      ],
    },
  },
  {
    id: 'algorithm',
    code: 'TRACK // 07',
    title: 'Algorithm',
    badge: 'ALGORITHMIC THINKING',
    category: 'Code & Logic',
    eligibility: 'Grades 6–13 • Individual Only',
    shortEligibility: 'G6–13',
    minGrade: 6,
    maxGrade: 13,
    isTeam: false,
    prefix: 'ALG',
    description: 'Solve complex computational problems with optimal logic.',
    shortDesc:
      'Challenge your programming logic, analytical thinking, and problem-solving ability through a competitive online algorithmic programming experience.',
    accentColor: '#7C4DFF',
    accentRgb: '124, 77, 255',
    sections: {
      participation: [
        'Open to students from Grade 6–13 of Dharmaraja College and other schools.',
        'Individual participation only. Team entries are not permitted.',
        'Registration for the competition must be completed before the announced deadline.',
        "All solutions must be the participant's own work. Code plagiarism, sharing solutions, or copying another participant's work will result in immediate disqualification.",
      ],
      format: [
        'Hosted online through the HackerRank platform.',
        'Five algorithmic problems will be released simultaneously.',
        'Each problem carries 100 points, for a total of 500 points.',
        'Participants will have four hours to solve as many problems as possible.',
        'Submissions are accepted in C++, Python, Java, or JavaScript.',
        'Multiple attempts may be submitted for each problem.',
        'This is a single-round competition.',
        "Final date, time, HackerRank link, and other details will be communicated through the official SYNC '26 channels and WhatsApp group.",
      ],
      scoring: [
        'Partial scoring will be available based on successfully passed test cases/subtasks.',
        'For multiple attempts, only the highest-scoring submission for that problem will count.',
        'There is no penalty for incorrect submissions.',
        'The total score across all 5 problems will decide the rankings of each contestant.',
        'In the event of a tie, the participant who achieved their final total score earliest will rank higher.',
        'The decisions of the judging panel will be final.',
      ],
      submission: [
        'All solutions must be submitted directly through HackerRank before the competition closes.',
        "No separate submission through the SYNC '26 website is required.",
      ],
    },
  },
  {
    id: 'videoedit',
    code: 'TRACK // 08',
    title: 'Video Editing',
    badge: 'MOTION & CINEMA',
    category: 'Visual Storytelling',
    eligibility: 'Grades 6–13 • Individual Only',
    shortEligibility: 'G6–13',
    minGrade: 6,
    maxGrade: 13,
    isTeam: false,
    prefix: 'VID',
    description: 'Cut, grade, and synchronize high-energy motion stories.',
    shortDesc:
      'Craft a high-impact futuristic motion sequence combining precision rhythmic editing, sound design, visual effects, and color grading.',
    accentColor: '#E040FB',
    accentRgb: '224, 64, 251',
    sections: {
      theme: [
        "Theme: 'The Pulse of SYNC '26: Future in Motion'",
        'Produce a 60 to 120 second futuristic showreel, trailer, or cinematic edit that embodies digital velocity and cybernetic storytelling.',
      ],
      participation: [
        'Students from Grade 6–13 of Dharmaraja College and other schools are eligible to participate.',
        'Individual participation only; team entries are not permitted.',
        'Each participant may submit only one final video entry.',
      ],
      instructions: [
        'Participants may use Adobe Premiere Pro, After Effects, DaVinci Resolve, Final Cut Pro, or equivalent professional non-linear editors.',
        'Output resolution must be at least 1080p (1920×1080) at 24/30/60 fps in .mp4 (H.264) format.',
        'Include timeline screenshots demonstrating layer structure, cuts, and grading nodes/effects.',
      ],
      scoring: [
        'Pacing & Rhythmic Sync: Precision of cuts, transitions, and audio synchronization.',
        'Visual Effects & Color Grading: Atmosphere, motion graphics, and tonal consistency.',
        'Storytelling & Impact: Emotional and visual engagement.',
        'Technical Quality: Render clarity, sound mixing, and workflow organization.',
      ],
      submission: [
        'Include the final .mp4 video and project timeline screenshots inside a .rar archive.',
        'Naming format: Video_SchoolName_YourName.rar.',
        "Upload the Google Drive link with public access via the official SYNC '26 portal before the deadline.",
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

export function RegistrationsPage() {
  const isHolding = useAppStore((state) => state.isHolding);

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
    if (teamMembers.length < 4) {
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
      if (teamName.trim().length < 2) {
        newErrors.teamName = 'Team name is required (min 2 characters).';
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
    <div className="relative w-full h-screen flex flex-col items-center justify-center px-12 sm:px-16 overflow-hidden pointer-events-none">
      {/* Top Action Bar inside Registrations Arena */}
      <div className="absolute top-16 right-6 sm:right-10 z-30 flex flex-wrap items-center gap-2.5 pointer-events-auto font-mono">
        <a
          href={WHATSAPP_GROUP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-black/75 backdrop-blur-md border border-mint-leaf/40 text-mint-leaf hover:bg-mint-leaf hover:text-black text-[10px] tracking-[0.16em] uppercase transition-all"
        >
          <span>JOIN WHATSAPP COMMUNITY</span>
        </a>
        <button
          type="button"
          onClick={() => openRegistrationModal(selectedCompId)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-mint-leaf text-black font-bold hover:bg-white text-[10px] tracking-[0.18em] uppercase shadow-[0_0_20px_rgba(65,210,162,0.4)] transition-all cursor-pointer"
        >
          <span>REGISTER NOW</span>
        </button>
      </div>

      {/* 8 Rainbow Competition Cards Orbiting the 3D Crystal */}
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
          onRegister={(idx) => {
            const comp = COMPETITIONS[idx];
            if (comp) openRegistrationModal(comp.id);
          }}
        />
      </div>

      {/* =====================================================================
          COMPETITION DETAILS MODAL (Ported from Sync_2026)
      ===================================================================== */}
      {detailComp && (
        <div
          ref={detailBackdropRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md pointer-events-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDetailsModal();
          }}
        >
          <div
            ref={detailModalRef}
            className="w-full max-w-3xl max-h-[86vh] flex flex-col rounded-2xl bg-[#060c0a]/95 border overflow-hidden shadow-2xl origin-center will-change-transform"
            style={{
              borderColor: detailComp.accentColor,
              boxShadow: `0 0 45px rgba(${detailComp.accentRgb}, 0.25)`,
            }}
          >
            {/* Modal Header */}
            <div
              className="p-5 sm:p-6 border-b border-white/10 flex items-start justify-between gap-4"
              style={{
                background: `linear-gradient(135deg, rgba(${detailComp.accentRgb}, 0.22) 0%, rgba(6, 12, 10, 0.95) 70%)`,
              }}
            >
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1.5 font-mono text-[10px] tracking-[0.2em] uppercase">
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
                <h3 className="font-ethnocentric text-lg sm:text-2xl text-white tracking-wider uppercase">
                  {detailComp.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => closeDetailsModal()}
                className="p-2 rounded-lg bg-white/5 border border-white/15 text-white/70 hover:text-white hover:border-white/40 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 font-whyte text-xs sm:text-sm text-white/85">
              <p className="text-white/90 text-sm leading-relaxed border-l-2 pl-3" style={{ borderColor: detailComp.accentColor }}>
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
            <div className="p-4 sm:p-5 border-t border-white/10 bg-black/80 flex flex-wrap items-center justify-between gap-3 font-mono">
              <a
                href={WHATSAPP_DIRECT_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white hover:border-mint-leaf hover:text-mint-leaf text-xs uppercase tracking-wider transition-all"
              >
                <span>Ask via WhatsApp</span>
              </a>

              <button
                type="button"
                onClick={() => {
                  const id = detailComp.id;
                  closeDetailsModal(() => openRegistrationModal(id));
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-black transition-all cursor-pointer"
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
      )}

      {/* =====================================================================
          REGISTRATION FORM MODAL (Ported from Sync_2026)
      ===================================================================== */}
      {isRegOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md pointer-events-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsRegOpen(false);
          }}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl bg-[#060c0a]/95 border overflow-hidden shadow-2xl"
            style={{
              borderColor: activeComp.accentColor,
              boxShadow: `0 0 50px rgba(${activeComp.accentRgb}, 0.25)`,
            }}
          >
            {/* Header */}
            <div
              className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between"
              style={{
                background: `linear-gradient(135deg, rgba(${activeComp.accentRgb}, 0.22) 0%, rgba(6, 12, 10, 0.95) 70%)`,
              }}
            >
              <div>
                <span
                  className="text-[10px] font-mono uppercase tracking-[0.22em] block mb-1"
                  style={{ color: activeComp.accentColor }}
                >
                  OFFICIAL APPLICATION // {activeComp.code}
                </span>
                <h3 className="font-ethnocentric text-base sm:text-xl text-white uppercase tracking-wider">
                  REGISTER FOR {activeComp.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsRegOpen(false)}
                className="p-2 rounded-lg bg-white/5 border border-white/15 text-white/70 hover:text-white hover:border-white/40 transition-colors cursor-pointer"
                aria-label="Close registration modal"
              >
                ✕
              </button>
            </div>

            {/* Form State */}
            {submitState === 'form' && (
              <form
                onSubmit={handleFormSubmit}
                className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4 font-mono text-xs"
              >
                {/* Competition Selector (Only the 8 Sync-26 Competitions) */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-white/70 mb-1.5">
                    Selected Competition <span style={{ color: activeComp.accentColor }}>*</span>
                  </label>
                  <select
                    value={selectedCompId}
                    onChange={(e) => {
                      setSelectedCompId(e.target.value);
                      setGrade('');
                      setErrors({});
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-black/80 border border-white/15 text-white text-xs focus:outline-none focus:border-mint-leaf"
                  >
                    {COMPETITIONS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} ({c.category} • {c.eligibility})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Participation Type & School Name */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider text-white/70 mb-1.5">
                      Participation Type <span style={{ color: activeComp.accentColor }}>*</span>
                    </label>
                    <select
                      value={partType}
                      onChange={(e) =>
                        handlePartTypeChange(e.target.value as 'intra' | 'inter')
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl bg-black/80 border border-white/15 text-white text-xs focus:outline-none focus:border-mint-leaf"
                    >
                      <option value="intra">Intra-School — Dharmaraja College</option>
                      <option value="inter">Inter-School — Other School</option>
                    </select>
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
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-black/80 border border-white/15 text-white text-xs focus:outline-none focus:border-mint-leaf ${
                        partType === 'intra' ? 'opacity-75 cursor-not-allowed' : ''
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
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/80 border border-white/15 text-white text-xs focus:outline-none focus:border-mint-leaf"
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
                        <select
                          value={grade}
                          onChange={(e) => setGrade(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/80 border border-white/15 text-white text-xs focus:outline-none focus:border-mint-leaf"
                        >
                          <option value="">Select Grade</option>
                          {gradeOptions.map((g) => (
                            <option key={g} value={String(g)}>
                              Grade {g}
                            </option>
                          ))}
                        </select>
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
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/80 border border-white/15 text-white text-xs focus:outline-none focus:border-mint-leaf"
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
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/80 border border-white/15 text-white text-xs focus:outline-none focus:border-mint-leaf"
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
                      Team rule: Strictly Grades 10–13 only. All members from the same school. Max 5 members total (including Captain). Max 2 teams per school.
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-white/70 mb-1.5">
                          Team Name <span style={{ color: activeComp.accentColor }}>*</span>
                        </label>
                        <input
                          type="text"
                          value={teamName}
                          onChange={(e) => setTeamName(e.target.value)}
                          placeholder="e.g. CyberKnights"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/80 border border-white/15 text-white text-xs focus:outline-none focus:border-mint-leaf"
                        />
                        {errors.teamName && (
                          <p className="text-[11px] text-red-400 mt-1">{errors.teamName}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-white/70 mb-1.5">
                          Team Captain&apos;s Full Name{' '}
                          <span style={{ color: activeComp.accentColor }}>*</span>
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Captain's Full Name"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/80 border border-white/15 text-white text-xs focus:outline-none focus:border-mint-leaf"
                        />
                        {errors.fullName && (
                          <p className="text-[11px] text-red-400 mt-1">{errors.fullName}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-white/70 mb-1.5">
                          Captain&apos;s Grade{' '}
                          <span style={{ color: activeComp.accentColor }}>* (10–13)</span>
                        </label>
                        <select
                          value={grade}
                          onChange={(e) => setGrade(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/80 border border-white/15 text-white text-xs focus:outline-none focus:border-mint-leaf"
                        >
                          <option value="">Select Grade</option>
                          {[10, 11, 12, 13].map((g) => (
                            <option key={g} value={String(g)}>
                              Grade {g}
                            </option>
                          ))}
                        </select>
                        {errors.grade && (
                          <p className="text-[11px] text-red-400 mt-1">{errors.grade}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-white/70 mb-1.5">
                          Captain&apos;s Email{' '}
                          <span style={{ color: activeComp.accentColor }}>*</span>
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="captain@school.lk"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/80 border border-white/15 text-white text-xs focus:outline-none focus:border-mint-leaf"
                        />
                        {errors.email && (
                          <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-[10px] uppercase tracking-wider text-white/70 mb-1.5">
                          Captain&apos;s Phone{' '}
                          <span style={{ color: activeComp.accentColor }}>*</span>
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="0714906145"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-black/80 border border-white/15 text-white text-xs focus:outline-none focus:border-mint-leaf"
                        />
                        {errors.phone && (
                          <p className="text-[11px] text-red-400 mt-1">{errors.phone}</p>
                        )}
                      </div>
                    </div>

                    {/* Additional Team Members */}
                    <div className="pt-3 border-t border-white/10 space-y-3">
                      <div className="flex items-center justify-between">
                        <span
                          className="text-[11px] font-bold uppercase tracking-wider"
                          style={{ color: activeComp.accentColor }}
                        >
                          Additional Team Members (Up to 4 more)
                        </span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleAddMember}
                            className="px-2.5 py-1 rounded bg-white/5 border border-white/20 text-white hover:border-mint-leaf hover:text-mint-leaf text-[10px] cursor-pointer"
                          >
                            + Add Member
                          </button>
                          <button
                            type="button"
                            onClick={handleRemoveMember}
                            className="px-2.5 py-1 rounded bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white text-[10px] cursor-pointer"
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
                              className="w-full px-3 py-2 rounded-lg bg-black/80 border border-white/15 text-white text-xs focus:outline-none focus:border-mint-leaf"
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
                            <select
                              value={member.grade}
                              onChange={(e) =>
                                handleMemberChange(idx, 'grade', e.target.value)
                              }
                              className="w-full px-3 py-2 rounded-lg bg-black/80 border border-white/15 text-white text-xs focus:outline-none focus:border-mint-leaf"
                            >
                              <option value="">Select Grade</option>
                              {[10, 11, 12, 13].map((g) => (
                                <option key={g} value={String(g)}>
                                  Grade {g}
                                </option>
                              ))}
                            </select>
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
                <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsRegOpen(false)}
                    className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white/75 hover:text-white text-xs uppercase cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-black transition-all cursor-pointer"
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
                  COMMUNICATING WITH DISPATCH MATRIX
                </h4>
                <p className="text-xs text-white/60">
                  Validating eligibility and recording registration...
                </p>
              </div>
            )}

            {/* Success State */}
            {submitState === 'success' && (
              <div className="p-8 sm:p-10 text-center space-y-5 font-mono">
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
                    className="font-ethnocentric text-lg sm:text-2xl uppercase tracking-wider mb-2"
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

                <div className="p-4 rounded-xl bg-black/70 border border-white/15 inline-block">
                  <div className="text-[10px] text-white/50 uppercase tracking-widest mb-1">
                    OFFICIAL CONFIRMATION ID
                  </div>
                  <div
                    className="font-bold text-base sm:text-lg tracking-wider"
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
                      className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider text-black transition-all"
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
                      className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white hover:border-white/40 text-xs uppercase cursor-pointer"
                    >
                      CLOSE
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Error State */}
            {submitState === 'error' && (
              <div className="p-8 sm:p-10 text-center space-y-4 font-mono">
                <h4 className="font-ethnocentric text-lg text-red-400 uppercase">
                  TRANSMISSION ANOMALY
                </h4>
                <p className="text-xs text-white/75 max-w-md mx-auto">{errorMessage}</p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSubmitState('form')}
                    className="px-4 py-2 rounded-xl bg-mint-leaf text-black font-bold text-xs uppercase cursor-pointer"
                  >
                    RETRY SUBMISSION
                  </button>
                  <a
                    href={WHATSAPP_DIRECT_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-white/5 border border-white/15 text-white text-xs uppercase"
                  >
                    CONTACT COORDINATOR
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
