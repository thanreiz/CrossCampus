# Codex Handoff Prompt For Gabay 3D Classroom

Copy this prompt into another Codex session when continuing this project.

```text
You are helping me continue a web-based 3D educational classroom app called Gabay.

Before coding, ask me for the design basis/reference first.

Ask exactly:
"Please send the PDF, screenshot, Figma, image, or visual reference that should define the UI and art direction before I change the app."

Do not proceed with major visual or UX changes until I provide that reference. The reference is the source of truth for the UI design, art direction, layout mood, typography feel, colors, and visual hierarchy.

Project Summary

Gabay is a PWA-based offline capable 3D educational classroom simulation. The user starts at a loading screen, taps to begin, chooses a grade level from Grade 4, Grade 5, or Grade 6, chooses the language of learning (Filipino/English/Taglish), selects Math as the only offered subject, chooses a Math topic covered by the DepEd MATATAG Curriculum for that selected grade level, presses Start, then enters a 3D classroom as the teacher/player. The player can move with WASD, look around, walk to the blackboard, talk to classmates (NPCs), and answer Math topic-based questions. Have an option as well where they can upload notes when ONLINE. When the student is OFFLINE, they cannot upload notes but can still navigate through the classroom and start the Math topic-based questions session.

Core Tech Stack

- Vite
- Vanilla JavaScript
- Three.js
- HTML
- Tailwind CSS
- No React
- No backend yet
- No physics engine yet
- No heavy asset pipeline yet
- No Roblox

Current File Structure

- `index.html`
  - App shell
  - Canvas
  - Loading screen
  - Class selection screen
  - In-game HUD
  - Lesson modal
  - Mobile controls

- `src/main.js`
  - Three.js scene setup
  - Math-only grade/topic data
  - Lesson data
  - Player movement
  - Mouse/touch controls
  - Procedural classroom geometry
  - Low-poly students and teacher
  - Blackboard interaction
  - Class selection flow

- `src/styles.css`
  - Loading UI
  - Class selection UI
  - HUD styling
  - Lesson modal styling
  - Mobile controls

- `package.json`
  - `npm.cmd run dev`
  - `npm.cmd run build`
  - `npm.cmd run preview`

Commands

- Run dev server:
  `npm.cmd run dev`

- Build:
  `npm.cmd run build`

Important working rule:
If the dev server is already running, do not restart it. Let Vite hot reload. Only run `npm.cmd run build` to verify changes unless I explicitly ask you to restart the server.

Current Achieved Features

- Browser-based 3D classroom.
- Optimized procedural Three.js scene.
- Loading screen.
- Tap to Begin screen.
- Class selection UI.
- Start button enters selected classroom.
- Player spawns near the teacher area facing the board.
- In-game HUD is hidden until class starts.
- Grade level choices:
  - Grade 4
  - Grade 5
  - Grade 6
- Subject choices:
  - Math only
- Math topic choices:
  - Must be scoped to the selected Grade 4, Grade 5, or Grade 6 level.
  - Must be aligned with the DepEd MATATAG Curriculum for Mathematics.
  - Must not include non-Math topics or topics outside Grades 4-6.
- Math grade/topic selection changes:
  - room label
  - board color
  - wall/floor colors
  - classroom accent color
  - teacher prompt
  - active lesson set
  - grade/topic-specific props
- WASD movement.
- Mouse look.
- Touch look.
- Mobile joystick.
- Mobile Use button.
- Interactive blackboard.
- Lesson modal with answer input.
- Answer checking for math/text answers.
- Feedback for correct/incorrect answers.
- Low-poly teacher.
- Low-poly students.
- Students face the board correctly.
- Classroom props:
  - teacher desk
  - student desks
  - chairs
  - blackboard
  - chalk rail
  - wall paneling
  - floor seams
  - posters
  - bulletin board
  - side cabinet
  - pendant lights
  - Math props
- Movement smoothing with acceleration and damping.
- Collision against desks/teacher table.
- No large downloaded assets currently required.

Design Direction So Far

The app is aiming for a polished low-poly educational simulation style, similar in spirit to clean browser-based 3D learning/consultation games:

- warm room lighting
- readable silhouettes
- stylized low-poly people
- rounded friendly UI
- strong loading/class selection flow
- clean grade and Math topic cards
- classroom atmosphere over photorealism
- optimized scene over heavy visual effects

But if I provide a PDF or visual reference, you must base the next visual pass on that reference instead of inventing a different style.

What To Preserve

- Keep the app lightweight.
- Keep movement smooth.
- Keep Vite + Three.js.
- Keep the procedural scene unless external assets are clearly worth it.
- Keep Math grade/topic data-driven.
- Keep the only subject as Math.
- Keep grade options limited to Grade 4, Grade 5, and Grade 6.
- Keep the current learning flow:
  1. Loading screen
  2. Tap to Begin
  3. Class selection with Grade 4-6, language, Math subject, and Math topic
  4. Start selected Math class
  5. Spawn in classroom
  6. Walk to board
  7. Answer lesson question

Math Curriculum Scope

- The app must offer Math as the only subject.
- The grade selector must offer only:
  - Grade 4
  - Grade 5
  - Grade 6
- After a grade is selected, the user must choose one Math topic for that grade.
- Math topics must follow the current official DepEd MATATAG Curriculum for Mathematics. Before implementing or changing topic coverage, verify the exact topic list against an official DepEd MATATAG Mathematics curriculum guide or user-provided curriculum reference.
- Organize topics by grade and strand. Use these strands as the UI and data structure unless the official reference requires different wording:
  - Numbers and Algebra
  - Measurement and Geometry
  - Data and Probability
- Do not show History, Science, English, Filipino, or other non-Math subject cards.
- Do not let a Grade 4 learner select Grade 5 or Grade 6-only topics, and do not let a Grade 5 learner select Grade 4-only review topics unless they are intentionally marked as review/remediation.
- Lesson questions, board text, teacher prompts, props, and feedback must all match the selected Math grade and topic.
- Use curriculum-safe topic labels such as:
  - Grade 4: whole numbers, factors and multiples, fractions, decimals, basic operations, angles, polygons, perimeter, area, measurement, tables and graphs.
  - Grade 5: fractions and decimals operations, factors and multiples, ratio, percent, geometry, measurement, area, volume, data representation, and basic probability.
  - Grade 6: ratio and proportion, percent, integers, algebraic expressions, equations, geometry, circumference, area, volume, statistics, and probability.
- Treat the topic labels above as implementation starting points only. Replace or refine them when an official DepEd MATATAG reference is available.

What To Improve Next

After I provide the visual basis/reference:

- Update UI to match the PDF/reference.
- Improve loading screen polish.
- Improve class selection polish.
- Improve classroom visual identity.
- Improve character quality while staying optimized.
- Fix any wrong-facing characters.
- Fix floating/misaligned props.
- Improve scale and placement.
- Improve classroom readability from spawn.
- Improve blackboard interaction affordance.
- Add better grade/topic-specific Math room differences.
- Consider small free licensed assets only if they clearly improve the scene.

Asset Rules

You may use free online assets only if:

- they are clearly free/licensed for this use
- the license/source is noted
- the file size is reasonable
- they do not make the app laggy
- they fit the visual reference
- they are not unnecessary compared to procedural geometry

Prefer:

- low-poly GLB/GLTF
- optimized textures
- tiny icon/font libraries only when needed
- procedural geometry for simple room props

Avoid:

- huge asset packs
- unlicensed files
- realistic assets that clash with the stylized look
- heavy physics engines unless truly needed
- adding React unless I explicitly request a rebuild
- backend/AI work before the frontend experience is solid

Movement And Performance Requirements

- Movement should not feel jittery.
- Use acceleration/damping.
- Keep collision simple and cheap.
- Do not brute force expensive work every frame.
- Avoid shadows unless performance remains good.
- Cap pixel ratio for performance.
- Reuse geometries and materials where practical.
- Keep draw calls reasonable.
- Do not import large libraries for small features.

Interaction Requirements

- Class selection must be functional.
- Grade selection must be limited to Grade 4, Grade 5, and Grade 6.
- Subject selection must show Math only, or be removed entirely if Math is already implied.
- Math topic selection must update based on the selected grade level.
- Start button must enter selected class.
- Player must spawn near teacher table/board.
- Blackboard interaction must still work.
- Lesson modal must still work.
- Mobile joystick must still work.
- HUD must not show before class starts.
- Loading flow must not allow movement before entering class.

Coding Workflow

1. Inspect the existing files first:
   - `index.html`
   - `src/styles.css`
   - `src/main.js`
   - `package.json`

2. Ask for the design basis/reference if I have not provided it yet.

3. After I provide the PDF/screenshot/Figma/reference:
   - summarize the visual direction
   - identify which parts of the current app should change
   - then implement scoped edits

4. Use existing architecture.

5. Prefer editing:
   - `index.html`
   - `src/styles.css`
   - `src/main.js`

6. Do not create new folders unless justified.

7. Do not restart the dev server if it is already running.

8. Run:
   `npm.cmd run build`

9. Report:
   - what changed
   - what was verified
   - what I should test in browser

Quality Bar

This should feel like a real educational 3D web app prototype, not a rough tech demo. The UI should look intentional, the classroom should feel coherent, and interaction should feel smooth.

Before making any new major design change, ask:
"What reference should define the design basis?"
```
