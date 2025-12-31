FallowRPG – Character Generator & Game Manager

A state-heavy, rules-driven web application built to model a complex tabletop RPG system with real gameplay constraints.

This project focuses on type-safe domain modeling, derived state, and predictable UI behavior under a large number of interacting rules (equipment, injuries, afflictions, size scaling, action economy).

Built as a realistic example of how I approach complex frontend logic, Next.js App Router architecture, and data consistency in interactive applications.


🎯 Project Goals

This project was built to explore and demonstrate:

Complex derived state without global state libraries

Deterministic calculations from mutable player inputs

Strong TypeScript modeling for game rules and constraints

Clear separation of UI, domain logic, and persistence

Scalable UI architecture for feature-dense tools

The RPG domain intentionally creates edge cases that resemble real-world business logic: cascading modifiers, conflicting rules, partial invalid states, and contextual calculations.

✨ Key Features
Character & Domain Modeling

Attribute-driven character system (STR, AGI, STA, CON, INT, SPI, DEX)

30+ skills derived from base stats and modifiers

Size-based scaling affecting combat, movement, and survivability

Equipment system with automatic penalties and bonuses

Fully deterministic stat recalculation on every change

Gameplay & Session Management

Action Point (PA) and Stamina (STA) economy

Injury system with severity-based penalties

Affliction system that dynamically modifies skill categories

Survival mechanics (hunger, thirst, exhaustion)

Dice rolling and combat resolution helpers

Turn and round tracking for live sessions

Persistence & Data Handling

Character persistence using Upstash Redis

JSON-based character templates stored in the filesystem

Separation between player characters and NPCs

Server Actions used for all mutations

🧠 Engineering Highlights (What this repo demonstrates)

Type-first design: domain rules are encoded in TypeScript types and helpers

Derived state over stored state: values are recalculated, not duplicated

Predictable UI updates under heavy rule interaction

Minimal client state leakage using server actions

Event-based coordination for cross-component updates

No any, no implicit null state (intentional design choice)

This project avoids Redux on purpose to demonstrate controlled, localized state management under complexity.

🛠️ Tech Stack

Framework: Next.js 15.5 (App Router)

UI: React 19

Language: TypeScript (strict mode)

Styling: Tailwind CSS 4

Persistence: Upstash Redis

Build: Turbopack

📁 Project Structure (Simplified)
app/
├── components/        # UI and interaction logic
├── characters/        # JSON character templates
├── actions.ts         # Server Actions (mutations)
├── redis.ts           # Persistence layer
├── eventBus.ts        # Cross-component coordination
├── types.ts           # Domain and system types
└── page.tsx

🚀 Getting Started
Prerequisites

Node.js 20+

Upstash Redis account

Setup
git clone https://github.com/yourusername/chargenfallow.git
cd chargenfallow
npm install


Create .env.local:

UPSTASH_REDIS_URL=...
UPSTASH_REDIS_TOKEN=...


Run:

npm run dev


Open http://localhost:3000

🎮 How It’s Used

Create or load a character template

Modify stats, skills, equipment, and conditions

Observe automatic recalculation of all dependent values

Run live combat or survival scenarios

Persist characters between sessions

🔧 Game Mechanics (High Level)

Size Modifier (1–7): affects damage, movement, and skill interaction

Action Economy: PA for actions, STA for bursts and recovery

Injury Severity: escalating penalties (light → deadly)

Afflictions: category-based skill penalties

🧩 Design Tradeoffs

Redis used instead of SQL to keep persistence schema-less

No external state manager to keep logic close to components

Domain rules live outside UI components where possible

Focused on correctness and clarity over visual polish

🛣️ Possible Next Steps

Move domain logic into a dedicated rules engine module

Add automated tests for rule interactions

Multiplayer session syncing

Read-only spectator mode

📄 License

Private project. Not licensed for public or commercial use.

👤 Author

Built by Guilherme Below
Frontend / Full-Stack Engineer
Focus on complex UI logic, TypeScript, and interactive systems