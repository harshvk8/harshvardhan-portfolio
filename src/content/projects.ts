import type { ProjectInput } from "./schema";

/**
 * PLACEHOLDER CONTENT — replace with real projects in Phase 1.
 *
 * Every entry is parsed against `projectSchema` in `index.ts` at load time,
 * so the build fails if a case study is missing a required section. Keep the
 * shape; swap the words. `challenges`, `codeDecisions`, and `beforeAfter` are
 * optional — the two featured entries below fill them in to show the full
 * template; the others stay minimal.
 */
export const projectsData: ProjectInput[] = [
  {
    slug: "campus-marketplace",
    name: "Campus Marketplace",
    tagline: "Students on campus had no safe, fast way to buy and sell used gear.",
    year: "2025",
    featured: true,
    stack: ["Flutter", "Dart", "Firebase", "Cloud Functions"],
    repo: "https://github.com/harshvk8/campus-marketplace",
    caseStudy: {
      problem:
        "Every semester, students buy textbooks, cycles, and hostel furniture, then struggle to resell them a few months later. The listings that did exist were scattered across three different chat groups with no search, no photos, and no way to tell whether a seller was actually a student.",
      observation:
        "I watched the same items get posted, buried under other messages within the hour, and reposted days later. Buyers were messaging ten sellers to find one who hadn't already sold the item.",
      question:
        "What would it take to give one campus a single, trusted place to list an item in under a minute and find one in a few taps?",
      userNeed:
        "Students need: a listing flow fast enough to use between classes, confidence that the other person is a verified student, and a way to filter by category and price instead of scrolling a chat log.",
      constraints: [
        "Solo build, roughly six weeks around coursework",
        "Must verify that users belong to the campus",
        "Near-zero hosting budget",
        "Most users on mid-range Android phones and patchy campus Wi-Fi",
      ],
      options: [
        {
          option: "Custom REST backend (Node + PostgreSQL) on a small VPS",
          tradeoff:
            "Full control over data and queries, but auth, storage, image handling, and ops all had to be built and paid for before the first listing existed",
        },
        {
          option: "Firebase (Auth + Firestore + Storage + Functions)",
          tradeoff:
            "Auth, image storage, and offline sync work out of the box on a free tier; the cost is Firestore's query model and vendor lock-in",
        },
        {
          option: "No app — a better-structured web form + spreadsheet",
          tradeoff:
            "Shippable in a weekend, but no real search, no image handling, and no identity — the same problems in a new place",
        },
      ],
      decision:
        "I built on Firebase. Email-domain-restricted Auth gave campus verification for free, Storage handled listing photos, and Firestore's offline cache meant the app stayed usable on bad Wi-Fi. A Cloud Function stamped each listing with a normalised category and lowercase search field so the client could do prefix search without a separate search service. The trade-off I accepted: model the data around the two or three queries the UI actually needs, rather than a general-purpose schema.",
      architecture:
        "Auth (campus email domain)\n  --> User profile (Firestore: /users/{uid})\n        --> Listing (Firestore: /listings/{id}, denormalised sellerName + searchKey)\n              --> Photos (Storage: /listings/{id}/*)\n              --> onCreate Cloud Function: validate, set category + searchKey, notify saved searches\n        --> Chat thread (Firestore: /threads/{buyer_seller_listing})",
      challenges: [
        {
          challenge: "Search returned nothing for obvious queries.",
          initialApproach:
            "Query Firestore with where('title', '>=', term) directly against the raw title field.",
          problem:
            "Case sensitivity and word order meant 'physics textbook' never matched 'Textbook - Physics'. Firestore has no full-text search and can't do contains queries.",
          decision:
            "Move normalisation server-side instead of asking every client to get it right.",
          finalSolution:
            "A Cloud Function writes a lowercase, punctuation-stripped `searchKey` array of title tokens on create/update; the client queries with array-contains on a single lowercased term.",
          result:
            "Prefix search became predictable and index-backed, and the client code got simpler because it stopped trying to massage the query.",
        },
        {
          challenge: "First image upload on a fresh install often failed silently.",
          initialApproach:
            "Upload the photo and write the Firestore listing document in parallel to feel fast.",
          problem:
            "On a cold start the Storage SDK sometimes wasn't ready; the listing doc was written pointing at a photo path that didn't exist yet, and the UI showed a broken card.",
          decision: "Treat the photo as a precondition for the listing, not a sibling of it.",
          finalSolution:
            "Await the upload, then write the document with the real download URL; show an explicit progress state while it runs.",
          result:
            "Broken listings dropped to zero and the perceived speed was fine once there was a real progress indicator.",
        },
      ],
      codeDecisions: [
        {
          title: "Listings are read through a repository, not Firestore calls in widgets",
          language: "dart",
          snippet:
            "abstract class ListingRepository {\n  Stream<List<Listing>> browse({Category? category, PriceRange? price});\n  Future<Listing> create(NewListing draft);\n}\n\n// UI depends on ListingRepository; FirebaseListingRepository is the only\n// place that knows about collection names, searchKey, or query limits.",
          why: "It kept Firestore's query quirks in one file, made the browse screen testable with a fake repository, and means a later move off Firestore touches one class instead of every screen.",
        },
      ],
      beforeAfter: [
        {
          aspect: "Creating a listing",
          before:
            "A five-field form on one screen, submitted at the end — people abandoned it when the photo step failed.",
          after:
            "Three quick steps (photos, details, price) with the photo resolved first and progress shown; drafts persist if you leave.",
          reason:
            "Watching first-time users, the drop-off was almost entirely at a silent photo failure near the end.",
        },
      ],
      learned: [
        "Designing the data around the exact queries the screen needs — instead of a 'clean' general schema — made the whole app simpler, not just faster.",
        "A visible progress state changed how fast the same upload felt more than any real speed-up did.",
        "Putting one integration (Firestore) behind a repository interface early cost an hour and saved days of coupling.",
      ],
    },
  },

  {
    slug: "shift-swap",
    name: "ShiftSwap",
    tagline: "Part-time staff traded shifts over text, and managers found out too late.",
    year: "2024",
    featured: true,
    stack: ["Next.js", "TypeScript", "PostgreSQL", "Prisma"],
    repo: "https://github.com/harshvk8/shift-swap",
    demo: "https://shift-swap-demo.vercel.app",
    caseStudy: {
      problem:
        "At a campus café, staff who couldn't make a shift found their own cover in a group chat. Managers only learned about a swap when the wrong person showed up, and there was no record of who had actually agreed to what.",
      observation:
        "The swap almost always happened — people are good at covering for each other — but the schedule of record never changed, so the printed rota and reality drifted apart within a week.",
      question:
        "Could a swap be as easy as the group chat while still ending with an approved, updated schedule?",
      userNeed:
        "Staff need to offer a shift and see who picked it up. Managers need a swap to be a request they approve in one tap, with the schedule updating itself once they do.",
      constraints: [
        "Roughly one shift per week of build time over a term",
        "Two clear roles with different permissions",
        "Had to be usable on a phone mid-shift",
        "Free hosting; small, known set of users",
      ],
      options: [
        {
          option: "Firebase again",
          tradeoff:
            "Fast auth and realtime, but the core logic here is relational (shifts, people, swaps, approvals) and I'd be fighting the document model",
        },
        {
          option: "Next.js + PostgreSQL + Prisma on a free tier",
          tradeoff:
            "The relational model and transactional approval fit naturally; the cost is running my own auth and more setup before anything works",
        },
      ],
      decision:
        "Next.js with a Postgres database through Prisma. A swap is a row with a status, and approving it runs one transaction: reassign the shift and close the request together, so the schedule can never be half-updated. Server Actions kept the mutation logic on the server without a separate API layer for a project this size.",
      architecture:
        "Auth (session cookie)\n  --> User (role: STAFF | MANAGER)\n        --> Shift (assignedTo -> User)\n        --> SwapRequest (shift, offeredBy, claimedBy?, status)\n              --> approve(): DB transaction { shift.assignedTo = claimedBy; request.status = APPROVED }\n              --> audit log row",
      challenges: [
        {
          challenge: "Two people could claim the same offered shift.",
          initialApproach:
            "Check 'is this shift still open?' in application code, then write the claim.",
          problem:
            "Two requests a second apart both passed the check before either wrote — a classic race, and now two people thought they had the shift.",
          decision:
            "Let the database enforce the rule instead of hoping the check-then-write stays atomic.",
          finalSolution:
            "A partial unique index allowing only one non-cancelled SwapRequest per shift, plus doing the claim inside a transaction; the second writer gets a constraint error the UI turns into 'already taken'.",
          result:
            "Double-claims became impossible rather than unlikely, and the handling code got shorter.",
        },
      ],
      codeDecisions: [
        {
          title: "Approval is one transaction, not two writes",
          language: "ts",
          snippet:
            "await prisma.$transaction([\n  prisma.shift.update({ where: { id: shiftId }, data: { assignedTo: claimerId } }),\n  prisma.swapRequest.update({ where: { id }, data: { status: 'APPROVED' } }),\n]);",
          why: "If the process dies between the two updates, neither lands. The schedule is either fully swapped or untouched — there's no state where the shift moved but the request still looks open.",
        },
      ],
      beforeAfter: [
        {
          aspect: "Manager's view of swaps",
          before: "A notification saying 'swap approved' with no way to see the history.",
          after:
            "A list of pending requests to approve or decline, and an audit log of every past swap.",
          reason:
            "The first manager to use it immediately asked 'what changed last week and who approved it?' and I had no answer.",
        },
      ],
      learned: [
        "When the invariant matters (one person per shift), pushing it into a database constraint is more reliable and less code than defending it in the application.",
        "'Who did what, when' is not a nice-to-have — it was the first thing the manager asked for.",
        "Choosing the data model to match the problem's shape (relational here) removed a whole category of workarounds.",
      ],
    },
  },

  {
    slug: "readfast",
    name: "ReadFast",
    tagline: "Long articles pile up unread; saving them isn't the same as reading them.",
    year: "2024",
    featured: false,
    stack: ["React", "TypeScript", "IndexedDB", "Vite"],
    repo: "https://github.com/harshvk8/readfast",
    caseStudy: {
      problem:
        "I, and everyone I asked, had a read-later list that only grew. The act of saving felt like progress, so nothing got read.",
      observation:
        "The articles that did get read were the short ones opened immediately. Anything saved for later was effectively saved forever.",
      question:
        "Would showing estimated reading time and surfacing one article at a time change whether the list actually shrinks?",
      userNeed:
        "A reader needs a nudge toward finishing, not a bigger archive: a clear time estimate, a single next item, and offline access for commutes.",
      constraints: [
        "Weekend project scope",
        "No backend — everything local",
        "Must work offline once an article is saved",
      ],
      options: [
        {
          option: "localStorage for saved articles",
          tradeoff:
            "Trivial to use, but a 5MB cap and synchronous API make full-text storage a bad fit",
        },
        {
          option: "IndexedDB via a thin wrapper",
          tradeoff:
            "Async and more setup, but room for article bodies and structured queries by status/'time to read'",
        },
      ],
      decision:
        "IndexedDB, wrapped in a small typed helper. Article text and a computed reading-time estimate are stored on save; the home screen shows exactly one 'read next' pick chosen by shortest time-to-finish.",
      architecture:
        "Save (URL) --> extract readable text --> estimate minutes --> store { article, status, minutes } in IndexedDB\nHome --> query status = 'unread', order by minutes --> show top 1 + count remaining",
      learned: [
        "Framing mattered more than features: 'one article, 4 min left' got things read where a list never did.",
        "Picking IndexedDB over localStorage for the right reason (size + async queries) avoided a rewrite when article bodies went in.",
      ],
    },
  },

  {
    slug: "budget-lens",
    name: "BudgetLens",
    tagline: "Shared house expenses turned into monthly arguments about who owed what.",
    year: "2023",
    featured: false,
    stack: ["Flutter", "Dart", "SQLite"],
    repo: "https://github.com/harshvk8/budget-lens",
    caseStudy: {
      problem:
        "Four of us split rent, utilities, and groceries. Tracking it in a shared note meant month-end was a reconciliation exercise nobody trusted.",
      observation:
        "People remembered what they paid and forgot what others covered, so every total was disputed.",
      question:
        "Can a simple shared ledger make 'who owes whom' obvious at any moment, not just at month end?",
      userNeed:
        "Housemates need to log an expense in seconds, mark who it was for, and see a running settle-up that's the same on everyone's phone.",
      constraints: [
        "Small personal project",
        "Offline-first — logging can't require signal",
        "Simple enough that non-technical housemates would actually use it",
      ],
      options: [
        {
          option: "Cloud database for real-time sync",
          tradeoff:
            "Everyone sees updates instantly, but adds accounts, auth, and a dependency on connectivity",
        },
        {
          option: "Local SQLite + manual export/import",
          tradeoff: "Dead simple and fully offline, but no automatic multi-device sync",
        },
      ],
      decision:
        "Local SQLite with a shareable export. For four housemates in one place, the friction of accounts outweighed the benefit of live sync; a weekly export kept everyone aligned and the app stayed usable with no signal.",
      architecture:
        "Expense (amount, paidBy, splitAmong[], date) --> SQLite\nBalances view = sum(paid) - sum(owed share) per person\nExport = serialise ledger to a shareable file for the next sync",
      learned: [
        "Matching the solution to the actual group size stopped me from over-building sync nobody needed.",
        "The feature that earned trust was showing the running balance continuously, not any clever splitting maths.",
      ],
    },
  },
];
