# Yahtzee Scorecard (Web)

A lightweight, browser-based Yahtzee scorecard with a clean UI, on-screen numeric keyboard, and built-in rule validation. Track up to three players with tabs, persist scores in localStorage, and enjoy quick edit/rename flows.

## Features

- Multi-player tabs: up to 3 players; quick add/remove and rename via double-click
- Custom on-screen keyboard modal with OK, C (clear), and X (cross) actions
- Enforced scoring rules per cell (per Yahtzee variant used in this app)
- “Down,” “Up,” “Mess,” and “First Try” scoring columns
- Totals rows are protected and auto-calculated
- Persistent storage with localStorage (refresh-safe)
- Responsive, mobile-friendly styling

## Live Demo

- Open index.html directly in your browser (see “Getting Started”).


## Usage

- Add Player: Click the “+” button to add a tab (max 3).
- Switch Player: Click a player’s tab.
- Rename Player: Double-click the player name in the tab and confirm.
- Enter Score: Click a score cell to open the keyboard modal, enter a valid value, then press OK.
    - C clears the keyboard entry (not the cell).
    - X crosses out the cell with a “-”.
- Restart: Click “Restart” to clear all scores and storage (confirmation required).

Note: Totals rows (T1, B, T2, T3, T4, FS) are computed and cannot be edited.

## Scoring Model

Rows:
- 1, 2, 3, 4, 5, 6
- T1, B, T2 (top-section totals and bonus)
- 3K (Three of a Kind), 4K (Four of a Kind), FH (Full House), SS (Small Straight), LS (Large Straight), SC (Small Chance), LC (Large Chance), Y (Yahtzee)
- T3, T4, FS (final totals and summary)

Columns:
- ↓ down: must fill top-to-bottom in order (cell above must be filled)
- ↑ up: must fill bottom-to-top in order (cell below must be filled)
- m in the mess: can be filled in any order
- f on first try: can be filled in any order

Validation rules (summarized):
- 1–6: value must be a multiple of the row number, between [row, 5×row], or 0
- 3K: allowed values [23, 26, 29, 32, 35, 38]
- 4K: allowed values [44, 48, 52, 56, 60, 64]
- FH: allowed values [37–54, 56–58] limited set
- SS: 50
- LS: 60
- SC: 5–30, must be strictly less than LC if LC already set
- LC: 5–30, must be strictly greater than SC if SC already set
- Y: allowed values [85, 90, 95, 100, 105, 110]

If an entry is invalid, the keyboard modal shows an “Invalid score...” message.

## Persistence

- Scores are saved in localStorage under the key yahtzee-scores.
- Player name is saved separately as yahtzee-scores-player-name.
- Restart removes yahtzee-scores and resets the editable cells.

## Tech Stack

- HTML + CSS
- jQuery (via CDN)
- Bootstrap JS (via CDN) for modal behavior
- LocalStorage API for persistence
- Custom font: Ampunsuhu.otf

## Project Structure

```
/
├─ index.html                  # App shell: modals, tabs, and includes
└─ assets/
   ├─ style.css                # Styles for table, tabs, modals, keyboard
   ├─ Ampunsuhu.otf            # Decorative font for scores
   ├─ script_yahtzee.js        # Tab/score table builder, load/restore, UI wiring
   └─ script_keyboard.js       # Keyboard modal, validation, edit/cross rules, restart
```


## Development Notes

- No build step required; open index.html in a browser.
- Modals: Bootstrap JS is in use. For best visuals, include Bootstrap CSS (optional).
- Totals: The code references updateTotalScore() (in keyboard flow) and computes totals in the protected rows. Ensure any logic changes maintain this flow.
- Variants: Scoring rules are hardcoded. Adjust them in assets/script_keyboard.js if you want a different ruleset.

## Roadmap Ideas

- Add Bootstrap CSS by default and polish the compact / mobile view further
- Export/import scores (JSON)
- Increase the player limit and add horizontal scrolling for tabs
- Add a dark mode toggle
- Unit tests for validation and totals

## Contributing

Contributions are welcome! Please open an issue to discuss changes before submitting a pull request.

## License

[Your License Here]

## Acknowledgments

- Thanks to the open-source ecosystem around jQuery and Bootstrap that powers modal and DOM interactions.
