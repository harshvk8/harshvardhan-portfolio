import type { ProjectInput } from "./schema";

/**
 * Concise project summaries based on the existing case studies and resume.
 * Keep implementation examples optional, and distinguish prototypes from
 * production features. Do not add unverified usage or performance claims.
 */
export const projectsData: ProjectInput[] = [
  {
    slug: "red-hawk-wallet-android",
    name: "Red Hawk Wallet (Android)",
    tagline:
      "An Android campus wallet prototype for balances, digital student IDs, events, and offers.",
    year: "2026",
    featured: true,
    stack: [
      "Kotlin",
      "Jetpack Compose",
      "MVVM",
      "Firebase Auth",
      "Firestore",
      "Firebase Storage",
      "Android NFC",
    ],
    repo: "https://github.com/harshvk8/RedHawkWallet",
    caseStudy: {
      overview:
        "I led a six-person team building an Android prototype to bring campus services into one app. It combines wallet balances, a QR student ID, events, and offers, with email verification before access to protected screens.",
      contributions: [
        "Developed wallet features, transaction history, and QR student ID flows with the team.",
        "Organized feature branches, code reviews, and shared Firebase data models.",
        "Separated screens, view models, and data access using MVVM.",
      ],
      decisions: [
        "Used Kotlin and Jetpack Compose to work directly with Android features.",
        "Centralized navigation checks and grouped balance updates with transaction records in a Firestore transaction.",
      ],
      learned: [
        "Agreeing on data models and feature boundaries early makes team development easier.",
        "Wallet features need explicit authorization and validation beyond what the UI allows.",
      ],
      architecture:
        "Compose screen -> ViewModel -> Repository -> FirestoreDataSource\nFirebase Auth -> email-verification guard -> protected screens\nFirestore -> profiles, wallets, transactions, events, offers\nFirebase Storage -> profile photos\n\nPrototype payment flow:\nRead balance -> validate -> update balance + record transaction atomically",
      codeDecisions: [
        {
          title: "Keep the balance and transaction history consistent",
          language: "Kotlin",
          snippet:
            "firestore.runTransaction { txn ->\n  val wallet = txn.get(walletRef).toObject<Wallet>()!!\n  require(wallet.balanceFor(account) >= amountCents)\n  txn.update(walletRef, account.field, wallet.balanceFor(account) - amountCents)\n  txn.set(txRef, Transaction(delta = -amountCents, at = now()))\n}",
          why: "Both writes succeed together or neither is applied. Server-side authorization is a separate requirement.",
        },
      ],
    },
  },
  {
    slug: "red-hawk-wallet-flutter",
    name: "Red Hawk Wallet (Flutter)",
    tagline: "A campus wallet MVP for iOS and Android, with student, vendor, and admin tools.",
    year: "2026",
    featured: true,
    stack: [
      "Flutter",
      "Dart",
      "go_router",
      "Firebase",
      "Cloud Functions",
      "Stripe",
      "iOS",
      "Xcode",
    ],
    repo: "https://github.com/harshvk8/redhawkwallet-flutter",
    caseStudy: {
      overview:
        "I rebuilt Red Hawk Wallet in Flutter to support iOS and Android from one codebase. The MVP adds vendor and admin workflows, QR payments, rewards, and Stripe sandbox top-ups, with balance updates handled by Cloud Functions.",
      contributions: [
        "Led the cross-platform rebuild and organized student, vendor, and admin flows.",
        "Integrated QR payments, transaction history, rewards, notifications, and support chat.",
        "Connected Stripe's payment flow to server-side wallet updates and configured the iOS build in Xcode.",
      ],
      decisions: [
        "Chose Flutter to maintain one UI and codebase across both platforms.",
        "Moved balance changes to Cloud Functions and enforced access through Firebase rules and role-based routing.",
        "Used rotating, server-issued tokens for student ID verification.",
      ],
      learned: [
        "Design permissions and transaction ownership before building role-specific screens.",
        "A rebuild is useful when the product has outgrown its original architecture.",
      ],
      architecture:
        "Flutter + go_router -> student, vendor, and admin screens\nFirebase Auth + Firestore rules -> identity and data access\nCloud Functions -> payments, balance updates, ID verification\nStripe sandbox -> PaymentSheet -> webhook -> wallet update\nFirestore -> users, wallets, transactions, offers, support chats",
      codeDecisions: [
        {
          title: "Request a payment; let the server update the wallet",
          language: "Dart",
          snippet:
            "final result = await FirebaseFunctions.instance\n    .httpsCallable('createStripePaymentIntent')\n    .call<Map<String, dynamic>>({'amount': amount});\n\n// Present Stripe PaymentSheet with the returned client secret.\n// The webhook updates the wallet after payment verification.",
          why: "The app presents the payment flow; secret keys and balance writes stay on the server. Payments are demonstrated in sandbox mode.",
        },
      ],
    },
  },
  {
    slug: "scheduleai",
    name: "ScheduleAI",
    tagline:
      "An AI-assisted planner that turns scheduling preferences into a timetable and checks for conflicts.",
    year: "2026",
    featured: true,
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "Firebase"],
    repo: "https://github.com/harshvk8/ScheduleAi",
    demo: "https://schedule-ai-eta.vercel.app",
    embedDemo: "https://schedule-ai-eta.vercel.app",
    caseStudy: {
      overview:
        "I built ScheduleAI to make planning around availability, classes, and preferences easier. A conversational interface captures what the user needs, while scheduling logic checks proposed times for conflicts.",
      contributions: [
        "Built the planning interface and reusable scheduling constraints and validators.",
        "Connected timetable updates with calendar features.",
        "Deployed the app and resolved configuration, DNS, and OAuth issues.",
      ],
      decisions: [
        "Separated conversational input from schedule validation so an AI response does not decide whether a timetable is valid.",
        "Reused scheduling logic across the app's different user flows.",
      ],
      learned: [
        "Clear validation matters when several scheduling constraints interact.",
        "Deployment requires testing configuration and failure states as well as the interface.",
      ],
      architecture:
        "User preferences -> structured constraints\nScheduling logic -> placement, validation, conflict detection\nTimetable state -> planner and calendar features\nNext.js + React -> interface\nFirebase + Vercel -> data and deployment",
    },
  },
  {
    slug: "today-only-todo",
    name: "TodayOnlyToDo",
    tagline: "An offline Android to-do app that keeps the focus on today's tasks.",
    year: "2026",
    featured: false,
    stack: ["Kotlin", "Jetpack Compose", "MVVM"],
    repo: "https://github.com/harshvk8/TodayOnlyToDo",
    caseStudy: {
      overview:
        "I built a small to-do app around one rule: focus on today. Tasks are stored locally, survive app restarts, and clear when the app detects a new day.",
      contributions: [
        "Built task entry, completion, and local persistence in Kotlin and Jetpack Compose.",
        "Kept date checks and storage separate from the UI using MVVM.",
      ],
      decisions: [
        "Kept the app offline, with no account or synchronization required.",
        "Removed the permanent backlog so each day starts with a fresh list.",
      ],
      learned: [
        "A focused product rule can be more useful than a larger feature list.",
        "Date changes and app restarts need clear, predictable behavior.",
      ],
      architecture:
        "Compose UI -> ViewModel -> local task storage\nTask data: text, completion state, date\nOn launch: check the stored date and clear older tasks",
    },
  },
  {
    slug: "goplus-research",
    name: "Go vs Go+ Research",
    tagline: "A comparison of Go and Go+ syntax, readability, and development effort.",
    year: "2026",
    featured: false,
    stack: ["Go", "Go+", "Comparative analysis"],
    caseStudy: {
      overview:
        "I compared Go and Go+ to understand how higher-level syntax changes the code developers write. The study focused on readability, development effort, and potential uses in education, scripting, and prototyping.",
      contributions: [
        "Compared representative programs and language features using consistent criteria.",
        "Examined lambda expressions, list comprehensions, and boilerplate alongside ecosystem limitations.",
      ],
      decisions: [
        "Focused on readability and development effort instead of treating runtime speed as the only measure.",
        "Considered tooling and library support alongside syntax differences.",
      ],
      learned: [
        "Shorter syntax can help, but it does not automatically make a language the better choice.",
        "A useful comparison connects language features to specific tasks and users.",
      ],
      architecture:
        "Representative task -> Go and Go+ implementations\nCompare -> readability, code length, control flow, error handling\nRecord separately -> tooling, documentation, library support",
      codeDecisions: [
        {
          title: "Expressing the same transformation in each language",
          language: "Go / Go+",
          snippet:
            "// Go\nout := make([]int, 0, len(xs))\nfor _, x := range xs {\n  if x%2 == 0 {\n    out = append(out, x*x)\n  }\n}\n\n// Go+\nout := [x*x for x <- xs, x%2 == 0]",
          why: "This example illustrates the syntax difference. It is not evidence of a runtime performance improvement.",
        },
      ],
    },
  },
  {
    slug: "this-portfolio",
    name: "This Portfolio",
    tagline:
      "A developer portfolio with concise project stories, an optional 3D view, and an AI scheduling assistant.",
    year: "2026",
    featured: true,
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "Tailwind CSS",
      "React Three Fiber",
      "Zod",
      "Claude (Anthropic API)",
      "Vercel",
    ],
    repo: "https://github.com/harshvk8/harshvardhan-portfolio",
    demo: "https://harshvardhannimesh.com",
    caseStudy: {
      overview:
        "I built this portfolio to explain my work and make it easy to contact me. It offers a straightforward Recruiter view, an interactive 3D Explore view, and an assistant for requesting a call based on my configured availability.",
      contributions: [
        "Built reusable pages and components with Next.js, TypeScript, and Tailwind CSS.",
        "Created the 3D project view and linked skill descriptions to examples of my work.",
        "Built a scheduling flow that interprets preferences, generates time slots, and emails meeting requests.",
      ],
      decisions: [
        "Kept a conventional layout available alongside the 3D experience.",
        "Validated project content with Zod and separated AI interpretation from slot generation.",
        "Added rate limiting when Redis is configured and input checks for the public scheduling endpoints.",
      ],
      learned: [
        "A portfolio needs to make the work easy to understand and explore.",
        "An AI feature needs clear boundaries, honest status messages, and useful error handling.",
      ],
      architecture:
        "Next.js pages -> shared content validated with Zod\nView preference -> Recruiter layout or React Three Fiber scene\nScheduling message -> model extracts preferences\nSlot engine -> times from configured availability\nSelected time -> validation -> meeting request email\n\nRequests do not reserve calendar slots; confirmation is handled separately.",
      codeDecisions: [
        {
          title: "Generate available slots outside the model",
          language: "TypeScript",
          snippet:
            "const all = generateSlots(schedulingConfig, new Date());\nconst result = filterSlots(schedulingConfig, all, constraints);\nconst slots = result.slots;",
          why: "The model extracts preferences. The slot engine uses the availability configuration to produce suggestions; it does not check a live calendar.",
        },
      ],
    },
  },
];
