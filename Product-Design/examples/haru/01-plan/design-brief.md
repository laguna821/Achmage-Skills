# Design brief: 하루 (Haru), web app

**Stage:** 1 Define (`references/workflow.md#define`). Mode: Plan. Web app only; landing page, card news and demo deck are later stages and not covered here.

## Purpose sentence
하루 is a to-do and project web app that helps one person, or a small team of a few people, see what to do today and move their projects forward without noise. `design-principles/purpose/create-value` [HIG]

Re-check this sentence at every later stage; if a screen does not help someone decide or finish today's work, it is a candidate to cut `design-principles/purpose/keep-focused` [HIG]

## People and context
- Who: (a) an individual managing personal tasks and a few projects; (b) a small team (roughly 2 to 6 people, assumed) sharing project task lists. Not assumed to be project-management experts; familiar with phone to-do apps. Ability range is general, so larger text, keyboard use and non-color cues are required from the start `design-principles/flexibility/design-for-everyone` [HIG]
- Where and when: phone browser for quick capture and checking off during the day (short sessions, one hand, interrupted); desktop browser for planning and sorting at a desk (longer sessions, keyboard and pointer). Same data on both only after the backend exists; in the first release data lives in one browser on one device [House assumption].

## Medium and platforms
- Medium: web app (app-like interface), responsive. Phone and desktop browsers [House].
- Size classes [House, house-style 11, HIG transfer]: **compact below 744 px** uses the phone layout (tab bar, full-width lists, sheets from the bottom); **regular from 744 px** uses the sidebar layout. App content at most 1200 px; any reading text column at most 720 px; spacing in multiples of 4 px. `layout/adaptability/design-a-layout-that-adapts-gracefully` `layout/adaptability/size-classes/keep-functionality-the-same-as-size`
- Keep features the same at both classes; only the arrangement changes `layout/adaptability/size-classes/keep-functionality-the-same-as-size` [HIG transfer]
- Type scale: desktop-app scale (macOS) for regular, iOS scale for compact, stated here as the choice per `media/web.md` "Ask the user first" [House]. Font Pretendard Variable, icons Lucide [House 1, 2]. Visual choices belong to later stages.
- Not in the HIG for the web, so decided by house defaults, not guessed: breakpoints (house-style 11), target browsers, URL structure and routing (open question Q-B1), print, shortcut map [HIG none].

## Top features (ranked, cut to the first release)
| Rank | Feature | Why it matters to people | Rule IDs | Label |
|---|---|---|---|---|
| 1 | Quick add: write a task in one step, from anywhere | Capture happens in the middle of other things; slow capture means tasks are lost | `design-principles/simplicity/include-just-whats-necessary` `design-principles/agency/stay-out-of-the-way` | [HIG] |
| 2 | 오늘 (Today): one list of what is due today and overdue, checked off in place | The reason people open the app each morning and during the day | `design-principles/purpose/keep-focused` `layout/visual-hierarchy/order-content-by-relative-importance` | [HIG] |
| 3 | Projects: group tasks, see how far each project is | Turns a flat list into work that finishes; shows progress without a report | `design-principles/purpose/create-value` `feedback/best-practices/consider-integrating-status-feedback-into-your` | [HIG] |
| 4 | Due date and one assignee per task, members listed in the workspace | The minimum that makes it a small-team tool, not just a personal list | `design-principles/purpose/keep-focused` | [HIG] |
| 5 | Search all tasks and projects | Once lists grow, finding beats browsing | `searching/best-practices/if-search-is-important-give-it` | [HIG] |
| 6 | Delete with undo, and a trash that can be restored | Mistakes are cheap, so no "are you sure" in the common path | `design-principles/agency/help-people-recover-from-mistakes` `alerts/best-practices/avoid-displaying-alerts-for-common-undoable` | [HIG] |
| 7 | Backup: export and import all data as a file | Browser-only storage can be cleared; the person must be able to keep their work safe | `design-principles/responsibility/keep-peoples-information-safe` `file-management/saving-work/help-people-be-confident-that-their` | [HIG] |

Features 1 to 3 are the ones to make excellent; 4 to 7 are kept small `design-principles/purpose/keep-focused`.

## Deliberately left out of the first release
- Real-time sharing, accounts, sync between devices: needs the backend that comes later. The first release stores in the browser only. Members are names in a local list, so the team model is real in the data but not shared yet. `managing-accounts/best-practices/delay-sign-in-for-as-long`
- Reminders and push notifications: need a permission and a background service; ask for permission only when a feature needs it `privacy/requesting-permission/request-permission-only-when-your-app`. Revisit with the backend.
- Comments, file attachments, activity feed: not needed to decide or finish today's work `design-principles/simplicity/include-just-whats-necessary`
- Board (kanban), calendar and timeline views: one list view first; each extra view needs its own navigation and states `design-principles/purpose/keep-focused`
- Subtasks, recurring tasks, labels and tags, priorities, time tracking: each one adds fields to every task; start with title, note, due date, project, assignee, done.
- In-app light/dark toggle: follow the system appearance `dark-mode/best-practices/avoid-offering-an-app-specific-appearance`
- Onboarding tour: the first screen is already usable (see S01 empty state) `onboarding/best-practices/teach-through-interactivity`

## Smaller alternatives considered
Checked widgets, quick actions and App Clips (`references/components/widgets.md`, `references/components/home-screen-quick-actions.md`, `references/components/app-clips.md`): they are native-platform features and do not exist for a browser app, so they are not available [HIG none for web equivalents]. The closest small form is the quick add (S05), reachable in one step from every screen, which stands in for a quick action. A full app with several screens is still needed because projects and team members need lists and detail views.

## Voice and feeling
- Voice: plain, short, calm Korean; verbs for actions ("추가", "완료"), nouns for sections. Politeness level (해요체 vs 합쇼체) is not set by the HIG; assumed 해요체 (see Assumptions) `writing/getting-started/determine-your-apps-voice` `writing/getting-started/match-your-tone-to-the-context`
- Intended emotion: calm and focused. Few things on screen, one clear next action, no streaks, scores or red-alert counts. Motion optional `motion/best-practices/make-motion-optional`. Branding stays behind the tasks `branding/best-practices/ensure-branding-always-defers-to-content` [HIG transfer]

## Capabilities needed
- Browser local storage for all data (tasks, projects, members, trash, last position). Why: first release has no backend. Risk: cleared storage means data loss, hence the backup feature (rank 7).
- File download and file selection (export and import). Needed for backup only.
- Camera, location, health data, payments, notifications permission: none.
- Keyboard access and pointer hover on regular width; touch targets on compact `accessibility/mobility/consider-spacing-between-controls-as-important` [HIG transfer]

## Why-chain for the main decision (a structure that serves both phone and desktop)
| Situation | Principle | Pattern | Component | Rule IDs | Label |
|---|---|---|---|---|---|
| People jump between "today", projects and search all day, on a phone and at a desk | Familiarity, Flexibility | Top-level navigation that adapts to width | Tab bar (compact), sidebar with split view (regular); see flow-map.md | `tab-bars/best-practices/use-a-tab-bar-to-support` `sidebars/best-practices/in-general-show-no-more-than` `layout/adaptability/design-a-layout-that-adapts-gracefully` | [HIG transfer] |
| A common action (delete a task) happens often and is easy to undo | Agency, Simplicity | Undo instead of asking | No alert; undo message | `alerts/best-practices/avoid-displaying-alerts-for-common-undoable` `undo-and-redo/best-practices/let-people-undo-multiple-times` | [HIG] |
| Data lives only in the browser | Responsibility | Be open about where data is and let people keep a copy | Export and import in settings (S09) | `design-principles/responsibility/be-fully-transparent-about-what-your` `design-principles/responsibility/keep-peoples-information-safe` | [HIG] |

## Assumptions
- Team = 2 to 6 people, one workspace, one assignee per task · Why: "작은 팀" unspecified · Confirm with: product owner
- Release has no sign-in and no real sharing; "team" means local member names · Why: user said backend comes later · Confirm with: product owner (Q1 in answer.md)
- Korean only in the first release · Why: request is in Korean · Confirm with: product owner
- Politeness level 해요체 · Why: HIG gives no Korean register · Confirm with: product owner
- Target browsers: current evergreen desktop and mobile browsers · Why: HIG gives none · Confirm with: front-end developer

## Open [HIG none] questions
- Target browsers, URL and deep-link behavior, and print support (media/web.md "Ask the user first") [HIG none]
- A web equivalent of quick actions or widgets [HIG none]
- Korean politeness level [HIG none]
- How "small team" data would later merge with this local data when the backend arrives [HIG none]
