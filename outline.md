# Project Outline - RAJ Image Studio

## File Structure
```
/mnt/okcomputer/output/
├── index.html              # Main image generation interface
├── history.html            # Generation history page
├── main.js                 # Core JavaScript functionality
├── resources/              # Local assets folder
│   ├── hero-abstract.jpg   # Abstract hero image
│   ├── hero-creative.jpg   # Creative tools hero image
│   ├── hero-studio.jpg     # Studio workspace hero image
│   └── sample-*.jpg        # Sample generated images
├── interaction.md          # Interaction design document
├── design.md              # Visual design specifications
└── outline.md             # This project outline
```

## Page Breakdown

### index.html - Main Generation Interface
**Purpose**: Primary image generation workspace
**Sections**:
1. **Header Navigation**
   - Brand name "RAJ Image Studio" (Clash Display)
   - History link (navigates to history.html)
   
2. **Hero Section** (Minimal - 1/5 screen height)
   - Subtle background with creative tools imagery
   - Typewriter animated heading
   - Brief tagline
   
3. **Main Content Area** (Grid Layout)
   - **Left Panel (40%)**: Generation Controls
     - Prompt input textarea
     - Negative prompt input
     - Style dropdown selector
     - Model selection with icons
     - Advanced settings accordion
     - Generate button (prominent orange)
   
   - **Right Panel (60%)**: Results Area
     - Real-time preview section
     - Generated images gallery
     - Image editing tools
     - Download/share options

4. **Footer**
   - Copyright information
   - "Personal Use Only" disclaimer

### history.html - Generation History
**Purpose**: View and manage past generations
**Sections**:
1. **Header Navigation** (Same as index)
2. **History Controls**
   - Clear all history button
   - Export history option
3. **History Grid**
   - Cards showing past generations
   - Thumbnail, prompt, timestamp
   - Reload prompt button
   - Delete individual entries
4. **Empty State**
   - Message when no history exists
   - Link back to generator

## Interactive Components

### 1. Image Generation Engine
- **Location**: Main interface center-left
- **Function**: Core image creation workflow
- **Features**: 
  - Real-time preview generation
  - Parameter validation
  - Loading states
  - Error handling

### 2. Advanced Settings Panel
- **Location**: Expandable accordion in left panel
- **Function**: Fine-tune generation parameters
- **Features**:
  - CFG Scale slider (1-24)
  - Output count selector (1-4)
  - Resolution dropdown
  - Format selection
  - Seed input/randomizer

### 3. Image Gallery & Editor
- **Location**: Right panel results area
- **Function**: Display and edit generated images
- **Features**:
  - Grid layout for multiple outputs
  - Click to open editor modal
  - Basic editing tools
  - Download functionality

### 4. History Management System
- **Location**: Separate history.html page
- **Function**: Track and manage generations
- **Features**:
  - LocalStorage persistence
  - Search and filter
  - Batch operations
  - Import/export

## Technical Implementation

### Core Libraries Used
1. **Anime.js** - Smooth animations and transitions
2. **Splitting.js** - Text animation effects
3. **Typed.js** - Typewriter effects for headings
4. **ECharts.js** - Data visualization (generation stats)
5. **Splide.js** - Image carousel functionality
6. **p5.js** - Creative background effects

### JavaScript Architecture
- **main.js**: Core application logic
- **Modular Functions**:
  - `generateImage()`: Handle image generation
  - `updatePreview()`: Real-time preview updates
  - `saveToHistory()`: Persist generations
  - `loadHistory()`: Retrieve past generations
  - `editImage()`: Image editing functionality
  - `exportResults()`: Download/share images

### Data Flow
1. User inputs prompt and settings
2. Real-time preview updates via API
3. User clicks generate
4. Full generation process
5. Results displayed in gallery
6. Auto-saved to history
7. Available for editing/download

### Responsive Design
- **Mobile**: Single column layout, stacked controls
- **Tablet**: Two column layout, optimized touch targets
- **Desktop**: Full grid layout with hover effects

## Content Requirements

### Images Needed
- **Hero Images**: 3 abstract/creative images for hero section
- **Sample Generations**: 12+ example AI-generated images
- **UI Icons**: Model selection icons (⚡🌀🖼️🚀🌌📸🇯🇵🧵🌃🎨👾)

### Text Content
- **Brand Name**: "RAJ Image Studio"
- **Tagline**: "Create stunning AI-generated images with professional control"
- **Model Descriptions**: Clear, concise explanations
- **Help Text**: Tooltips and guidance throughout interface
- **Error Messages**: User-friendly error handling

## Performance Considerations
- **Lazy Loading**: Images load as needed
- **Debounced Inputs**: Prevent excessive API calls
- **Local Caching**: Cache preview results
- **Optimized Assets**: Compressed images and minified code
- **Progressive Enhancement**: Core functionality works without JavaScript