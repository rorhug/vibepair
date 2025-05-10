- [ ] gh sign in
- [ ] figure out can we launch a live share from this extension
- [ ] allow buyers to create a project, with a price and a description
- [ ] allow sellers to bid on projects
- [ ] allow users to accept a bid
- [ ] allow users to chat

**

MVP UX/UI for VibePair Engineer Bidding Platform.

Engineer (Bidder) Interface

1. Simplified Dashboard
- Simple card list view of available job with minimal filtering based on price and time
- Card shows problem title, description and time remaining with a view details button
- Basic Filters - Just 2-3 essential filters: Technology dropdown (single select), Price range (low to high toggle), Time remaining

2. Simple Navigation - Tabs instead of sidebar:
- Available Jobs
- My Bids
- Active Jobs
- Profile

3. Streamlined Job Details
- Clean card with problem details and bid button]
- Essential Context Only:
a. Full problem description
b. Repository URL and branch name
c. List of relevant files (no preview in MVP)
d. Offered price
- Button to "Place Bid" opening up a Bid Form

4. Minimal Bid Form
- Bid amount (input field)
- Brief proposal (text area)
- Estimated completion time (dropdown: 1hr, 2hr, 4hr, etc.)
- Submit button

5. Basic Bid Management for Bidder:
Simple list of submitted bids and their status

- Status List:
a. Problem title
b. Your bid amount
c. Status (Pending/Accepted/Declined)
d. Simple timestamp

6. Notification System

- Email Notifications for:
a. Bid accepted
b. New message from requester
c. Session starting soon

In-app notification counter (no detailed notification center yet)

Microsoft Live Share Integration Flow
Once a bid is accepted, here's how the Microsoft Live Share integration would work in the MVP:
1. Acceptance Notification
![Acceptance Notification Mockup: Card showing acceptance with session details]

Engineer receives notification with:

"Bid Accepted" message
Problem summary
Scheduled time (or "Start Now" option)
"Join Session" button



2. Pre-Session Setup
![Pre-Session Setup Mockup: Simple preparation checklist]

Minimal Setup Page:

Link to install VS Code with Live Share extension if needed
Repository clone instructions (if not using Live Share's built-in features)
Basic checklist to ensure readiness
Contact button for the requester
"Enter Session" button



3. Session Initiation

Two Integration Options:

Direct VS Code Launch:

Custom protocol handler to open VS Code
Auto-join Live Share session with provided token


Browser-First Approach (simpler for MVP):

Generate Microsoft Live Share session link
Display prominent link to join
Brief instructions for joining





4. Live Collaboration Features
In the MVP, rely on Microsoft Live Share's built-in features:

Shared code editing
Terminal sharing
Voice call via built-in audio features
File access control

5. Session Controls (Web Interface)
![Session Controls Mockup: Simple interface showing active session with basic controls]

Minimal Session Dashboard:

Session status indicator
Time elapsed
Problem reference
Basic chat functionality (if Live Share chat is insufficient)
"End Session" button



6. Session Conclusion
![Session Conclusion Mockup: Simple form to mark completion]

Job Completion Form:

"Mark as Complete" button
Brief field for solution summary
Repository changes summary (commit IDs)
Optional: link to follow-up session



7. Post-Session Flow

Simple Rating Exchange:

Rate the experience (1-5 stars)
Optional comment field
Notification of payment processing



*** Others if time **

Technical Implementation Notes for MVP

Authentication:

GitHub OAuth for simplicity (handles identity and repo access)
No custom auth system needed initially


Database:

Simple schema with just Users, Jobs, Bids, and Sessions tables
Minimal fields in each table


GitHub Integration:

Basic API implementation for repo/branch information
No deep code analysis features initially


Microsoft Live Share Integration:

Use Microsoft's existing APIs to generate session links
Store session metadata (start/end times, participants)
Minimal custom development around the Live Share experience


Payment:

Implement placeholder for payment (can use Stripe Connect for actual transactions)
Simple escrow concept: funds held until session marked complete



Core Functionality Preserved
Despite simplifications, the MVP maintains these core functions:

Engineers can discover relevant problems
They can bid on problems that match their skills
Clear acceptance flow
Functional collaboration via Microsoft Live Share
Session completion and feedback

