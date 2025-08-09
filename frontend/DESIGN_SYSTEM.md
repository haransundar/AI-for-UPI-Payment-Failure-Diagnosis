# UPI Diagnosis Platform - Design System

## 🎨 Design Philosophy

Our design system is built on the principles of **clarity**, **efficiency**, and **trust** - essential qualities for financial technology interfaces. We've elevated the familiar patterns of mainstream UPI apps while introducing innovative elements that enhance user experience and operational efficiency.

### Core Principles

1. **Clarity First** - Every element serves a purpose and communicates clearly
2. **Accessible by Design** - WCAG AA+ compliance is non-negotiable
3. **Performance Optimized** - Beautiful interfaces that load instantly
4. **Scalable Architecture** - Components that grow with the platform
5. **User-Centric** - Designed for both retail users and technical operators

## 🎯 Visual Identity

### Color System

#### Primary Palette
```scss
// Primary Blue - Trust & Reliability
$primary-50: #E3F2FD;
$primary-100: #BBDEFB;
$primary-200: #90CAF9;
$primary-300: #64B5F6;
$primary-400: #42A5F5;
$primary-500: #1976D2; // Main
$primary-600: #1565C0;
$primary-700: #0D47A1;
$primary-800: #0A3D91;
$primary-900: #063281;
```

#### Secondary Palette
```scss
// Teal - Innovation & Action
$secondary-50: #E0F2F1;
$secondary-100: #B2DFDB;
$secondary-200: #80CBC4;
$secondary-300: #4DB6AC;
$secondary-400: #26A69A;
$secondary-500: #00ACC1; // Main
$secondary-600: #00838F;
$secondary-700: #00695C;
$secondary-800: #004D40;
$secondary-900: #003D32;
```

#### Semantic Colors
```scss
// Success - Positive Actions
$success: #4CAF50;
$success-light: #81C784;
$success-dark: #388E3C;

// Error - Critical States
$error: #F44336;
$error-light: #EF5350;
$error-dark: #D32F2F;

// Warning - Caution States
$warning: #FF9800;
$warning-light: #FFB74D;
$warning-dark: #F57C00;

// Info - Informational
$info: #2196F3;
$info-light: #64B5F6;
$info-dark: #1976D2;
```

#### Neutral Palette
```scss
// Grays for text and backgrounds
$gray-50: #FAFAFA;
$gray-100: #F5F5F5;
$gray-200: #EEEEEE;
$gray-300: #E0E0E0;
$gray-400: #BDBDBD;
$gray-500: #9E9E9E;
$gray-600: #757575;
$gray-700: #616161;
$gray-800: #424242;
$gray-900: #212121;
```

### Gradients

#### Primary Gradients
```css
/* Primary Gradient - Headers, CTAs */
.gradient-primary {
  background: linear-gradient(135deg, #1976D2 0%, #42A5F5 100%);
}

/* Secondary Gradient - Accents, Highlights */
.gradient-secondary {
  background: linear-gradient(135deg, #00ACC1 0%, #26C6DA 100%);
}

/* Success Gradient - Positive States */
.gradient-success {
  background: linear-gradient(135deg, #4CAF50 0%, #81C784 100%);
}

/* Card Gradient - Subtle elevation */
.gradient-card {
  background: linear-gradient(145deg, #FFFFFF 0%, #F8F9FA 100%);
}
```

## 📝 Typography

### Font Stack
```css
font-family: 'Roboto', 'Noto Sans', 'Product Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Type Scale
```scss
// Display - Hero sections
$display-1: 3.5rem;   // 56px
$display-2: 3rem;     // 48px
$display-3: 2.5rem;   // 40px

// Headings
$h1: 2.5rem;          // 40px - Page titles
$h2: 2rem;            // 32px - Section headers
$h3: 1.5rem;          // 24px - Subsection headers
$h4: 1.25rem;         // 20px - Card titles
$h5: 1.125rem;        // 18px - Component titles
$h6: 1rem;            // 16px - Small headers

// Body text
$body-1: 1rem;        // 16px - Primary body text
$body-2: 0.875rem;    // 14px - Secondary body text
$caption: 0.75rem;    // 12px - Captions, labels
$overline: 0.75rem;   // 12px - Overline text

// Interactive
$button: 0.875rem;    // 14px - Button text
$input: 1rem;         // 16px - Input text
```

### Font Weights
```scss
$font-light: 300;     // Light text
$font-regular: 400;   // Body text
$font-medium: 500;    // Emphasized text
$font-semibold: 600;  // Subheadings
$font-bold: 700;      // Headings
```

### Line Heights
```scss
$line-height-tight: 1.2;    // Headings
$line-height-normal: 1.4;   // UI text
$line-height-relaxed: 1.6;  // Body text
$line-height-loose: 1.8;    // Long-form content
```

## 📐 Spacing System

### Base Unit: 8px
All spacing follows an 8px grid system for visual consistency and developer efficiency.

```scss
$space-1: 0.25rem;    // 4px
$space-2: 0.5rem;     // 8px
$space-3: 0.75rem;    // 12px
$space-4: 1rem;       // 16px
$space-5: 1.25rem;    // 20px
$space-6: 1.5rem;     // 24px
$space-8: 2rem;       // 32px
$space-10: 2.5rem;    // 40px
$space-12: 3rem;      // 48px
$space-16: 4rem;      // 64px
$space-20: 5rem;      // 80px
$space-24: 6rem;      // 96px
```

### Component Spacing
```scss
// Cards
$card-padding: $space-6;           // 24px
$card-margin: $space-4;            // 16px

// Buttons
$button-padding-x: $space-6;       // 24px
$button-padding-y: $space-3;       // 12px

// Form elements
$input-padding: $space-4;          // 16px
$form-group-margin: $space-4;      // 16px
```

## 🔲 Layout System

### Breakpoints
```scss
$breakpoint-xs: 0px;      // Mobile portrait
$breakpoint-sm: 600px;    // Mobile landscape
$breakpoint-md: 960px;    // Tablet
$breakpoint-lg: 1280px;   // Desktop
$breakpoint-xl: 1920px;   // Large desktop
```

### Grid System
```scss
// Container max-widths
$container-sm: 540px;
$container-md: 720px;
$container-lg: 960px;
$container-xl: 1140px;
$container-xxl: 1400px;

// Grid columns
$grid-columns: 12;
$grid-gutter: 24px;
```

### Z-Index Scale
```scss
$z-dropdown: 1000;
$z-sticky: 1020;
$z-fixed: 1030;
$z-modal-backdrop: 1040;
$z-modal: 1050;
$z-popover: 1060;
$z-tooltip: 1070;
```

## 🎭 Component Library

### Buttons

#### Primary Button
```jsx
<Button 
  variant="contained" 
  color="primary"
  size="large"
  startIcon={<Icon />}
>
  Primary Action
</Button>
```

#### Secondary Button
```jsx
<Button 
  variant="outlined" 
  color="primary"
  size="medium"
>
  Secondary Action
</Button>
```

#### Button Sizes
- **Small**: 32px height, 12px padding
- **Medium**: 40px height, 16px padding  
- **Large**: 48px height, 24px padding

### Cards

#### Standard Card
```jsx
<Card sx={{ 
  borderRadius: 3,
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
  background: 'linear-gradient(145deg, #FFFFFF 0%, #F8F9FA 100%)'
}}>
  <CardContent sx={{ p: 3 }}>
    {/* Content */}
  </CardContent>
</Card>
```

#### Elevated Card
```jsx
<Card sx={{ 
  borderRadius: 3,
  boxShadow: '0px 8px 32px rgba(0, 0, 0, 0.12)',
  transform: 'translateY(-2px)'
}}>
  {/* Content */}
</Card>
```

### Form Elements

#### Text Input
```jsx
<TextField
  fullWidth
  variant="outlined"
  label="Label"
  placeholder="Placeholder text"
  sx={{
    '& .MuiOutlinedInput-root': {
      borderRadius: 3,
    }
  }}
/>
```

#### Select Dropdown
```jsx
<FormControl fullWidth>
  <InputLabel>Select Option</InputLabel>
  <Select
    value={value}
    label="Select Option"
    onChange={handleChange}
    sx={{ borderRadius: 3 }}
  >
    <MenuItem value="option1">Option 1</MenuItem>
  </Select>
</FormControl>
```

### Status Indicators

#### Status Chips
```jsx
// Success
<Chip label="Success" color="success" variant="filled" />

// Error  
<Chip label="Failed" color="error" variant="filled" />

// Warning
<Chip label="Pending" color="warning" variant="filled" />

// Info
<Chip label="Processing" color="info" variant="filled" />
```

#### Progress Indicators
```jsx
// Circular Progress
<CircularProgress 
  size={40} 
  thickness={4}
  sx={{
    '& .MuiCircularProgress-circle': {
      strokeLinecap: 'round',
    },
  }}
/>

// Linear Progress
<LinearProgress 
  variant="determinate" 
  value={progress}
  sx={{ 
    borderRadius: 2,
    height: 8 
  }}
/>
```

## 🎨 Iconography

### Icon System
- **Primary Icons**: Material Icons (outlined style)
- **Size Scale**: 16px, 20px, 24px, 32px, 40px, 48px
- **Usage**: Consistent semantic meaning across the platform

#### Common Icons
```jsx
// Navigation
<Dashboard />     // Dashboard
<Receipt />       // Transactions  
<Analytics />     // Analytics
<Notifications /> // Notifications
<Person />        // Profile

// Actions
<Add />           // Create/Add
<Edit />          // Edit
<Delete />        // Delete
<Search />        // Search
<Filter />        // Filter
<Download />      // Export

// Status
<CheckCircle />   // Success
<Error />         // Error
<Warning />       // Warning
<Info />          // Information
<Schedule />      // Pending
```

## 🌙 Dark Mode

### Color Adaptations
```scss
// Dark theme palette
$dark-background-default: #121212;
$dark-background-paper: #1E1E1E;
$dark-background-elevated: #2C2C2C;

$dark-text-primary: #FFFFFF;
$dark-text-secondary: #B3B3B3;
$dark-text-disabled: #666666;

$dark-divider: #333333;
```

### Component Adaptations
- **Cards**: Darker backgrounds with subtle gradients
- **Inputs**: Dark backgrounds with light borders
- **Buttons**: Adjusted contrast ratios
- **Shadows**: Lighter shadows for dark backgrounds

## 📱 Mobile Adaptations

### Touch Targets
- **Minimum Size**: 44px × 44px
- **Recommended**: 48px × 48px for primary actions
- **Spacing**: 8px minimum between touch targets

### Mobile-Specific Components
```jsx
// Bottom Navigation (Mobile)
<BottomNavigation>
  <BottomNavigationAction 
    label="Dashboard" 
    icon={<Dashboard />} 
  />
  <BottomNavigationAction 
    label="Transactions" 
    icon={<Receipt />} 
  />
</BottomNavigation>

// Mobile Drawer
<Drawer
  variant="temporary"
  anchor="left"
  open={mobileOpen}
  onClose={handleDrawerToggle}
  ModalProps={{ keepMounted: true }}
>
  {/* Navigation content */}
</Drawer>
```

## ♿ Accessibility Guidelines

### Color Contrast
- **Normal Text**: 4.5:1 minimum ratio
- **Large Text**: 3:1 minimum ratio
- **UI Components**: 3:1 minimum ratio

### Focus Management
```css
/* Focus indicators */
.focus-visible {
  outline: 2px solid #1976D2;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Skip links */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: #1976D2;
  color: white;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
}

.skip-link:focus {
  top: 6px;
}
```

### ARIA Labels
```jsx
// Buttons
<Button aria-label="Diagnose transaction TXN001">
  <Psychology />
</Button>

// Form inputs
<TextField
  aria-label="Search transactions"
  aria-describedby="search-help-text"
/>

// Status indicators
<Chip 
  label="Failed" 
  aria-label="Transaction status: Failed"
/>
```

## 🎬 Animation & Motion

### Transition Timing
```scss
// Easing functions
$ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
$ease-out: cubic-bezier(0.0, 0, 0.2, 1);
$ease-in: cubic-bezier(0.4, 0, 1, 1);

// Duration scale
$duration-short: 150ms;
$duration-standard: 300ms;
$duration-long: 500ms;
```

### Common Animations
```jsx
// Fade in
const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.3 }
};

// Slide up
const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3 }
};

// Scale in
const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.3 }
};
```

## 🔧 Implementation Guidelines

### CSS-in-JS Best Practices
```jsx
// Use theme values
const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius * 2,
  padding: theme.spacing(3),
  background: theme.palette.gradient.card,
}));

// Responsive styles
const ResponsiveBox = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4),
  },
}));
```

### Component Composition
```jsx
// Compound components
<TransactionCard>
  <TransactionCard.Header>
    <TransactionCard.Title />
    <TransactionCard.Status />
  </TransactionCard.Header>
  <TransactionCard.Content>
    <TransactionCard.Details />
    <TransactionCard.Actions />
  </TransactionCard.Content>
</TransactionCard>
```

This design system ensures consistency, accessibility, and scalability across the entire UPI Diagnosis Platform while maintaining the high standards expected in modern financial technology interfaces.