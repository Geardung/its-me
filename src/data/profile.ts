export type TelemojiAsset = {
  group: string;
  name: string;
  alt: string;
  url: string;
};

export type HeroData = {
  eyebrow: string;
  title: string;
  summary: string;
  description: string;
  ctaPrimary: {
    label: string;
    href: string;
  };
  ctaSecondary: {
    label: string;
    href: string;
  };
  focus: string[];
  capabilityCards: Array<{
    label: string;
    value: string;
  }>;
  terminalLines: string[];
  emoji: TelemojiAsset;
};

export type AboutData = {
  title: string;
  body: string[];
  principles: string[];
  emoji: TelemojiAsset;
};

export type SkillGroup = {
  title: string;
  summary: string;
  emoji: TelemojiAsset;
  items: Array<{
    name: string;
    level: string;
    details: string;
  }>;
};

export type TimelineEntry = {
  period: string;
  title: string;
  description: string;
  outcomes: string[];
  emoji: TelemojiAsset;
};

export type ProjectCard = {
  name: string;
  role: string;
  summary: string;
  stack: string[];
  impact: string[];
  emoji: TelemojiAsset;
};

export type ContactLink = {
  label: string;
  value: string;
  href?: string;
  note: string;
  isPlaceholder?: boolean;
  emoji: TelemojiAsset;
};

const telemoji = (
  group: string,
  name: string,
  alt = name,
): TelemojiAsset => ({
  group,
  name,
  alt,
  url: `https://raw.githubusercontent.com/Tarikul-Islam-Anik/Telegram-Animated-Emojis/main/${encodeURIComponent(group)}/${encodeURIComponent(name)}.webp`,
});

export const profile = {
  name: "Tedeshi",
  role: "Backend / Frontend / QA Engineer",
  meta: {
    title: "Tedeshi | Engineer Biography",
    description:
      "Статический сайт-биография разработчика: backend, frontend, QA, инженерное мышление и кейсы с фокусом на результат.",
  },
  navigation: [
    { label: "Обо мне", href: "#about" },
    { label: "Навыки", href: "#skills" },
    { label: "Путь", href: "#timeline" },
    { label: "Кейсы", href: "#projects" },
    { label: "Контакты", href: "#contacts" },
  ],
  hero: {
    eyebrow: "sepia://engineering-profile",
    title: "Строю продукты от схемы данных и API до интерфейса и контроля качества.",
    summary:
      "Мне интересен полный инженерный контур: продумать архитектуру, собрать надёжный backend, довести UX до внятного состояния и закрыть риски тестированием.",
    description:
      "Этот сайт собран как программное досье: без лишнего пафоса, зато с явной структурой, понятной системой навыков и кейсами, которые показывают, как я думаю и работаю.",
    ctaPrimary: {
      label: "Смотреть кейсы",
      href: "#projects",
    },
    ctaSecondary: {
      label: "Связаться",
      href: "#contacts",
    },
    focus: [
      "API-first подход и ясные контракты",
      "Инженерный UX без визуального шума",
      "Тестирование как часть delivery, а не постфактум",
      "Релизная дисциплина, наблюдаемость и контроль качества",
    ],
    capabilityCards: [
      { label: "Primary lane", value: "Backend systems" },
      { label: "Secondary lane", value: "Frontend delivery" },
      { label: "Quality gate", value: "QA mindset" },
      { label: "Operating mode", value: "Product + engineering" },
    ],
    terminalLines: [
      "$ whoami",
      "tedeshi",
      "",
      "$ cat areas.txt",
      "backend",
      "frontend",
      "qa",
      "architecture",
      "",
      "$ echo $MISSION",
      "Build reliable software with taste",
    ],
    emoji: telemoji("Smileys", "Robot"),
  } satisfies HeroData,
  about: {
    title: "Обо мне",
    body: [
      "Мне близок формат инженера широкого профиля: я не замыкаюсь на одном слое продукта, а смотрю на систему целиком. Поэтому для меня важны не только код и фреймворки, но и данные, сценарии пользователя, деградации, edge cases и качество релиза.",
      "Сильнее всего меня драйвит момент, когда сложная задача превращается в прозрачную систему: с понятной схемой, аккуратным интерфейсом, измеримыми рисками и предсказуемым поведением в продакшене.",
    ],
    principles: [
      "Предпочитаю ясные интерфейсы между слоями вместо магии.",
      "Люблю, когда backend, frontend и QA думают об одном продукте, а не о трёх разных.",
      "Считаю хорошим решением то, которое можно поддерживать и объяснить через полгода.",
      "Не отделяю скорость от качества: быстрый релиз хорош только тогда, когда он устойчив.",
    ],
    emoji: telemoji("Smileys", "Nerd Face"),
  } satisfies AboutData,
  skills: [
    {
      title: "Backend",
      summary:
        "Проектирование сервисов, схем данных, API-контрактов и сценариев, которые выдерживают реальную эксплуатацию.",
      emoji: telemoji("Smileys", "Thinking Face"),
      items: [
        {
          name: "API design",
          level: "Strong",
          details: "REST, явные DTO, валидация входа и устойчивые контракты.",
        },
        {
          name: "Data modeling",
          level: "Strong",
          details: "Сущности, связи, миграционное мышление и аккуратная эволюция схемы.",
        },
        {
          name: "Reliability",
          level: "Strong",
          details: "Логирование, наблюдаемость, graceful degradation, обработка ошибок.",
        },
      ],
    },
    {
      title: "Frontend",
      summary:
        "Собираю интерфейсы, где структура, скорость чтения и иерархия важнее визуального шума.",
      emoji: telemoji("Smileys", "Smiling Face With Sunglasses"),
      items: [
        {
          name: "UI composition",
          level: "Strong",
          details: "Компонентный подход, семантическая разметка и ясная композиция экранов.",
        },
        {
          name: "Design systems",
          level: "Working",
          details: "Токены, повторяемые паттерны, консистентность состояний и типографики.",
        },
        {
          name: "Performance",
          level: "Working",
          details: "Статическая генерация, разумная гидратация, контроль веса и загрузки.",
        },
      ],
    },
    {
      title: "QA",
      summary:
        "Смотрю на качество не как на чеклист, а как на систему защиты продукта от регрессий и неочевидных сценариев.",
      emoji: telemoji("Smileys", "Face With Monocle"),
      items: [
        {
          name: "Test strategy",
          level: "Strong",
          details: "Риск-ориентированная проверка, критические сценарии и приоритеты покрытия.",
        },
        {
          name: "Regression control",
          level: "Strong",
          details: "Проверка happy-path, edge cases и связей между слоями продукта.",
        },
        {
          name: "Release confidence",
          level: "Strong",
          details: "Дымовые сценарии, acceptance thinking и контроль бизнес-рисков.",
        },
      ],
    },
    {
      title: "Architecture",
      summary:
        "Умею держать в голове целую систему: ограничения, компромиссы, будущие расширения и цену ошибок.",
      emoji: telemoji("Smileys", "Face With Raised Eyebrow"),
      items: [
        {
          name: "System thinking",
          level: "Strong",
          details: "Связи между доменом, интерфейсами, инфраструктурой и эксплуатацией.",
        },
        {
          name: "Trade-offs",
          level: "Strong",
          details: "Выбор решений по цене поддержки, скорости доставки и уровню риска.",
        },
        {
          name: "Documentation discipline",
          level: "Working",
          details: "Краткие, но полезные описания архитектурных решений и границ системы.",
        },
      ],
    },
  ] satisfies SkillGroup[],
  timeline: [
    {
      period: "Phase 01",
      title: "От интереса к коду к системному мышлению",
      description:
        "Фокус сместился с написания отдельных фич на понимание того, как вместе работают данные, контракты, интерфейсы и качество.",
      outcomes: [
        "Начал смотреть на задачи не по слоям, а по сквозному пользовательскому сценарию.",
        "Стал сильнее ценить простую архитектуру, понятные договорённости и устойчивые решения.",
      ],
      emoji: telemoji("Smileys", "Saluting Face"),
    },
    {
      period: "Phase 02",
      title: "Углубление в backend и дисциплину delivery",
      description:
        "На первый план вышли схемы данных, поведение API, обработка ошибок и понимание того, что хороший сервис живёт не только на локальной машине.",
      outcomes: [
        "Начал думать миграциями, версиями контрактов и эксплуатационными последствиями изменений.",
        "Собрал инженерный взгляд на релиз как на процесс, а не на кнопку deploy.",
      ],
      emoji: telemoji("Smileys", "Thinking Face"),
    },
    {
      period: "Phase 03",
      title: "Расширение в frontend и качество пользовательского опыта",
      description:
        "Параллельно усилился интерес к интерфейсам: важно не только чтобы работало, но и чтобы читалось, вело пользователя и не ломалось под нагрузкой изменений.",
      outcomes: [
        "Фокус на семантике, структуре экрана и ясной иерархии контента.",
        "Привычка проверять продукт глазами пользователя, а не только автора кода.",
      ],
      emoji: telemoji("Smileys", "Star Struck"),
    },
    {
      period: "Phase 04",
      title: "QA как часть инженерной ответственности",
      description:
        "Тестирование перестало быть отдельным этапом и стало частью того, как принимаются решения ещё до написания кода.",
      outcomes: [
        "Появился устойчивый навык искать слабые места до релиза.",
        "Укрепился подход, где качество встроено в процесс разработки.",
      ],
      emoji: telemoji("Smileys", "Face With Monocle"),
    },
  ] satisfies TimelineEntry[],
  projects: [
    {
      name: "API-First Service Blueprint",
      role: "Backend / Architecture",
      summary:
        "Шаблон проектирования сервиса, где сначала определяются сущности, контракты, сценарии ошибок и только потом идёт реализация.",
      stack: ["Domain modeling", "REST", "Validation", "Error handling"],
      impact: [
        "Помогает быстрее согласовывать поведение сервиса между backend, frontend и QA.",
        "Снижает количество неявных решений, которые обычно всплывают уже после релиза.",
      ],
      emoji: telemoji("Smileys", "Robot"),
    },
    {
      name: "Release Confidence Flow",
      role: "QA / Delivery",
      summary:
        "Подход к релизу, где критические сценарии, smoke checks и регрессионные риски собраны в единый понятный поток проверки.",
      stack: ["Smoke testing", "Acceptance thinking", "Regression control"],
      impact: [
        "Делает релиз предсказуемее и помогает быстрее находить зоны риска.",
        "Переводит тестирование из разрозненных проверок в инженерную систему уверенности.",
      ],
      emoji: telemoji("Smileys", "Face With Monocle"),
    },
    {
      name: "Static Bio Interface",
      role: "Frontend / Design engineering",
      summary:
        "Статический интерфейс-портфолио в инженерной эстетике: понятная структура, акцент на содержании и минимум лишней клиентской сложности.",
      stack: ["Astro", "Static build", "Component layout", "Visual system"],
      impact: [
        "Показывает навыки через форму: архитектура, UI-мышление и внимание к качеству реализации.",
        "Даёт основу, которую легко развивать в полноценное инженерное портфолио.",
      ],
      emoji: telemoji("Smileys", "Smiling Face With Sunglasses"),
    },
  ] satisfies ProjectCard[],
  contacts: [
    {
      label: "Telegram",
      value: "@your_handle",
      note: "Подставьте ваш реальный username.",
      isPlaceholder: true,
      emoji: telemoji("Smileys", "Slightly Smiling Face"),
    },
    {
      label: "GitHub",
      value: "github.com/your-handle",
      note: "Ссылка на публичный профиль или pin-репозитории.",
      isPlaceholder: true,
      emoji: telemoji("Smileys", "Robot"),
    },
    {
      label: "Email",
      value: "hello@your-domain.dev",
      note: "Рабочий контакт для обсуждения проектов и сотрудничества.",
      isPlaceholder: true,
      emoji: telemoji("Smileys", "Face Exhaling"),
    },
    {
      label: "Resume",
      value: "resume.pdf",
      note: "Можно заменить на PDF, Notion или отдельную страницу.",
      isPlaceholder: true,
      emoji: telemoji("Smileys", "Saluting Face"),
    },
  ] satisfies ContactLink[],
} as const;

export type ProfileData = typeof profile;
