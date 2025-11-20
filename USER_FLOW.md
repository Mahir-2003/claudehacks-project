# Badgers Register - User Flow Guide

## 🎯 How It Works

### Step 1: Navigate to enroll.wisc.edu
When you visit `enroll.wisc.edu` or any UW-Madison registration page, the extension automatically detects it.

### Step 2: Click the Floating Button
A **red floating button** appears in the bottom-right corner:
- Button text: "⭐ Badgers Copilot"
- Location: Bottom-right corner (30px from edges)
- Animation: Subtle bounce animation to catch attention

### Step 3: Sidebar Opens
When you click the button:
1. The button disappears
2. A sidebar slides in from the right side
3. The sidebar contains:
   - **Header**: Badgers Register logo and title
   - **Stats**: Current credits and courses selected
   - **Chat Area**: Interactive conversation interface
   - **Quick Actions**: "Recommend" and "Analyze Page" buttons
   - **Input Field**: Text input to ask questions

### Step 4: Interact with the Copilot
You can:

#### Ask Questions
- Type: "What courses should I take for CS major?"
- Type: "Show me easy gen ed classes"
- Type: "Help me find classes that fit my schedule"

#### Use Quick Actions
- **Recommend**: Automatically asks for personalized recommendations
- **Analyze Page**: Extracts courses from the current page and provides insights

#### Add Courses
- When the copilot suggests courses, they appear as cards
- Each card has an "Add to Schedule" button
- Click to add the course to your selected list
- Stats automatically update

### Step 5: Close the Sidebar
Click the X button in the top-right of the sidebar to close it
The floating button reappears in the bottom-right corner

## 🎨 Visual Layout

```
┌─────────────────────────────────────────┐
│ 🦡 Badgers Register              [X]    │ ← Header (Red)
├─────────────────────────────────────────┤
│  Credits: 15    |    Courses: 5         │ ← Stats
├─────────────────────────────────────────┤
│                                          │
│  👋 Hi there!                           │
│  I'm your class registration copilot    │
│                                          │
│  [User Message]                         │
│         [Assistant Response]            │
│                                          │
│  ┌────────────────────────────────┐    │
│  │ CS 400                          │    │
│  │ Programming III                 │    │
│  │ 3 credits • Prof. Smith         │    │
│  │ [Add to Schedule]               │    │
│  └────────────────────────────────┘    │
│                                          │
├─────────────────────────────────────────┤
│ [⭐ Recommend] [🔍 Analyze Page]       │ ← Quick Actions
├─────────────────────────────────────────┤
│ [Type your question here...] [Send →] │ ← Input
└─────────────────────────────────────────┘
```

## 🔄 Data Flow

### User → Extension → Backend → Extension → User

1. **User types message** in sidebar
2. **Content script** sends to background script
3. **Background script** sends to your backend API
4. **Backend** processes and returns recommendations
5. **Background script** sends response back
6. **Content script** displays in sidebar
7. **User** sees results and can interact

## 🎯 Key Features

### On Page Load
- ✅ Detects `enroll.wisc.edu` automatically
- ✅ Injects floating button
- ✅ Extracts course information from page
- ✅ Updates stats from storage

### Button Click
- ✅ Opens sidebar with smooth animation
- ✅ Hides floating button
- ✅ Focuses input field
- ✅ Loads conversation state

### Chat Interaction
- ✅ Real-time message sending
- ✅ Loading indicators
- ✅ Message history
- ✅ Course card display
- ✅ Add to schedule functionality

### Course Management
- ✅ Click "Add to Schedule" on any course card
- ✅ Automatically saves to Chrome storage
- ✅ Updates stats in real-time
- ✅ Syncs with backend (when connected)
- ✅ Highlights courses on the page

## 🎨 Design Details

### Colors
- **Primary Red**: #c5050c (Wisconsin Cardinal)
- **Dark Red**: #9b0000
- **White**: #ffffff
- **Light Gray**: #f5f5f5
- **Text Gray**: #646569

### Typography
- Font: System default (-apple-system, BlinkMacSystemFont, Segoe UI, Roboto)
- Sizes: 12px - 24px
- Weights: 400 (regular), 600 (semibold), 700 (bold)

### Animations
- Sidebar slide: 300ms cubic-bezier
- Button hover: 200ms ease
- Message fade-in: 300ms ease
- Bounce attention: 2s ease-in-out

## 🔧 Technical Notes

### Storage
```javascript
{
  selectedCourses: [
    { code: "CS 400", title: "...", credits: 3, ... }
  ],
  userPreferences: {
    major: "Computer Science",
    interests: ["AI", "Systems"],
    ...
  }
}
```

### Message Format (Backend)
```javascript
// Request
{
  message: "user question",
  pageContext: {
    url: "https://enroll.wisc.edu/...",
    courses: [...detected courses...]
  },
  selectedCourses: [...]
}

// Response
{
  message: "assistant response",
  courses: [
    { code: "CS 400", title: "...", credits: 3, instructor: "..." }
  ]
}
```

## 📱 Responsive Behavior

- **Desktop**: 420px sidebar width
- **Mobile**: Full-width sidebar (100vw)
- **Button**: Scales on smaller screens

## ⚡ Performance

- Lazy loading: Sidebar only created when needed
- Efficient DOM queries: Cached selectors
- Debounced updates: Prevents excessive API calls
- Local storage: Instant data access
