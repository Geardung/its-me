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
  focus: Array<{
    label: string;
    emoji: TelemojiAsset;
  }>;
  capabilityCards: Array<{
    label: string;
    value: string;
    emoji: TelemojiAsset;
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
    emoji: TelemojiAsset;
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
  url: `/emojis/${encodeURIComponent(group)}/${encodeURIComponent(name)}.webp`,
});

export const profile = {
  name: "Александр",
  role: "Backend Developer / Frontend Starter / QA-minded Engineer",
  meta: {
    title: "Александр | Engineer Biography",
    description:
      "Сайт-биография Александра: backend на Python, интерес к frontend, QA-мышление, Linux-администрирование и системный подход к работе.",
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
    title: "Пишу backend, осваиваю frontend и всегда проверяю, чтобы всё реально работало.",
    summary:
      "Основной рабочий вектор для меня это backend-разработка, в первую очередь на Python. Параллельно я постепенно углубляюсь во frontend, ручное и автотестирование, а также в инфраструктурную часть вокруг Linux и деплоя.",
    description:
      "Мне комфортно там, где есть удалённая работа, понятные процессы и нормальная система постановки задач. Я люблю, когда разработка ведётся не хаотично в переписке, а через GitHub Issues, Jira, Slack или любой другой внятный трекер.",
    ctaPrimary: {
      label: "Смотреть кейсы",
      href: "#projects",
    },
    ctaSecondary: {
      label: "Связаться",
      href: "#contacts",
    },
    focus: [
      {
        label: "Python как основной язык для backend-задач",
        emoji: telemoji("Smileys", "Smiling Face With Sunglasses"),
      },
      {
        label: "FastAPI + PostgreSQL + Alembic + SQLAlchemy + SQL",
        emoji: telemoji("Smileys", "Face With Monocle"),
      },
      {
        label: "React и Vue как точки входа во frontend",
        emoji: telemoji("Smileys", "Star Struck"),
      },
      {
        label: "QA-мышление: после Cursor проверять руками и тестами обязательно",
        emoji: telemoji("Smileys", "Thinking Face"),
      },
    ],
    capabilityCards: [
      {
        label: "Primary lane",
        value: "Python backend",
        emoji: telemoji("Smileys", "Robot"),
      },
      {
        label: "Secondary lane",
        value: "React / Vue basics",
        emoji: telemoji("Smileys", "Partying Face"),
      },
      {
        label: "Quality gate",
        value: "Manual + auto QA",
        emoji: telemoji("Smileys", "Face With Monocle"),
      },
      {
        label: "Ops lane",
        value: "Linux / Nginx / CI/CD",
        emoji: telemoji("Smileys", "Face With Raised Eyebrow"),
      },
    ],
    terminalLines: [
      "$ whoami",
      "alexander",
      "",
      "$ cat stack.txt",
      "python",
      "fastapi",
      "postgresql",
      "alembic",
      "sqlalchemy",
      "react",
      "vue",
      "linux",
      "",
      "$ echo $WORK_MODE",
      "remote + structured tasks + reliable delivery",
    ],
    emoji: telemoji("Smileys", "Robot"),
  } satisfies HeroData,
  about: {
    title: "Обо мне",
    body: [
      "Меня зовут Александр, я родился 22.07.2004. Учился в НКСЭ по специальности «Программирование в компьютерных системах», так что профильная база и диплом у меня есть, даже если в IT реальная ценность всё равно чаще всего определяется не корочкой, а тем, что ты умеешь делать руками.",
      "Опыт у меня разный: и фриланс, и работа на небольшую компанию в городе. Для меня большой плюс это удалённый формат, потому что я действительно много времени провожу за компьютером и спокойно, глубоко вникаю в задачи, когда рабочая среда выстроена вокруг нормального инженерного процесса.",
    ],
    principles: [
      "Лучше всего работаю там, где задачи ведутся системно, а не теряются в переписке.",
      "Без проблем переношу договорённости в GitHub, Jira, Slack и другие рабочие инструменты.",
      "Cursor ускоряет работу, но не отменяет ответственность за результат и проверку кода.",
      "Предпочитаю понятный процесс, в котором видно, что делаем, зачем и на каком этапе это находится.",
    ],
    emoji: telemoji("Smileys", "Nerd Face"),
  } satisfies AboutData,
  skills: [
    {
      title: "Backend",
      summary:
        "Основная зона моей уверенности. Могу писать backend практически на любом языке, но основной рабочий код у меня был и остаётся на Python.",
      emoji: telemoji("Smileys", "Thinking Face"),
      items: [
        {
          name: "Python backend",
          level: "Strong",
          details: "Основной язык для серверной логики, API, бизнес-правил и прикладной разработки.",
          emoji: telemoji("Smileys", "Nerd Face"),
        },
        {
          name: "FastAPI + database stack",
          level: "Strong",
          details: "FastAPI, PostgreSQL, Alembic, SQLAlchemy и SQL как основной прикладной набор.",
          emoji: telemoji("Smileys", "Face Savoring Food"),
        },
        {
          name: "Go",
          level: "Starter",
          details: "Был практический опыт и интерес к Go, но основной production-фокус пока не на нём.",
          emoji: telemoji("Smileys", "Cowboy Hat Face"),
        },
      ],
    },
    {
      title: "Frontend",
      summary:
        "Frontend я начал щупать относительно недавно. Пока не считаю себя сильным верстальщиком, но уже уверенно понимаю, как привязывать методы и логику к интерфейсу.",
      emoji: telemoji("Smileys", "Smiling Face With Sunglasses"),
      items: [
        {
          name: "React",
          level: "Working",
          details: "Пробовал собирать компоненты, привязывать обработчики и работать с базовой структурой приложения.",
          emoji: telemoji("Smileys", "Smiling Face With Sunglasses"),
        },
        {
          name: "Vue",
          level: "Working",
          details: "Есть первый практический опыт и понимание общей логики компонентного подхода.",
          emoji: telemoji("Smileys", "Star Struck"),
        },
        {
          name: "Интеграция логики в UI",
          level: "Working",
          details: "Верстаю не идеально, но связать методы, данные и поведение интерфейса у меня получается.",
          emoji: telemoji("Smileys", "Hugging Face"),
        },
      ],
    },
    {
      title: "QA",
      summary:
        "Навык QA вырос не из теории, а из практики: если используешь ускоряющие инструменты, особенно AI, нужно уметь проверять результат и руками, и тестами.",
      emoji: telemoji("Smileys", "Face With Monocle"),
      items: [
        {
          name: "Manual testing",
          level: "Working",
          details: "Проверяю сценарии руками, если нужно быстро подтвердить, что фича реально живая.",
          emoji: telemoji("Smileys", "Face With Monocle"),
        },
        {
          name: "Autotests mindset",
          level: "Working",
          details: "Понимаю ценность автопроверок как защиты от регрессий и неочевидных поломок.",
          emoji: telemoji("Smileys", "Face Holding Back Tears"),
        },
        {
          name: "Self-review discipline",
          level: "Strong",
          details: "Не доверяю слепо инструменту, даже если он ускоряет разработку. Проверка обязательна.",
          emoji: telemoji("Smileys", "Face With Raised Eyebrow"),
        },
      ],
    },
    {
      title: "Ops / Infrastructure",
      summary:
        "По инфраструктуре я не чистый DevOps, но на уверенном среднем уровне могу администрировать Linux-сервера и сопровождать небольшой деплой.",
      emoji: telemoji("Smileys", "Face With Raised Eyebrow"),
      items: [
        {
          name: "Linux administration",
          level: "Working",
          details: "Зайти на сервер, поднять сервис, поправить конфиги и привести окружение в рабочее состояние.",
          emoji: telemoji("Smileys", "Saluting Face"),
        },
        {
          name: "Web server setup",
          level: "Working",
          details: "Nginx, Apache, systemd и базовая эксплуатация сервисов на хостинге или VPS.",
          emoji: telemoji("Smileys", "Smiling Face"),
        },
        {
          name: "CI/CD basics",
          level: "Working",
          details: "GitHub и GitHub Actions для небольших пайплайнов сборки и деплоя.",
          emoji: telemoji("Smileys", "Grinning Face With Smiling Eyes"),
        },
      ],
    },
  ] satisfies SkillGroup[],
  timeline: [
    {
      period: "2004",
      title: "Старт",
      description:
        "Родился 22 июля 2004 года. Интерес к компьютерам довольно быстро перешёл в интерес к программированию и прикладной разработке.",
      outcomes: [
        "Рано сформировалась привычка много времени проводить за компьютером и учиться через практику.",
        "Интерес к коду постепенно стал не хобби, а рабочим направлением.",
      ],
      emoji: telemoji("Smileys", "Saluting Face"),
    },
    {
      period: "НКСЭ",
      title: "Обучение на программиста",
      description:
        "Учился в НКСЭ по специальности «Программирование в компьютерных системах». Получил профильную базу и корочку, но основной рост всё равно происходил через реальную практику.",
      outcomes: [
        "Освоил фундамент, который позже начал применять на реальных задачах.",
        "Укрепился в мысли, что в IT ценится не формальный статус, а рабочий результат.",
      ],
      emoji: telemoji("Smileys", "Thinking Face"),
    },
    {
      period: "Freelance",
      title: "Разный коммерческий опыт",
      description:
        "Работал как на фрилансе, так и на небольшую компанию в городе. Это дало опыт разных форматов взаимодействия, задач и уровня ответственности.",
      outcomes: [
        "Столкнулся не только с кодом, но и с реальной организацией работы.",
        "Понял, насколько важны нормальные процессы и прозрачная постановка задач.",
      ],
      emoji: telemoji("Smileys", "Star Struck"),
    },
    {
      period: "Now",
      title: "Backend как основа, frontend и QA как усиление",
      description:
        "Сейчас мой основной практический стек это Python backend, но параллельно я развиваюсь во frontend, тестировании и инфраструктуре, чтобы быть полезным не в одной узкой роли, а в целом рабочем контуре команды.",
      outcomes: [
        "Использую Cursor как ускоритель, но не как замену инженерной проверке.",
        "Ищу команду, где есть удалёнка, внятный workflow и задачи, которые живут в системе, а не в хаотичной переписке.",
      ],
      emoji: telemoji("Smileys", "Face With Monocle"),
    },
  ] satisfies TimelineEntry[],
  projects: [
    {
      name: "Backend API и прикладная логика",
      role: "Backend / Python",
      summary:
        "Основной формат задач, в котором я чувствую себя увереннее всего: API, модели данных, работа с БД, миграциями и бизнес-логикой.",
      stack: ["Python", "FastAPI", "PostgreSQL", "Alembic", "SQLAlchemy"],
      impact: [
        "Могу быстро включаться в серверную часть и писать прикладной код под реальные сценарии продукта.",
        "Учитываю, что изменения в базе и API должны переживать уже существующие данные и текущих пользователей.",
      ],
      emoji: telemoji("Smileys", "Robot"),
    },
    {
      name: "Проверка качества и здравый скепсис к AI",
      role: "QA / Delivery",
      summary:
        "Работа с AI-инструментами вроде Cursor не уменьшила мою внимательность, а наоборот заставила сильнее развить привычку проверять результат.",
      stack: ["Manual testing", "Autotests", "Regression mindset", "Self-review"],
      impact: [
        "Лучше вижу, где код может выглядеть правильным, но вести себя неправильно.",
        "Сильнее ценю проверку сценариев до того, как ошибка доедет до пользователей или заказчика.",
      ],
      emoji: telemoji("Smileys", "Face With Monocle"),
    },
    {
      name: "Небольшая инфраструктура и развёртывание",
      role: "Linux / CI-CD",
      summary:
        "Когда проект небольшой, могу не только написать код, но и помочь с развёртыванием, сервисами и базовой эксплуатацией на Linux.",
      stack: ["Linux", "Nginx", "Apache", "systemd", "GitHub Actions"],
      impact: [
        "Могу закрыть часть задач вокруг демонов, конфигов и автоматического билда или деплоя.",
        "Это полезно для небольших команд, где важно уметь брать на себя больше одной зоны ответственности.",
      ],
      emoji: telemoji("Smileys", "Face With Raised Eyebrow"),
    },
  ] satisfies ProjectCard[],
  contacts: [
    {
      label: "Telegram",
      value: "t.me/old6oy",
      href: "https://t.me/old6oy",
      note: "Быстрый способ написать напрямую.",
      emoji: telemoji("Smileys", "Slightly Smiling Face"),
    },
    {
      label: "GitHub",
      value: "github.com/Geardung",
      href: "https://github.com/Geardung",
      note: "Профиль с кодом, репозиториями и активностью.",
      emoji: telemoji("Smileys", "Robot"),
    },
    {
      label: "Email",
      value: "geardung@ya.ru",
      href: "mailto:geardung@ya.ru",
      note: "Для предложений по работе и более формальной связи.",
      emoji: telemoji("Smileys", "Face Exhaling"),
    },
  ] satisfies ContactLink[],
} as const;

export type ProfileData = typeof profile;
