# 📅 Campus Life Planner

# Submission LINKS

Link to the website: https://nshderrick056.github.io/Campus-Life-Planner/
Link to the Demo video: https://youtu.be/Y5finah_mPg

A **Campus Life Planner** that helps students organize and manage their daily campus activities — including tasks, events, durations, and tags — with powerful regex search, sorting, and a responsive user interface.

---

## 🎯 Project Overview

This project allows users to:
- Add, edit, delete, and view campus tasks/events.
- Assign durations and tags to each activity.
- Filter and sort records.
- Use advanced **Regex-based search and validation**.
- Save all data persistently in **localStorage**.
- Export/import tasks in **JSON** format with validation.
- Enjoy a responsive and accessible experience across devices.

---

## 🧩 Learning Outcomes

| Area | Description |
|------|--------------|
| **Regex** | Validate inputs and power search (includes advanced patterns like lookahead/behind and back-references). |
| **HTML/CSS** | Semantic layout using Flexbox and media queries, includes transitions/animations. |
| **JavaScript** | DOM manipulation, modular structure, sorting/filtering, event handling, and error handling. |
| **Data** | Persistent storage using localStorage, import/export JSON with validation. |
| **Accessibility (a11y)** | Full keyboard navigation, visible focus styles, ARIA live regions, and adequate color contrast. |

---

## 🧱 Core Features

### A) Pages/Sections
- **About Page:** Purpose of the planner and developer contact info (GitHub & email).  
- **Dashboard/Stats:** Overview of total events, durations, and most frequent tags.  
- **Records Page:** List of all tasks in a table or responsive card layout.  
- **Add/Edit Form:** Input form with validation.  
- **Settings Page:** Customize units (hours/minutes), themes, and export/import JSON.

### B) Data Model

Each record follows this structure:

```json
{
  "id": "rec_0001",
  "title": "Attend Math Lecture",
  "duration": 120,
  "tag": "Academics",
  "dueDate": "2025-10-16",
  "createdAt": "2025-10-14T09:00:00Z",
  "updatedAt": "2025-10-14T09:00:00Z"
}

All data auto-saves to localStorage.

Import/export JSON supported (with structure validation).

🔍 Regex Catalog
Field	Pattern	Description	Example Match
Title	/^\S(?:.*\S)?$/	Forbids leading/trailing spaces	"Study session" ✅ " Study " ❌
Duration	`/^(0	[1-9]\d*)(.\d{1,2})?$/`	Accepts integer or decimal
Date (YYYY-MM-DD)	`/^\d{4}-(0[1-9]	1[0-2])-(0[1-9]	[12]\d
Tag	/^[A-Za-z]+(?:[ -][A-Za-z]+)*$/	Letters, spaces, or hyphens	Group Study
Duplicate Words (Advanced)	/\b(\w+)\s+\1\b/	Detects duplicate consecutive words	"read read"
Time Format (Advanced)	/\b\d{2}:\d{2}\b/	Finds time tokens	"10:30"
📊 Stats Dashboard

Total number of records.

Total and average duration.

Most used tags.

Activity trends (last 7 days).

Cap/Target tracker (with ARIA live alerts).

⚙️ Keyboard Map
Action	Shortcut
Add new record	Alt + N
Save record	Enter (on form)
Delete record	Del (focused row)
Search	/ (focus search input)
Navigate records	↑ ↓
Jump to top	Home
Jump to bottom	End
🌐 Accessibility Notes

Semantic landmarks: <header>, <main>, <section>, <footer>.

Visible focus indicators for all interactive elements.

Live feedback via aria-live="polite" and aria-live="assertive".

Fully keyboard-operable.

High-contrast colors for readability.
