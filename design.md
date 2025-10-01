# Design Philosophy - RAJ Image Studio

## Design Philosophy

### Color Palette
- **Primary Background**: Pure White (#FFFFFF)
- **Text Color**: Deep Black (#000000) for maximum contrast
- **Accent Color**: Vibrant Orange (#FF6B00) for CTAs and highlights
- **Border Color**: Light Gray (#E5E7EB) for subtle divisions
- **Success**: Green (#22C55E) for positive feedback
- **Error**: Red (#DC2626) for error states
- **Warning**: Amber (#F59E0B) for caution states

### Typography
- **Display Font**: Clash Display (Bold, 600-700 weight)
  - Used for: Main headings, brand name, section titles
  - Characteristics: Modern, geometric, high-impact
  - Fallback: 'Clash Display', sans-serif
  
- **Body Font**: Manrope (400-600 weight)
  - Used for: Body text, labels, buttons, inputs
  - Characteristics: Clean, readable, neutral
  - Fallback: 'Manrope', system-ui, sans-serif

### Visual Language
- **Minimalist Approach**: Clean, uncluttered interface focusing on functionality
- **High Contrast**: Strong black text on white background for readability
- **Geometric Precision**: Sharp edges, clean lines, systematic spacing
- **Purposeful Orange**: Used sparingly for maximum impact on key actions
- **Professional Aesthetic**: Business-like, trustworthy, sophisticated

## Visual Effects

### Used Libraries
- **Anime.js**: Smooth micro-interactions and state transitions
- **Splitting.js**: Text animation effects for headings
- **Typed.js**: Typewriter effect for dynamic text
- **ECharts.js**: Data visualization for generation statistics
- **Splide.js**: Image carousel for generated results
- **p5.js**: Creative coding for background effects

### Animation Effects
- **Typewriter Animation**: Main heading types out character by character
- **Fade-in Stagger**: UI elements appear with subtle staggered timing
- **Hover Micro-interactions**: Buttons lift slightly with shadow on hover
- **Loading States**: Smooth progress indicators during generation
- **Image Reveal**: Generated images fade in with scale animation

### Styling Approach
- **CSS Grid**: Primary layout system for responsive design
- **Flexbox**: Component-level alignment and distribution
- **Custom Properties**: CSS variables for consistent theming
- **Tailwind CSS**: Utility-first styling for rapid development
- **Glass Morphism**: Subtle transparency effects on modal overlays

### Header Effect
- **Clean Navigation**: Minimal header with brand name and history link
- **Sticky Behavior**: Header remains fixed during scroll
- **Subtle Shadow**: Soft drop shadow for depth separation
- **Orange Accent**: History link highlights on hover with orange underline

### Interactive Elements
- **Button States**: 
  - Default: White background, black text, gray border
  - Hover: Slight lift with orange border
  - Active: Orange background, white text
  - Disabled: Gray background, reduced opacity

- **Form Elements**:
  - Clean borders with focus states in orange
  - Smooth transitions between states
  - Clear validation feedback
  - Consistent padding and typography

- **Image Cards**:
  - Subtle border and shadow
  - Hover: Scale up slightly with enhanced shadow
  - Click: Smooth transition to editor modal

### Background Treatment
- **Pure White**: Clean, professional canvas
- **Subtle Texture**: Optional very light noise texture for depth
- **No Gradients**: Maintains minimalist aesthetic
- **Consistent Throughout**: Same background on all pages

### Responsive Design
- **Mobile First**: Optimized for touch interactions
- **Breakpoints**: 
  - Mobile: 320px - 768px
  - Tablet: 768px - 1024px
  - Desktop: 1024px+
- **Fluid Typography**: Scales appropriately across devices
- **Touch Targets**: Minimum 44px for mobile accessibility

### Accessibility
- **High Contrast**: 4.5:1 minimum ratio for all text
- **Focus Indicators**: Clear orange outline for keyboard navigation
- **Alt Text**: Descriptive text for all images
- **Screen Reader**: Semantic HTML and ARIA labels
- **Motion Respect**: Honors prefers-reduced-motion settings