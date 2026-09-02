import type { ProjectInput } from "./schema";

/**
 * Real projects (résumé + GitHub).
 *
 * FACTS are real: names, stacks, features, repo/demo links.
 * REASONING PROSE is a DRAFT — `observation`, `question`, `options`,
 * `challenges`, `learned`, and the "Why" lines. It's grounded in the facts
 * but written by an assistant. Rewrite it in your own voice, from what you
 * actually remember deciding, before you deploy. Lines starting "TODO" or
 * "Draft:" are the ones that most need your words.
 *
 * Still needed from you:
 *  - Red Hawk Wallet (Flutter): confirm the `decision` paragraph is how you'd
 *    put it, and fill the `beforeAfter.reason` / state-management `learned` line.
 *  - the Go+ research write-up link, if one exists
 *  - confirm project dates
 */
export const projectsData: ProjectInput[] = [
  {
    slug: "red-hawk-wallet-android",
    name: "Red Hawk Wallet (Android)",
    tagline:
      "A Montclair student carries a plastic ID, can't check their meal-swipe balance, and hears about campus events from flyers.",
    year: "2025 – 2026",
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
        "A Montclair State student carries a plastic Red Hawk ID for building access and meal swipes, has no quick way to see how much Flex or how many meal swipes are left, and finds out about campus events from paper flyers. It's several separate things to carry and check for what feels like one account.",
      observation:
        "Every student already had the campus card and a phone. The card did exactly one thing — tap to open a door or pay — and gave nothing back: no balance, no history, no warning that meal swipes were about to run out mid-week. Staff verifying a student's identity at an exam or event had nothing better than eyeballing a photo.",
      question:
        "If a phone can already do the tap, what else belongs there — the four balances, a verifiable ID, the events — so it's one app instead of a card plus three separate lookups?",
      userNeed:
        "Students need the four balances at a glance, a tap-to-pay that still works when campus Wi-Fi drops, and an ID a staff member can actually verify. Staff need to scan that ID and get a clear yes/no.",
      constraints: [
        "Course project (Software Engineering I & II): fixed two-semester timeline, 6-person team, graded on process as much as output",
        "Registration gated behind email verification",
        "No budget — free Firebase tier only",
        "A payment-shaped feature: a balance and its history must never disagree",
        "Campus Wi-Fi is unreliable, so tap-to-pay couldn't hard-require connectivity",
      ],
      options: [
        {
          option: "Native Android (Kotlin + Jetpack Compose) + Firebase",
          tradeoff:
            "Auth, storage, and a database for free and fast; Android-only, and Firestore's document model shapes the data",
        },
        {
          option: "React Native / Expo for cross-platform from day one",
          tradeoff:
            "One codebase for iOS and Android, but more native-module friction for NFC and the camera under a tight deadline",
        },
        {
          option: "A responsive web app",
          tradeoff: "No install, but no real NFC tap and a weak 'show your ID' story",
        },
      ],
      decision:
        "Native Android + Firebase, structured in layers: Compose screens and ViewModels on top, one domain repository per area (Wallet, Transaction, User, Event, Offer, Notification), all sitting on a single FirestoreDataSource that is the only class that knows collection names and query shapes. That kept Firestore's quirks in one place and let the six of us work in parallel — a branch per feature (auth, UI, database, QR, NFC, professor-ID verification), merged through dev and staging. I led the team and owned the Firebase design and final integration.",
      architecture:
        "Auth (Firebase) — register sends an email verification\n  AppNav splash guard, checked on every launch and after login:\n    no user -> Login | user not verified -> Email-verification screen | verified -> Dashboard  (back stack cleared)\n\nCompose screen -> ViewModel -> Repository -> FirestoreDataSource -> Firestore\n\nFirestore\n  users/{uid}                 profile + ID photo ref (photo bytes in Firebase Storage)\n  wallets/{uid}               redHawkDollars | flex | bonus | mealSwipes   (stored balances)\n  users/{uid}/transactions/*  append-only history\n  events / offers             campus + off-campus\n\nPay path (tapAndPay / tapAndPayWithToken) runs inside one Firestore transaction:\n  check balance -> deduct the account field -> write the transaction record, all-or-nothing\n\nDigital ID: generated QR -> professor scanner screen -> student-verification result\nOffline tap-to-pay: pre-issued signed OfflineTokens (amount cap + expiry), held in\n  EncryptedSharedPreferences as available / used sets, spent over NFC, redeemed server-side",
      challenges: [
        {
          challenge:
            "A freshly registered account could open the wallet and ID screens before verifying its email.",
          initialApproach:
            "Send the user to the dashboard after sign-up and show a 'please verify' banner.",
          problem:
            "The whole premise is 'you're a verified student'. A banner is a suggestion — the balances and the ID were still reachable without verifying.",
          decision: "Make verification a routing gate, not a message.",
          finalSolution:
            "The splash/auth guard in AppNav checks state on every launch and after login: no user -> Login; user present but isEmailVerified false -> the Email-verification screen with resend; only a verified user reaches the dashboard, and the back stack is cleared so you can't navigate around it.",
          result:
            "Protected screens are unreachable until the email is verified — the guarantee is enforced by navigation, not trusted to the user.",
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
          why: "Campus Wi-Fi drops constantly, and a tap that fails for lack of signal is worse than useless. Small, capped, expiring tokens signed ahead of time let a payment clear offline with bounded risk, then reconcile when the phone is back online.",
        },
      ],
      learned: [
        "Draft: leading six people, the useful move was structural — one FirestoreDataSource and a branch per feature meant nobody was blocked on my code or fighting merge conflicts in the data layer.",
        "Draft: 'verified student' had to be enforced by the router, not requested with a banner.",
        "Draft: only the balance-changing path needed a transaction; reaching for atomicity everywhere would have been cost with no benefit.",
        "Draft: designing offline payments as capped, expiring, signed tokens turned 'what if there's no signal' into a bounded risk instead of a broken feature.",
        "Draft: the Android-only call was right for the deadline and wrong for reach — hence the Flutter rebuild (separate project).",
        "TODO: rewrite these in your own words, from what the project actually changed about how you build.",
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
        "The Kotlin Red Hawk Wallet worked, but it had three ceilings. It ran on Android only, so roughly half of Montclair — the iPhone half — couldn't install it. Its tap-to-pay was simulated, with a client-side Firestore transaction doing the debit, which meant the app was trusted to move money. And it was student-only: no vendor or admin side, so it couldn't actually function as a campus commerce platform.",
      observation:
        "The genuinely portable work — the Firestore model, the auth and verification gating, the idea of guarded routes — was never tied to Android; Jetpack Compose was. But the rebuild was also the moment to fix the payment model and add the missing sides, not just re-skin the same app.",
      question:
        "Rebuild cross-platform in one codebase, move every balance change off the client, and add the vendor and admin sides — what architecture does that need?",
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
          tradeoff: "Best-looking native result, but still two UI layers and a newer toolchain",
        },
        {
          option: "Flutter — one Dart codebase, one UI toolkit, both platforms",
          tradeoff:
            "Single codebase and fast UI iteration; a non-native toolkit and the whole UI re-implemented in Dart once",
        },
        {
          option: "React Native",
          tradeoff:
            "Ecosystem and web-skill overlap, but more native-module friction for the camera and payment SDKs",
        },
      ],
      decision:
        "DRAFT — confirm this is how you'd put it. Flutter, with go_router for declarative role-aware routing and Firebase kept as the backbone — but the money model changes completely. Every balance change goes through a Cloud Function (processPayment for student → vendor; createStripePaymentIntent plus a Stripe webhook for top-ups), and firestore.rules blocks all client-side balance writes. Card payments use Stripe's PaymentSheet with the PaymentIntent minted server-side. Payments are QR, not NFC, so they work on iPhone with no special hardware. State is plain Flutter — service classes plus a ChangeNotifier auth object the router listens to — no state-management library.",
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
            "TODO (your words): why Flutter over Kotlin Multiplatform, and why the payment model needed rebuilding rather than porting.",
        },
      ],
      learned: [
        "Draft: the rebuild's real value wasn't cross-platform — it was getting the client out of the money path entirely (Cloud Functions + firestore.rules).",
        "Draft: one go_router redirect is a good home for every guard — auth, verification, role, suspension — instead of scattering checks across screens.",
        "Draft: swapping NFC for server-verified QR dropped a hardware dependency and made iOS parity trivial.",
        "TODO: your take on the state call — plain services + a ChangeNotifier vs. reaching for Riverpod/Bloc — and whether it held up as the app grew past ~60 screens.",
      ],
    },
  },

  {
    slug: "scheduleai",
    name: "ScheduleAI",
    tagline:
      "Building a class schedule around real constraints — times, professors, no clashes — is a manual jigsaw every semester.",
    year: "2026",
    featured: true,
    stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Node.js", "Firebase"],
    repo: "https://github.com/harshvk8/ScheduleAi",
    demo: "https://schedule-ai-eta.vercel.app",
    caseStudy: {
      problem:
        "Every semester, students rebuild a timetable by hand: preferred times, which professor, no clashes, requirements met. It's a constraint problem solved with a spreadsheet and trial and error, and one missed conflict often isn't caught until it's too late to change sections.",
      observation:
        "People already describe what they want in plain language — 'nothing before 10', 'keep Fridays light', 'Professor X if possible'. The existing tools make them translate that into grids and dropdowns instead of just taking the sentence.",
      question:
        "Could a chatbot take those sentences directly, structure them into constraints, and keep the timetable conflict-free as it goes — instead of a 'generate' button you press and hope?",
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
        "Chat message\n  --> model: extract structured constraints { times, days, professors, hard vs soft }\n  --> rule engine: place courses, run conflict detection, reject on overlap or hard-rule break\n  --> timetable state (updates continuously — no separate 'generate' step)\n        --> Google Calendar / in-app calendar sync\n        --> admin view: anonymised, aggregated demand",
      learned: [
        "Draft: the split that held up was 'model understands, rules decide' — asking the model to also guarantee correctness is where these break.",
        "Draft: designing the constraint types as reusable objects up front let one engine serve three different audiences.",
        "This is the scheduler I'm connecting to this portfolio's contact page in Phase 3 — a real second use case for the same engine.",
        "TODO: your real takeaway, especially anything the deployed version taught you that the plan didn't.",
      ],
    },
  },

  {
    slug: "today-only-todo",
    name: "TodayOnlyToDo",
    tagline: "Most to-do apps become a guilt archive — a backlog you scroll past for weeks.",
    year: "2026",
    featured: false,
    stack: ["Kotlin", "Jetpack Compose", "MVVM"],
    repo: "https://github.com/harshvk8/TodayOnlyToDo",
    caseStudy: {
      problem:
        "A to-do list that keeps everything turns into a list you stop reading. Last week's unfinished items sit at the bottom, and nothing gets done because the list itself is discouraging.",
      observation:
        "The tasks that actually got done were the ones added and finished the same day. Anything carried over got carried over again.",
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
        "Draft: the feature was a constraint, not a capability — removing the backlog did more than any new button would have.",
        "Draft: keeping the date rule in one place (MVVM) meant 'a new day started' was one code path, not a bug spread across screens.",
        "TODO: your own takeaway.",
      ],
    },
  },

  {
    slug: "goplus-research",
    name: "Go vs Go+ Research",
    tagline:
      "Go gets taught as a 'real' systems language, but beginners spend their effort fighting boilerplate instead of solving the problem.",
    year: "2025",
    featured: false,
    stack: ["Go", "Go+", "Comparative analysis"],
    // TODO: add a link to the write-up / paper if there is one (repo, PDF, poster).
    caseStudy: {
      problem:
        "There's a gap in how people learn to program for performance-oriented work. Go compiles to a fast single binary and is widely taught, but its verbosity — explicit loops, repetitive error handling — means beginners burn time on ceremony instead of the actual problem. Languages that are friendlier to learn often give up the deployment and performance story.",
      observation:
        "Go+ keeps Go's toolchain and performance but adds lambda expressions, list comprehensions, and lighter syntax. The interesting question wasn't whether it runs — it's Go underneath — but whether those features measurably reduce what a learner has to hold in their head.",
      question:
        "Is Go+ just syntax sugar, or does it genuinely lower the barrier to Go's world — and if so, for which kinds of task?",
      userNeed:
        "Educators need a language students can be productive in quickly without dropping them off a cliff later. Students doing scripting and rapid prototyping need to move fast. Both want a path that doesn't dead-end when the work turns into real systems code.",
      constraints: [
        "A comparison is only useful with objective, repeatable criteria — not 'this feels nicer'",
        "Go+ is young: smaller ecosystem, fewer libraries, less documentation",
        "Had to scope to representative tasks rather than survey the whole language",
      ],
      options: [
        {
          option: "Micro-benchmark raw runtime performance Go vs Go+",
          tradeoff:
            "Clean numbers, but Go+ compiles through Go — the runtime story is nearly identical, so it answers the wrong question",
        },
        {
          option: "Compare code complexity and syntax overhead on representative tasks",
          tradeoff:
            "Measures the thing that actually differs — the human side — but needs care to keep 'complexity' defined consistently",
        },
        {
          option: "Survey ecosystem maturity and library coverage",
          tradeoff:
            "Important for real adoption, but a moving target and less about the language design claim",
        },
      ],
      decision:
        "Focus the comparison on developer productivity — code complexity, lines, and syntax overhead — across three settings where the claim matters most: education, scripting, and rapid prototyping. Runtime performance is treated as a constant (it's Go underneath); ecosystem maturity is noted as the main practical caveat rather than the headline.",
      architecture:
        "Comparison framework:\n  Task set: small representative programs (data transforms, file/CLI scripts, prototypes)\n    --> implement each in idiomatic Go and in Go+\n    --> measure: line count, control-flow constructs, error-handling ceremony, named concepts to learn\n  Settings: education | scripting | rapid prototyping\n  Held constant: compiler, runtime, deployment (single binary)\n  Recorded separately: ecosystem / library gaps",
      codeDecisions: [
        {
          title: "Where the syntax difference actually shows up",
          language: "go",
          snippet:
            "// Go: transform a slice\nout := make([]int, 0, len(xs))\nfor _, x := range xs {\n  if x%2 == 0 {\n    out = append(out, x*x)\n  }\n}\n\n// Go+: list comprehension\nout := [x*x for x <- xs, x%2 == 0]",
          why: "This is the pattern the whole finding rests on: the two programs do the same work and compile the same way, but the Go+ version has fewer moving parts for a learner to get right. Multiply that across every small program in a course and the cognitive load difference is real.",
        },
      ],
      learned: [
        "Draft: picking the right axis to compare on mattered more than the comparison itself — benchmarking runtime would have produced tidy, meaningless numbers.",
        "Draft: 'lower barrier to entry' and 'production-ready' aren't opposites; Go+ was interesting precisely because it tries to be both.",
        "Draft: a smaller ecosystem is the honest catch — the language can be friendlier and still not be the pragmatic choice yet.",
        "TODO: your real takeaway from doing the research.",
      ],
    },
  },
];
