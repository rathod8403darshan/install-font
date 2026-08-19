/** Homepage marketing content (sections below font browse). */

export type HomeCta = {
  label: string;
  /** Internal path or special store key */
  href: "app-store" | "google-play" | string;
};

export type HomeMarketingSection = {
  id: string;
  eyebrow?: string;
  title: string;
  paragraphs: string[];
  /** Optional secondary heading within the section */
  subtitle?: string;
  /** Heading after the first copy block (e.g. a second H3) */
  subtitle2?: string;
  /** Copy that follows `subtitle` */
  afterSubtitle?: string[];
  /** Line introducing a list */
  listIntro?: string;
  /** Paragraph after a list or category block */
  closing?: string;
  bullets?: string[];
  /** Labeled bullet rows (audience / categories) */
  labeledItems?: { label: string; text: string }[];
  steps?: { title: string; description: string }[];
  reasons?: { title: string; description: string }[];
  /** Extra titled copy blocks (e.g. Library sub-sections) */
  blocks?: { title: string; paragraphs: string[] }[];
  ctas?: HomeCta[];
  /** Layout hint for the UI */
  layout?:
    | "intro"
    | "split"
    | "steps"
    | "list"
    | "reasons"
    | "cta"
    | "faq"
    | "final"
    | "features"
    | "maker"
    | "trusted"
    | "import"
    | "devices"
    | "library"
    | "finder"
    | "management"
    | "safari"
    | "why";
};

export const HOME_MARKETING_SECTIONS: HomeMarketingSection[] = [
  {
    id: "discover",
    eyebrow: "Powerful Features",
    title: "Discover Thousands of Fonts for iPhone and iPad",
    paragraphs: [
      "Finding the right typeface should be exciting - not frustrating. Install Font gives you access to a growing collection of Fonts For iPhone and iPad Fonts, making it easier to find a style for every project.",
    ],
    ctas: [
      { label: "Get Fonts For iPhone Free", href: "app-store" },
      { label: "Explore Fonts for iPhone", href: "/fonts/movie" },
    ],
    layout: "features",
  },
  {
    id: "handwriting",
    title: "Create Your Own Custom Font for iPhone",
    paragraphs: [
      "Sometimes the perfect font does not exist in a font library.",
      "It exists in your handwriting.",
      "Install Fonts helps you turn your handwriting into a Custom Font For iPhone, allowing you to create a more personal typography experience. Your handwriting can become part of your creative toolkit instead of remaining limited to paper or handwritten notes.",
      "The Font Maker feature is designed to help you create your own font from your handwriting. This can be useful for creators, artists, students, designers, journaling enthusiasts, and anyone who wants their digital text to feel more personal.",
      "A Custom Font For iPhone can add personality to creative projects and give your typography a style that feels uniquely yours.",
      "Your font does not have to look like everyone else's.",
      "Create something that looks like you.",
    ],
    ctas: [{ label: "Create a Custom Font for iPhone", href: "app-store" }],
    layout: "maker",
  },
  {
    id: "how-to",
    title: "How to Install Fonts on iPhone & iPad",
    paragraphs: [],
    steps: [
      {
        title: "Download the App",
        description:
          "Grab InstallFont from the App Store. Lightweight, fast, and free.",
      },
      {
        title: "Browse Fonts for iPhone",
        description:
          "Scroll through our growing library of Fonts for iPhone. Preview each style in real time before committing.",
      },
      {
        title: "Install Fonts and Enjoy",
        description:
          "Tap Install Fonts, follow the secure on-screen profile prompt, and your new Custom Font for iPhone is ready to use.",
      },
    ],
    ctas: [{ label: "Download Install Font", href: "app-store" }],
    layout: "steps",
  },
  {
    id: "trusted",
    title: "Trusted, Safe, and App Store Approved",
    paragraphs: [
      "We know how important it is to trust the apps on your device. InstallFont follows Apple's official guidelines for how to Install Fonts, meaning every font profile is generated safely - nothing hidden, nothing sketchy.",
    ],
    subtitle: "A Verified Way to Manage iOS Fonts",
    afterSubtitle: [
      "Unlike random tutorials circulating online, our app gives you a verified, App Store-approved way to manage iOS Fonts and Apple Fonts. You're always in control, and you can remove any installed font anytime from your device settings.",
      "This commitment to safety is part of why so many users choose InstallFont over piecing together Custom Font for iPhone installations manually. When you want Fonts for iPhone that are beautiful and secure, we're built exactly for that.",
    ],
    ctas: [
      { label: "Download the Trusted Fonts for iPhone App", href: "app-store" },
    ],
    layout: "trusted",
  },
  {
    id: "apple-screens",
    title: "Fonts for iPhone and iPad Fonts - One App, Every Apple Screen",
    paragraphs: [
      "InstallFont isn't just about your phone. If you also use a tablet, our collection of iPad Fonts gives you the same effortless customization across your entire Apple lineup. Whether taking notes or designing a presentation, our iPad Fonts install just as easily as our Fonts for iPhone options.",
    ],
    subtitle: "Consistent Apple Fonts Across Devices",
    afterSubtitle: [
      "Because our platform is built around the Apple Fonts ecosystem, everything stays consistent - the same font looks sharp whether you're viewing it on iPhone or iPad Fonts displays. This kind of cross-device consistency is core to what makes InstallFont different.",
    ],
    subtitle2: "Designed for Everyday Creativity",
    listIntro: "Install Font can be useful for:",
    labeledItems: [
      {
        label: "Students",
        text: "Make assignments, presentations, and projects more visually engaging.",
      },
      {
        label: "Professionals",
        text: "Maintain typography that matches your personal or business style.",
      },
      {
        label: "Designers",
        text: "Quickly explore and manage different typefaces for creative projects.",
      },
      {
        label: "Content Creators",
        text: "Find typography that works with your digital content.",
      },
      {
        label: "Business Owners",
        text: "Build a recognizable visual identity using consistent fonts.",
      },
      {
        label: "Everyday Users",
        text: "Simply enjoy having more font choices on your device.",
      },
    ],
    closing:
      "With Install Font, discovering iOS Fonts becomes a more enjoyable part of your creative workflow.",
    ctas: [{ label: "Download App on the App Store", href: "app-store" }],
    layout: "devices",
  },
  {
    id: "import",
    title: "Import Fonts From Anywhere",
    paragraphs: [
      "Already found the perfect font online? You don't necessarily need to start your search again.",
      "Install Font allows you to import supported font files from the web and other available locations on your device.",
      "This makes it easier to build your own collection of Fonts For iPhone based on the styles you discover. You can also explore the Google Fonts library and discover additional typography options.",
      "Whether a designer sends you a font file, you download a typeface from a supported website, or you already have font files stored on your device, you can bring compatible files into your font workflow.",
    ],
    bullets: [".ttf", ".ttc", ".otf", "Google Fonts"],
    subtitle: "Your Fonts, Your Way",
    afterSubtitle: [
      "You don't have to rely only on a preselected collection.",
      "Import the fonts you love. Discover new ones. Build a collection that works for your projects.",
      "That's the freedom behind Custom Font For iPhone.",
    ],
    ctas: [{ label: "Import Custom Fonts Now", href: "app-store" }],
    layout: "import",
  },
  {
    id: "library",
    title: "A Large Fonts Library in One App",
    paragraphs: [
      "Searching for fonts across multiple websites can be time-consuming. Install Font brings a dedicated Fonts Library experience together in one place.",
      "With thousands of fonts available, you can explore different categories and styles according to the type of project you are working on.",
    ],
    listIntro: "You can discover typography suitable for:",
    labeledItems: [
      {
        label: "Minimal designs",
        text: "Clean and simple fonts for modern documents and interfaces.",
      },
      {
        label: "Professional projects",
        text: "Reliable typography for business presentations, reports, and documents.",
      },
      {
        label: "Creative designs",
        text: "Decorative and expressive styles for artwork, invitations, and social content.",
      },
      {
        label: "Personal projects",
        text: "Handwritten and playful styles for projects where you want a more individual look.",
      },
      {
        label: "Display typography",
        text: "Strong and distinctive fonts for headings, posters, titles, and promotional designs.",
      },
    ],
    closing:
      "A good font library is not only about quantity. It is also about helping you find the right style for the right project.",
    blocks: [
      {
        title: "Google Fonts Library",
        paragraphs: [
          "Install Font also gives users access to the Google Fonts Library, opening the door to a large selection of widely used typefaces.",
          "Google Fonts includes typography styles used across websites, applications, branding projects, presentations, and digital content.",
          "Having access to a familiar font collection can be especially useful for designers and creators who want to maintain consistent typography between different projects.",
          "You can explore available fonts and choose styles that fit your creative requirements before installing supported files on your device.",
        ],
      },
      {
        title: "Discover Fonts From DaFont and More",
        paragraphs: [
          "The world of typography extends far beyond one font collection.",
          "Install Font can help you work with fonts from popular online sources such as DaFont and more, giving you additional opportunities to discover interesting and unusual typefaces.",
          "From classic typography to experimental lettering, the web contains an enormous range of font styles.",
          "When downloading fonts from external websites, always check the license and usage conditions. A font being available for download does not necessarily mean that it is free for commercial use.",
          "Install Font focuses on helping you bring supported font files into your iPhone or iPad workflow while giving you more freedom to explore typography.",
        ],
      },
    ],
    ctas: [{ label: "Explore Full Font Library", href: "app-store" }],
    layout: "library",
  },
  {
    id: "font-finder",
    title: "Identify a Font From an Image",
    paragraphs: [
      "Have you ever seen a font in a poster, advertisement, website, screenshot, packaging design, or social media post and wondered what it was called?",
      "Install Font includes a Font Finder feature that can help you identify fonts using an image.",
      "Instead of manually searching through thousands of typefaces, you can start with an image and look for typography that resembles what you have discovered.",
    ],
    listIntro: "This can be particularly helpful for:",
    bullets: [
      "Designers researching typography",
      "Students working on creative projects",
      "Content creators",
      "Brand and marketing teams",
      "Social media designers",
      "Typography enthusiasts",
      "People looking for a similar font",
    ],
    closing:
      "Font identification can turn inspiration into a practical starting point. Once you know what style you are looking for, finding an appropriate typeface becomes much easier.",
    ctas: [{ label: "Install Font Finder App", href: "app-store" }],
    layout: "finder",
  },
  {
    id: "more-features",
    title: "More Features to Make Font Management Easier",
    paragraphs: [
      "Install Font can continue evolving as a complete font-management companion for Apple users.",
    ],
    listIntro: "Useful future-facing capabilities can include:",
    bullets: [
      "Font preview before installation",
      "Search by font name",
      "Search by font style",
      "Favorite fonts",
      "Recently viewed fonts",
      "Recently installed fonts",
      "Font collections",
      "Font categories",
      "Font pairing suggestions",
      "Duplicate font detection",
      "Font metadata and designer information",
      "Font file management",
      "Share font files",
      "Backup and restore options",
      "Quick font previews",
      "Dark Mode support",
      "Font comparison tools",
      "Font recommendation tools",
      "Improved font discovery",
      "Custom font organization",
      "Cross-device workflow support",
    ],
    closing:
      "These features can make it easier to move from font discovery to actual design work.",
    ctas: [{ label: "Explore All Font Features", href: "app-store" }],
    layout: "management",
  },
  {
    id: "safari",
    title: "Customize Your Safari Reading Experience",
    paragraphs: [
      "Typography is not only useful when you create content.",
      "It can also change how you experience content.",
      "Install Fonts includes Safari customization features that allow you to personalize supported web reading experiences with font style, size, spacing, and color settings.",
      "If a website's default typography does not feel comfortable for your reading preferences, customization gives you more control over the visual experience.",
    ],
    listIntro: "You can adjust elements such as:",
    bullets: [
      "Font style",
      "Font size",
      "Line height",
      "Letter spacing",
      "Paragraph spacing",
      "Text color",
      "Background color",
    ],
    closing:
      "This transforms your font collection from a simple design resource into a more personalized reading and browsing experience.",
    ctas: [{ label: "Customize Safari Fonts Now", href: "app-store" }],
    layout: "safari",
  },
  {
    id: "why-choose",
    title: "Why Millions Choose Install Font for iOS Typography",
    paragraphs: [
      "There are many reasons to use a dedicated font application instead of searching for individual typefaces whenever you start a new project.",
    ],
    reasons: [
      {
        title: "More Than 5,000 Fonts",
        description:
          "Explore a large collection of fonts without starting from scratch every time you need a new typeface.",
      },
      {
        title: "Font Installation",
        description:
          "Import supported files and Install Fonts on your iPhone or iPad for use in compatible applications.",
      },
      {
        title: "Custom Typography",
        description:
          "Explore tools for creating and working with your own Custom Font For iPhone.",
      },
      {
        title: "Font Finder",
        description:
          "Identify fonts from images and discover similar typography for your projects.",
      },
      {
        title: "Multiple File Formats",
        description:
          "Work with popular font formats such as .ttf, .ttc, and .otf.",
      },
      {
        title: "Google Fonts",
        description: "Explore fonts from the Google Fonts collection.",
      },
      {
        title: "Web Font Import",
        description:
          "Import supported fonts downloaded from websites and other sources.",
      },
      {
        title: "Pages, Keynote, and Numbers",
        description:
          "Use compatible installed fonts with Apple's productivity applications.",
      },
      {
        title: "iPhone and iPad Support",
        description:
          "Build your font collection across compatible Apple devices.",
      },
      {
        title: "Organized Font Library",
        description:
          "Keep your typography discovery and installation workflow in one dedicated application.",
      },
    ],
    ctas: [{ label: "Try the #1 iOS Font App", href: "app-store" }],
    layout: "why",
  },
  {
    id: "ready",
    title: "Ready to Change Fonts for iPhone?",
    paragraphs: [
      "Your device says a lot about you - let it reflect your style. With InstallFont, discovering and installing Custom Font for iPhone takes less time than choosing lunch. Browse the collection, preview instantly, and transform your typography in seconds.",
      "Join thousands of users who've already made the switch. Whether you're after clean iOS Fonts for daily use or something bold enough to stand out, your next favorite Fonts for iPhone style is one tap away. And if you're on a tablet too, don't forget to explore our matching iPad Fonts collection.",
    ],
    ctas: [{ label: "Get Custom Fonts For iPhone Free", href: "app-store" }],
    layout: "cta",
  },
  {
    id: "faq",
    title: "Frequently Asked Questions About Fonts for iPhone",
    paragraphs: [],
    layout: "faq",
  },
  {
    id: "final-cta",
    title: "Ready to Upgrade Your iPhone & iPad Fonts?",
    paragraphs: [],
    ctas: [{ label: "Download Install Font on the App Store", href: "app-store" }],
    layout: "final",
  },
];

export type HomeFaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const HOME_FAQ: HomeFaqItem[] = [
  {
    id: "install",
    question: "How do I install fonts on iPhone and iPad?",
    answer:
      "Download Install Fonts from the App Store, browse Fonts for iPhone, tap install, and follow the secure on-screen profile prompt. Your Custom Font for iPhone is then ready in compatible apps.",
  },
  {
    id: "safe",
    question: "Is Install Fonts safe and App Store approved?",
    answer:
      "Yes. Install Fonts follows Apple's official guidelines for installing fonts. Font profiles are generated safely, and you can remove any installed font anytime from your device settings.",
  },
  {
    id: "formats",
    question: "Which font file formats can I import?",
    answer:
      "Install Fonts supports common formats including .ttf, .ttc, and .otf so you can import fonts from the web or files already on your device.",
  },
  {
    id: "ipad",
    question: "Does Install Fonts work on iPad?",
    answer:
      "Yes. The same app covers Fonts for iPhone and iPad Fonts, so you get consistent Apple Fonts across your devices for notes, presentations, and creative work.",
  },
  {
    id: "handwriting",
    question: "Can I create a custom font from my handwriting?",
    answer:
      "Install Fonts includes Font Maker tools designed to help turn your handwriting into a Custom Font For iPhone for a more personal typography experience.",
  },
  {
    id: "finder",
    question: "Can I identify a font from an image?",
    answer:
      "Yes. Font Finder helps you identify fonts from posters, screenshots, packaging, and social posts, then find similar typography for your projects.",
  },
  {
    id: "safari",
    question: "Can I customize fonts in Safari?",
    answer:
      "Install Fonts includes Safari customization features for supported reading experiences - adjust font style, size, spacing, and colors to match your preferences.",
  },
  {
    id: "google",
    question: "Does Install Fonts include Google Fonts?",
    answer:
      "Yes. You can explore the Google Fonts library alongside other sources, preview styles, and install supported files on your device. Always check each font's license before commercial use.",
  },
];
