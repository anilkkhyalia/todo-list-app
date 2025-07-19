# Todo List App

A modern, feature-rich todo list application built with vanilla JavaScript, HTML, and CSS. This app provides all the essential task management features you need to stay organized and productive.

## Features

### Core Functionality
- ✅ **Add Tasks** - Create new tasks with optional due dates
- ✅ **View Tasks** - Clean, organized display of all your tasks
- ✅ **Mark Complete** - Check off completed tasks with visual feedback
- ✅ **Delete Tasks** - Remove tasks you no longer need

### Enhanced Features
- 📝 **Edit Tasks** - Inline editing to modify task text
- 📅 **Due Dates** - Set due dates with visual indicators for overdue and today's tasks
- 💾 **Persistent Storage** - Tasks automatically save to localStorage and persist between sessions
- 🔍 **Smart Filters** - View All, Active, or Completed tasks
- 🎨 **Modern UI** - Clean, responsive design with hover effects and smooth transitions

### Visual Indicators
- 🔴 **Overdue Tasks** - Red highlighting for past due items
- 🟡 **Due Today** - Yellow highlighting for tasks due today
- ✨ **Strikethrough** - Completed tasks show with strikethrough text
- 🎯 **Checkbox Interface** - Intuitive checkbox-style task completion

## File Structure

```
todo-list-app/
├── index.html           # Main HTML file
├── style.css           # Styling and layout
├── script-fixed.js     # Main application logic (single file)
├── README.md          # This file
├── js/                # Modular version (for development)
│   ├── app.js         # Main app coordinator
│   ├── TaskManager.js # Task operations
│   ├── UIManager.js   # DOM manipulation
│   ├── StorageManager.js # LocalStorage handling
│   └── Utils.js       # Helper functions
└── test.html          # ES6 module test version
```

## How to Run

### Option 1: Simple (Recommended)
1. Download or clone this repository
2. Open `index.html` directly in any modern web browser
3. Start adding tasks!

### Option 2: Local Web Server (For Development)
If you want to use the modular ES6 version:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## Usage Guide

### Adding Tasks
1. Type your task in the text input field
2. Optionally select a due date using the date picker
3. Click "Add Task" or press Enter
4. Your task appears in the list below

### Managing Tasks
- **Complete**: Click the checkbox next to any task
- **Edit**: Click the "Edit" button, modify the text, then click "Save"
- **Delete**: Click the "Delete" button to remove a task permanently

### Filtering Tasks
Use the filter buttons at the top to view:
- **All** - Shows every task
- **Active** - Shows only incomplete tasks
- **Completed** - Shows only finished tasks

### Due Date Features
- Tasks without due dates appear normally
- Tasks due today show in yellow
- Overdue tasks show in red
- All due dates display in a readable format

## Technical Details

### Architecture
The app uses a modular architecture with clear separation of concerns:

- **TaskManager** - Handles all task-related operations (CRUD)
- **UIManager** - Manages DOM manipulation and user interface
- **StorageManager** - Handles localStorage operations
- **Utils** - Provides helper functions for formatting and validation

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Storage
Tasks are automatically saved to your browser's localStorage, meaning:
- Tasks persist between browser sessions
- Data stays on your device (privacy-friendly)
- No internet connection required
- Works offline completely

### Performance
- Lightweight (~15KB total)
- Fast rendering with vanilla JavaScript
- No external dependencies
- Responsive design works on all screen sizes

## Development

### Code Organization
The project includes both single-file and modular versions:

**Single File Version** (`script-fixed.js`):
- Works when opening HTML directly
- All code in one file for simplicity
- Recommended for quick setup

**Modular Version** (`js/` folder):
- ES6 modules with proper separation
- Better for development and maintenance
- Requires local web server

### Key Classes
- `TodoApp` - Main application controller
- `TaskManager` - Task data management
- `UIManager` - User interface handling
- `StorageManager` - Data persistence
- `Utils` - Helper utilities

### Adding Features
To add new features:
1. Modify the appropriate class in the modular version
2. Test using a local web server
3. Update the single-file version if needed
4. Update this README

## Customization

### Styling
Edit `style.css` to customize:
- Colors and themes
- Font sizes and families
- Layout and spacing
- Button styles
- Animation effects

### Functionality
Modify the JavaScript files to add:
- New task properties
- Additional filters
- Different storage backends
- Export/import features
- Task categories or tags

## Browser Local Storage

The app uses localStorage to save:
- Task list data
- Task ID counter
- User preferences

To clear all data:
```javascript
localStorage.removeItem('todoTasks');
localStorage.removeItem('todoTaskIdCounter');
```

## Troubleshooting

### Common Issues

**Buttons not working:**
- Make sure you're using `index.html` with `script-fixed.js`
- Check browser console for JavaScript errors

**Tasks not saving:**
- Ensure localStorage is enabled in your browser
- Check if you're in private/incognito mode

**Modules not loading:**
- ES6 modules require a web server
- Use `index.html` for direct file opening
- Use `test.html` only with a web server

### Getting Help
If you encounter issues:
1. Check the browser console for errors
2. Ensure you're using a supported browser
3. Try refreshing the page
4. Clear localStorage if tasks seem corrupted

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to fork this project and submit pull requests for improvements!

### Ideas for Enhancement
- Drag and drop task reordering
- Task categories/tags
- Multiple todo lists
- Export to different formats
- Dark mode toggle
- Keyboard shortcuts
- Task search functionality
- Recurring tasks
- Task priority levels
- Collaboration features