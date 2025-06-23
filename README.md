# 🔄 Recursion Unfolded: Interactive Multi-Language Visualizer

A modern, interactive web application built with Next.js 14 that helps beginners understand recursion through step-by-step visualizations across multiple programming languages.

## ✨ Features

### 🎯 Core Functionality
- **Interactive Visualizations** - Step-by-step call stack animations
- **Multi-Language Support** - JavaScript, TypeScript, Python, Java, C++
- **Classic Problems** - Factorial, Fibonacci, Tower of Hanoi
- **Real-time Code Highlighting** - Syntax highlighting with current line tracking
- **Playback Controls** - Play, pause, step through, and adjust speed

### 🎨 User Experience
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Beautiful Animations** - Smooth transitions using Framer Motion
- **Educational Tooltips** - Contextual explanations for each concept
- **Interactive Elements** - Hover effects, smooth transitions
- **Progress Tracking** - Visual progress indicators and step counters

### 📚 Educational Features
- **Concept Explanations** - Detailed explanations of recursion concepts
- **Complexity Analysis** - Time and space complexity information
- **Learning Tips** - Best practices and common pitfalls
- **Code Examples** - Well-commented code in all supported languages

## 🚀 Getting Started

### Prerequisites
- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd recursion-visualizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
recursion-visualizer/
├── app/                    # Next.js 14 App Router
│   ├── globals.css        # Global styles and Prism themes
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Main page component
├── components/            # React components
│   ├── RecursionVisualizer.tsx    # Main orchestrator component
│   ├── CodeDisplay.tsx            # Syntax highlighting component
│   ├── CallStackVisualizer.tsx    # Call stack animation
│   ├── LanguageSelector.tsx       # Language switching
│   ├── ProblemSelector.tsx        # Problem selection
│   ├── ControlPanel.tsx           # Playback controls
│   ├── ConceptsPanel.tsx          # Educational content
│   ├── Header.tsx                 # Site header
│   └── Footer.tsx                 # Site footer
├── data/                  # Data and configurations
│   └── recursionProblems.ts      # Problem definitions
├── types/                 # TypeScript type definitions
│   └── index.ts
├── public/                # Static assets
└── README.md
```

## 🎨 Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Syntax Highlighting**: Prism.js
- **Icons**: Lucide React
- **Font**: Inter (Google Fonts)

## 📖 Supported Problems

### 1. Factorial Calculation
- **Difficulty**: Beginner
- **Concepts**: Base case, recursive case, mathematical induction
- **Time Complexity**: O(n)
- **Space Complexity**: O(n)

### 2. Fibonacci Sequence
- **Difficulty**: Intermediate  
- **Concepts**: Tree recursion, multiple recursive calls, exponential complexity
- **Time Complexity**: O(2^n)
- **Space Complexity**: O(n)

### 3. Tower of Hanoi
- **Difficulty**: Advanced
- **Concepts**: Divide and conquer, recursive problem decomposition
- **Time Complexity**: O(2^n)
- **Space Complexity**: O(n)

## 🌐 Supported Languages

| Language   | File Extension | Syntax Highlighting |
|------------|----------------|-------------------|
| JavaScript | `.js`          | ✅                |
| TypeScript | `.ts`          | ✅                |
| Python     | `.py`          | ✅                |
| Java       | `.java`        | ✅                |
| C++        | `.cpp`         | ✅                |

## 🎛️ Controls & Features

### Playback Controls
- **Play/Pause**: Automatic step-through animation
- **Step Forward/Back**: Manual navigation through steps
- **Reset**: Return to the beginning
- **Speed Control**: Adjust animation speed (0.5x to 4x)

### Visualization Options
- **Call Stack**: Toggle call stack visualization
- **Variables**: Show/hide variable states
- **Line Highlighting**: Current execution line in code
- **Progress Indicator**: Visual progress bar

## 🎓 Educational Content

### Key Concepts Covered
- **Base Cases**: Understanding termination conditions
- **Recursive Cases**: Self-referential function calls
- **Call Stack**: How function calls are managed
- **Time Complexity**: Performance analysis
- **Space Complexity**: Memory usage patterns

### Learning Tips
1. **Start with the base case** - Identify the simplest scenario
2. **Trust the recursion** - Assume smaller problems are solved correctly
3. **Ensure progress** - Each call should move toward the base case
4. **Trace examples** - Walk through small inputs manually

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Code Style
- **TypeScript** for type safety
- **ESLint** for code quality
- **Prettier** for code formatting
- **Tailwind CSS** for consistent styling

## 🎯 Future Enhancements

- [ ] Additional recursion problems (Binary Tree Traversal, Merge Sort)
- [ ] User-defined custom problems
- [ ] Code editor with live visualization
- [ ] Interactive quizzes and challenges
- [ ] Performance comparison tools
- [ ] Export visualizations as GIFs
- [ ] Dark mode support
- [ ] Multiple theme options

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📝 License

This project is created for educational purposes. Feel free to use it for learning and teaching recursion concepts.

## 🙏 Acknowledgments

- Built with modern web technologies for optimal learning experience
- Inspired by the need to make recursion concepts more accessible
- Designed with beginners in mind but useful for all skill levels

---

**Happy Learning! 🚀**

Master recursion through interactive visualization and hands-on practice.



## Installation

```bash
npm install
npm run dev
```

## Usage

1. Select an algorithm from the dropdown
2. Set input value (0-10)
3. Click "RUN VISUALIZATION"
4. Use controls to step through execution

## Technologies

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- SVG Graphics 