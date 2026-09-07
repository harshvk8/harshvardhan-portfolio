import type { ProjectInput } from "./schema";

/**
 * Real projects. Facts (names, stacks, features, repo/demo links, function
 * and class names) come from the résumé + the GitHub repos. The reasoning
 * prose — observation, question, decision, learned — is Harshvardhan's own.
 *
 * Open:
 *  - today-only-todo: the observation / learned framing was written after
 *    the fact; confirm it matches the original reasoning.
 *  - a few `options` / `why` lines are still editorial, not direct quotes.
 */
export const projectsData: ProjectInput[] = [
  {
    slug: "red-hawk-wallet-android",
    name: "Red Hawk Wallet (Android)",
    tagline:
      "Campus ID, balances, events, and offers lived in separate places — one Android app to hold them together.",
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
      problem:
        "A Montclair State student's campus life is split across separate tools: a plastic Red Hawk ID for building access and meal swipes, no easy way to check the Red Hawk Dollars / Flex / Bonus / meal-swipe balances tied to it, and paper flyers for events and offers. Each piece is handled somewhere different.",
      observation:
        "A lot of campus experience is split across different places — student ID, events, offers, other student services. That made me want to see what a single student-focused app could look like instead of treating each feature as its own separate tool.",
      question:
        "Could we build one student-focused app that brings useful campus features together while still keeping authentication, user data, and access control properly separated?",
      userNeed:
        "Students need one place for the four balances, a digital ID a staff member can verify, and campus events and offers — with authentication, user data, and access control kept separate so features don't quietly inherit each other's permissions.",
      constraints: [
        "Six-person team — work had to split by feature so people weren't editing the same files",
        "Registration gated behind email verification; protected features must stay unreachable until verified",
        "Student project — no backend budget, so Firebase's free tier for auth, database, and storage",
        "A payment-shaped feature: a balance and its transaction history must never disagree",
      ],
      options: [
        {
          option: "Native Android (Kotlin + Jetpack Compose)",
          tradeoff:
            "Direct platform experience and no cross-platform layer; Android-only, and the UI isn't reusable for an iOS build later",
        },
        {
          option: "React Native / Expo",
          tradeoff:
            "One codebase for both platforms, but adds a cross-platform layer and native-module work for NFC and the camera",
        },
        {
          option: "A responsive web app",
          tradeoff: "No install, but no real NFC tap and a weaker digital-ID story",
        },
      ],
      decision:
        "I used native Android with Kotlin and Jetpack Compose because this version was specifically an Android build and I wanted direct experience with the platform rather than introducing cross-platform complexity. Firebase gave us authentication, Firestore, and storage without requiring a separate backend for every feature. With six people on the project, I split work by feature branch and kept authentication, data, and UI responsibilities organized so features could move without everyone editing the same files.",
      architecture:
        "Auth (Firebase) — register sends an email verification\n  AppNav splash guard, checked on every launch and after login:\n    no user -> Login | user not verified -> Email-verification screen | verified -> Dashboard  (back stack cleared)\n\nCompose screen -> ViewModel -> Repository -> FirestoreDataSource -> Firestore\n  one repository per area (Wallet, Transaction, User, Event, Offer, Notification);\n  FirestoreDataSource is the only class that knows collection names + query shapes\n\nFirestore\n  users/{uid}                 profile + ID photo ref (photo bytes in Firebase Storage)\n  wallets/{uid}               redHawkDollars | flex | bonus | mealSwipes   (stored balances)\n  users/{uid}/transactions/*  append-only history\n  events / offers             campus + off-campus\n\nPay path (tapAndPay / tapAndPayWithToken) runs inside one Firestore transaction:\n  check balance -> deduct the account field -> write the transaction record, all-or-nothing\n\nDigital ID: generated QR -> professor scanner screen -> student-verification result\nOffline tap-to-pay: pre-issued signed OfflineTokens (amount cap + expiry), held in\n  EncryptedSharedPreferences as available / used sets, spent over NFC, redeemed server-side",
      challenges: [
        {
          challenge:
            "Designing the verification and access flow so protected features (wallet, digital ID) couldn't be reached before a user was verified — including through back-navigation or a deep link, not just the normal path.",
          initialApproach:
            "Guard each protected screen individually — check verification state where the screen is built.",
          problem:
            "That spreads the same check across every screen and treats the screen as the boundary. It's easy to add a new screen and forget the check, or leave a navigation path open.",
          decision:
            "Put the check in the navigation layer, in one place, ahead of the protected screens.",
          finalSolution:
            "The splash/auth guard resolves auth + verification state on every entry and picks the destination: no user -> Login; user but not verified -> the Email-verification screen (with resend); verified -> Dashboard. The back stack is cleared so there's no route back into the protected tree.",
          result:
            "Access is decided once, in front of the protected screens, instead of re-checked on each one — so there isn't a screen reachable in the wrong state.",
        },
      ],
      codeDecisions: [
        {
          title: "Only the money path is wrapped in a Firestore transaction",
          language: "kotlin",
          snippet:
            '// pay: read balance, deduct, log — all-or-nothing\nfirestore.runTransaction { txn ->\n  val wallet = txn.get(walletRef).toObject<Wallet>()!!\n  require(wallet.balanceFor(account) >= amountCents) { "insufficient" }\n  txn.update(walletRef, account.field, wallet.balanceFor(account) - amountCents)\n  txn.set(txRef, Transaction(delta = -amountCents, at = now()))\n}\n\n// loading events, listing past transactions: plain setDocument() / get() — no transaction',
          why: "Balances are stored fields, not derived, so a deduction and its history entry can drift if one write fails. Wrapping just tapAndPay / tapAndPayWithToken in runTransaction makes that pair atomic; everything else is a normal read/write and doesn't pay the cost.",
        },
        {
          title: "Offline tap-to-pay uses pre-issued signed tokens, not a live balance check",
          language: "kotlin",
          snippet:
            "data class OfflineToken(\n  val tokenId: String,     // UUID\n  val userId: String,\n  val amountCents: Long,    // spend cap\n  val issuedAt: Long,\n  val expiresAt: Long,     // short TTL\n  val signature: String,   // server-signed (mock for now)\n)\n// EncryptedSharedPreferences: available_tokens / used_tokens\n// spend: move available -> used, send over NFC; a server call redeems it against the real balance",
          why: "The token carries its own guardrails — a fixed amount, a short expiry, and a signature to check — so a payment can be authorised on the device and reconciled against the real balance when it's redeemed server-side. Whatever a token can spend is capped and time-boxed, so the exposure from a lost or copied token is bounded.",
        },
      ],
      learned: [
        "Authentication isn't finished just because a user can log in — protected features still need explicit authorization and verification checks.",
        "Shared data models have to be agreed on early when several developers are building features against the same Firebase database.",
        "Feature branches and pull requests work much better when everyone understands where one feature's responsibilities end and the next begins.",
        "Building wallet-related features made me think more carefully about which state the client should be allowed to control and which state needs stronger validation.",
      ],
    },
  },

  {
    slug: "red-hawk-wallet-flutter",
    name: "Red Hawk Wallet (Flutter)",
    tagline:
      "The Android build was student-only, Android-only, and trusted the client with money. The rebuild is a three-sided campus marketplace — student, vendor, admin — on iOS and Android.",
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
      problem:
        "The Kotlin Red Hawk Wallet worked, but it had three ceilings. It ran on Android only, so students on iPhone couldn't install it. Its tap-to-pay was simulated, with a client-side Firestore transaction doing the debit, which meant the app was trusted to move money. And it was student-only: no vendor or admin side, so it couldn't function as a campus commerce platform.",
      observation:
        "As Red Hawk Wallet grew past a student-facing prototype, I realized I wasn't building one simple app anymore. Student, vendor, and administrator roles had different permissions, and anything touching balances or transactions couldn't be treated like ordinary client-side state.",
      question:
        "How could I rebuild the app so three different user roles could share one product while keeping permissions, transactions, and data ownership clear?",
      userNeed:
        "iOS and Android students need one wallet: add money, pay a vendor by scanning a QR, show a student ID, collect points. Vendors need to request and receive payments and run redemptions. Admins need to approve vendors and see transactions, users, and reports.",
      constraints: [
        "One codebase for iOS + Android, with a real iOS build (entitlements, signing) done through Xcode",
        "Clients must never write a balance — money moves server-side only",
        "Reuse Firebase (Auth, Firestore, Storage); add Cloud Functions + Stripe",
        "Three roles in one app, without one role reaching another's screens",
      ],
      options: [
        {
          option: "Kotlin Multiplatform — share logic, native UI per platform",
          tradeoff: "Native UI on each platform, but still two UI layers and a newer toolchain",
        },
        {
          option: "Flutter — one Dart codebase, one UI toolkit, both platforms",
          tradeoff:
            "One codebase and one consistent UI architecture; the whole UI is re-implemented in Dart once",
        },
        {
          option: "React Native",
          tradeoff:
            "Ecosystem and web-skill overlap, but more native-module friction for the camera and payment SDKs",
        },
      ],
      decision:
        "I chose Flutter because I wanted one codebase for Android and iOS and I already had experience building with Flutter and Firebase. For this project and team size, development speed and one consistent UI architecture mattered more than maintaining separate platform implementations. I didn't choose Flutter because Kotlin Multiplatform or React Native are incapable — it was the best fit for what I could build and maintain efficiently.",
      architecture:
        "One binary, three role UIs (role on the user doc; enforced by firestore.rules and the router):\n  STUDENT  wallet, add money, pay / send / receive, QR student ID, QR scanner,\n           transactions, points & rewards, offers + redemption, events, notifications, support chat\n  VENDOR   dashboard, create payment request, QR payment, redemption scanner,\n           sales reports, offers, transactions, profile — gated behind an approval flow (/vendor/waiting)\n  ADMIN    approve vendors, manage users / vendors / transactions / events / offers,\n           reports, reported issues, support-chat inbox\n\nmain.dart: init Firebase, Stripe (publishable key), push notifications -> RedHawkWalletApp\n\ngo_router — one redirect function:\n  not logged in           -> /login               (legal routes always allowed)\n  logged in, unverified   -> /email-verification\n  role mismatch           -> /home | /vendor | /admin    (cross-role access blocked)\n  vendor not approved     -> /vendor/waiting ;   suspended -> auto sign-out\n  refreshListenable = auth ChangeNotifier\n\nMoney path — server-side only:\n  add funds  -> CF createStripePaymentIntent -> Stripe PaymentSheet -> webhook confirmStripePayment credits wallet\n  pay vendor -> CF processPayment (student -> approved vendor) -> writes the transactions doc\n  firestore.rules: clients cannot edit a balance field\n\nQR payloads (qr_payloads.dart), all server-verified:\n  receive     redhawkwallet:receive:{uid}\n  student ID  redhawkwallet:studentid:{token}     token minted by CF issueStudentIdToken, rotates — not the uid\n  redeem      redhawkwallet:redeem:{offerId}:{uid} -> offers/{offerId}/redemptions/{uid}, verifyOfferRedemption\n\nFirestore: users/{uid}, wallets/{uid} { balance, points, updatedAt }, transactions, vendors, offers, events, support chats\nUniversity gate: UniversityEmailValidator — montclair.edu, or *.edu / *.ac.uk / *.edu.au",
      challenges: [
        {
          challenge:
            "The Android build let the client perform the debit itself, inside a Firestore transaction.",
          initialApproach: "Carry that over — do the balance change on-device, just in Dart.",
          problem:
            "A client-side debit means the app is trusted with money. Rules can narrow that, but the real fix is for the client to never touch a balance at all.",
          decision: "Move the entire money path to the server.",
          finalSolution:
            "payVendor calls a processPayment Cloud Function; add-funds goes through createStripePaymentIntent plus a Stripe webhook; firestore.rules rejects every client write to a balance field. The app can request a payment and read the result — it can't move money.",
          result:
            "Balance changes are atomic and server-authoritative, and the client is no longer inside the trust boundary for money.",
        },
        {
          challenge: "A digital-ID QR that encodes the user's uid can be screenshotted and reused.",
          initialApproach: "Put redhawkwallet:studentid:{uid} in the QR, like the receive code.",
          problem: "That's a static credential — anyone who sees it once can present it forever.",
          decision: "Make the ID QR a short-lived, server-minted token, not an identifier.",
          finalSolution:
            "issueStudentIdToken (Cloud Function) mints a rotating token; the QR carries redhawkwallet:studentid:{token}; the scanner resolves it server-side. Receive and redeem QRs stay static because they only work with a server check anyway.",
          result:
            "A screenshot of an ID QR goes stale; identity always resolves through the server.",
        },
        {
          challenge:
            "Three roles — student, vendor, admin — but one app, and a vendor must not be able to reach admin screens (or vice versa).",
          initialApproach: "Ship separate builds, or hide the other roles' screens in the UI.",
          problem:
            "Separate builds triple the release work; hiding screens in the UI isn't a security boundary — the routes still exist and Firestore is still one database.",
          decision: "One binary; role is data, and it's enforced in the two places that matter.",
          finalSolution:
            "Role lives on the user doc. firestore.rules scope every read/write by role (a vendor can't read another vendor's sales; only an admin can flip approval). The go_router redirect sends each role to its own tree and blocks cross-role paths, with an approval gate for new vendors and auto-logout for suspended accounts. The UI just renders whatever the router allows.",
          result:
            "Adding an admin screen is a route plus a rules clause, not a new app. The role boundary holds even if someone hand-types another role's URL.",
        },
      ],
      codeDecisions: [
        {
          title: "Adding funds: PaymentIntent created server-side, wallet credited by webhook",
          language: "dart",
          snippet:
            "// the client asks a Cloud Function for a PaymentIntent — it never sees Stripe secret keys\nfinal res = await _functions\n    .httpsCallable('createStripePaymentIntent')\n    .call<Map<String, dynamic>>({'amount': amount});\nawait Stripe.instance.initPaymentSheet(/* clientSecret: res.data['clientSecret'] */);\nawait Stripe.instance.presentPaymentSheet();\n// the wallet is credited later, by the confirmStripePayment webhook — not here",
          why: "The Stripe secret and the balance write both stay on the server. The app only presents Stripe's sheet and waits; the webhook is the single source of truth for 'the money arrived', so a client that dies mid-flow can't leave the wallet wrong.",
        },
      ],
      beforeAfter: [
        {
          aspect: "Platform, payments, and scope",
          before:
            "Android only (Kotlin + Jetpack Compose). Simulated NFC tap-to-pay with a client-side Firestore transaction. Student-only.",
          after:
            "One Flutter codebase on iOS (entitlements + signing via Xcode) and Android. QR payments; real card top-ups via Stripe; every balance change in a Cloud Function with firestore.rules blocking client writes. Student, vendor, and admin in one app.",
          reason:
            "The payment model had to be redesigned rather than copied: once the app involved multiple roles and real wallet state, balance changes couldn't be something the client just updates. The transaction had to be authoritative first, with the UI reflecting the result — not the UI as the source of truth.",
        },
      ],
      learned: [
        "I started with service classes for business / Firebase logic and ChangeNotifier only where the UI actually needed reactive state. That kept the architecture understandable for a small team and avoided pulling in a large state-management framework before we needed one. At ~60 screens it was still workable, but the manual wiring made the trade-off visible; if the app grows much further I'd re-evaluate something like Riverpod rather than defend the original choice forever.",
        "Rebuilding a project is worth it when the architecture no longer matches the product — rewriting just for newer technology isn't.",
        "Role-based apps get much easier to reason about when the authorization rules are designed before the screens.",
        "Anything that represents money needs a clear source of truth outside the UI.",
        "Simple architecture is valuable, but 'simple' doesn't mean refusing to change it once the app outgrows it.",
      ],
    },
  },

  {
    slug: "scheduleai",
    name: "ScheduleAI",
    tagline:
      "Scheduling looks simple until the constraints interact — and then a timetable can look valid while it isn't.",
    year: "2026",
    featured: true,
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "Firebase"],
    repo: "https://github.com/harshvk8/ScheduleAi",
    demo: "https://schedule-ai-eta.vercel.app",
    caseStudy: {
      problem:
        "Every semester, students rebuild a timetable by hand: preferred times, which professor, no clashes, requirements met. It's a constraint problem solved with a spreadsheet and trial and error, and one missed conflict often isn't caught until it's too late to change sections.",
      observation:
        "Scheduling looks simple until several constraints interact — availability, conflicts, invalid inputs, and different preferences can quickly produce a schedule that looks valid but isn't.",
      question:
        "Could I make scheduling conversational and easy for the user while keeping the actual scheduling rules deterministic and reliable?",
      userNeed:
        "A student needs to state preferences conversationally, trust that the result has no time clashes and respects the hard rules, and sync it to a calendar they already use. Separately, administrators want anonymised demand data to plan how many sections to open.",
      constraints: [
        "Solo build; frontend-first prototype",
        "Scheduling logic has to be explainable — a student should see why a slot was rejected",
        "Free hosting (Vercel)",
        "One core serving three audiences: general users, students, administrators",
      ],
      options: [
        {
          option: "Let the model produce the whole schedule directly",
          tradeoff:
            "Fast to demo, but no guarantee the output is conflict-free or respects hard constraints, and no explanation for what it did",
        },
        {
          option:
            "Model extracts constraints; a rule-based engine builds and validates the schedule",
          tradeoff:
            "More to build, but the timetable is verifiably valid and the model only does the part it's good at — understanding the sentence",
        },
      ],
      decision:
        "The model's job stops at turning messages into structured constraints. A rule-based layer does placement, validation, and conflict detection, so every schedule returned is provably free of time clashes and honours the hard rules. The conversation is the interface; correctness is not the model's responsibility. Object-oriented constraint and validator types are reusable across the general-user, student, and admin modes.",
      architecture:
        "Chat message\n  --> extract structured constraints { times, days, professors, hard vs soft }\n  --> rule engine: place courses, run conflict detection, reject on overlap or hard-rule break\n  --> timetable state (updates continuously — no separate 'generate' step)\n        --> Google Calendar / in-app calendar sync\n        --> admin view: anonymised, aggregated demand",
      learned: [
        "Building and deploying it pushed me to separate the conversational experience from the rules that decide whether a schedule is valid. Input validation and conflict detection have to stay predictable even if a model is eventually doing the understanding.",
        "Deployment made configuration, failure states, and validation matter far more than they do when an app only runs locally.",
        "Planned for Phase 3, not yet built: connect ScheduleAI to this portfolio's contact page so a recruiter can talk through meeting times before sharing personal contact details — a model handles the conversation, the scheduling logic stays responsible for checking availability and conflicts.",
      ],
    },
  },

  {
    slug: "today-only-todo",
    name: "TodayOnlyToDo",
    tagline: "Most to-do apps become a permanent backlog you scroll past for weeks.",
    year: "2026",
    featured: false,
    stack: ["Kotlin", "Jetpack Compose", "MVVM"],
    repo: "https://github.com/harshvk8/TodayOnlyToDo",
    // NOTE: the observation / learned below is Harshvardhan's framing, written
    // now — confirm it matches the original reasoning before treating as history.
    caseStudy: {
      problem:
        "A to-do list that keeps everything turns into a list you stop reading. Last week's unfinished items sit at the bottom, and nothing gets done because the list itself is discouraging.",
      observation:
        "I wanted a to-do app that didn't turn into another permanent backlog. The 'today only' rule forces me to decide what actually matters now instead of endlessly moving unfinished tasks forward.",
      question:
        "What if the list simply couldn't hold yesterday — a clean slate every morning, with 'today' as the only scope?",
      userNeed:
        "Someone needs to capture what they'll do today, check it off, and start tomorrow fresh — with no sync, no account, and it working with no signal.",
      constraints: [
        "Small solo project",
        "Fully offline — no network at all",
        "Local persistence that survives app restarts but clears on a new day",
      ],
      options: [
        {
          option: "A normal persistent to-do list with a 'today' filter",
          tradeoff:
            "Familiar, but the backlog still exists and still weighs on you — the filter is cosmetic",
        },
        {
          option: "Hard-scope to today: previous days clear automatically",
          tradeoff: "Opinionated and loses history, but the constraint is the entire point",
        },
      ],
      decision:
        "Hard-scope to today. Tasks persist locally (offline, survive restarts), but the view only ever shows the current date, and a date check on launch clears anything older. MVVM keeps the date logic, storage, and UI state separated so the 'what day is it' rule lives in one place.",
      architecture:
        "Add task --> local store { text, done, date = today }\nApp launch --> if stored date < today: clear --> fresh list\nView --> tasks where date == today, offline, no network",
      learned: [
        "Removing features can be a product decision too — a deliberately restrictive rule ('today only') creates clearer behaviour than giving the user unlimited flexibility.",
      ],
    },
  },

  {
    slug: "goplus-research",
    name: "Go vs Go+ Research",
    tagline:
      "Go+ layers higher-level syntax on Go's compiler and runtime — does that actually reduce what a developer writes, or is it cosmetic?",
    year: "2026",
    featured: false,
    stack: ["Go", "Go+", "Comparative analysis"],
    caseStudy: {
      problem:
        "Go+ takes Go's compiler, runtime, and single-binary deployment and layers higher-level syntax on top — lambdas, list comprehensions, lighter boilerplate. The question worth studying is whether that actually reduces how much a developer has to write and reason about, or whether it's cosmetic.",
      observation:
        "Go is intentionally simple, but I wanted to understand what happens when a language keeps the Go ecosystem and performance-oriented foundation while adding higher-level features like lambda expressions, list comprehensions, and simplified syntax.",
      question:
        "Does Go+ meaningfully reduce the amount and complexity of code developers write compared with Go, and where would those differences actually be useful?",
      userNeed:
        "Educators need a language students can be productive in quickly without dropping them off a cliff later. People doing scripting and rapid prototyping need to move fast. Both want a path that doesn't dead-end when the work turns into real systems code.",
      constraints: [
        "A comparison is only useful with objective, repeatable criteria — not 'this feels nicer'",
        "Go+ is young: smaller ecosystem, fewer libraries, less documentation",
        "Scope to representative tasks rather than survey the whole language",
      ],
      options: [
        {
          option: "Micro-benchmark raw runtime performance Go vs Go+",
          tradeoff:
            "Clean numbers, but Go+ compiles through Go — the runtime story is nearly identical, so it answers the wrong question",
        },
        {
          option:
            "Compare language features and their effect on readability and development effort",
          tradeoff:
            "Measures the thing that actually differs — the human side — but needs care to keep the criteria consistent",
        },
        {
          option: "Survey ecosystem maturity and library coverage",
          tradeoff:
            "Important for real adoption, but a moving target and less about the language design claim",
        },
      ],
      decision:
        "I approached it as a comparative programming-language study rather than trying to argue one language is universally better. I compared language features and their effect on readability, development effort, and potential use cases like education, scripting, and rapid prototyping.",
      architecture:
        "Comparison framework:\n  Task set: small representative programs (data transforms, file/CLI scripts, prototypes)\n    --> implement each in idiomatic Go and in Go+\n    --> compare: readability, lines and control-flow constructs, error-handling ceremony, concepts to learn\n  Use cases: education | scripting | rapid prototyping\n  Held constant: compiler, runtime, single-binary deployment\n  Recorded separately: ecosystem / library gaps",
      codeDecisions: [
        {
          title: "Where the syntax difference actually shows up",
          language: "go",
          snippet:
            "// Go: transform a slice\nout := make([]int, 0, len(xs))\nfor _, x := range xs {\n  if x%2 == 0 {\n    out = append(out, x*x)\n  }\n}\n\n// Go+: list comprehension\nout := [x*x for x <- xs, x%2 == 0]",
          why: "The two programs do the same work and compile the same way, but the Go+ version has fewer moving parts to get right. Across many small programs, that difference in what a reader has to track adds up.",
        },
      ],
      learned: [
        "Language design is mostly about trade-offs — higher-level syntax makes common operations shorter and more approachable, but a language's value also depends on ecosystem, tooling, adoption, and the kind of software being built.",
        "Go+ was interesting because it tries to make Go-style development more accessible without cutting itself off from the Go ecosystem.",
      ],
    },
  },
];
