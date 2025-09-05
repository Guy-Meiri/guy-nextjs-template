# Navigation Architecture Documentation

## Overview

The navigation system has been designed with a mobile-first approach, featuring a responsive hamburger menu for mobile devices and a clean desktop navigation bar. The system is modular, accessible, and maintains consistency across the application.

## Components Structure

### 1. SiteHeader (`src/components/layout/site-header.tsx`)
The main header component that serves as the container for navigation. It's now a client component that includes both desktop and mobile navigation.

**Features:**
- Responsive design
- Clickable logo/title that navigates to home
- Contains both mobile and desktop navigation components
- Clean, minimal interface

### 2. MobileNav (`src/components/layout/mobile-nav.tsx`)
A hamburger menu implementation using Shadcn's Sheet component for mobile screens.

**Features:**
- Hidden on desktop screens (`md:hidden`)
- Slide-out menu from the left side
- Contains navigation links, user authentication, and theme toggle
- Accessible with proper ARIA labels
- Auto-closes when navigating to prevent user confusion

**Navigation Items:**
- Home (public)
- Dashboard (protected - only shown when authenticated)
- User authentication section (sign in/out)
- Theme toggle integration

### 3. DesktopNav (`src/components/layout/desktop-nav.tsx`)
Clean desktop navigation that appears on larger screens.

**Features:**
- Hidden on mobile screens (shows only on `md:` and above)
- Horizontal layout with clean buttons
- Integrates existing UserNav component
- Shows appropriate navigation based on authentication state

### 4. UserNav (`src/components/auth/user-nav.tsx`)
Updated to be more responsive - now hides user name on smaller screens (`lg:` breakpoint instead of `sm:`).

## Navigation Configuration

Navigation items are defined in a shared configuration array:

```typescript
const navigationItems = [
  {
    title: "Home",
    href: "/",
    icon: Home,
    public: true,
  },
  {
    title: "Dashboard", 
    href: "/dashboard",
    icon: LayoutDashboard,
    protected: true,
  },
]
```

**Properties:**
- `title`: Display name for the navigation item
- `href`: Route path
- `icon`: Lucide React icon component
- `public`: Shows to all users
- `protected`: Only shows to authenticated users

## Responsive Breakpoints

- **Mobile**: `< md (768px)` - Shows hamburger menu
- **Desktop**: `>= md (768px)` - Shows desktop navigation
- **Large Desktop**: `>= lg (1024px)` - Shows full user information

## Accessibility Features

- Proper ARIA labels for screen readers
- Keyboard navigation support
- Focus management
- Semantic HTML structure
- Color contrast compliance with theme system

## Adding New Navigation Items

1. Add new item to the `navigationItems` array in both `mobile-nav.tsx` and `desktop-nav.tsx`
2. Import appropriate icon from `lucide-react`
3. Set `public: true` for public pages or `protected: true` for authenticated-only pages

## Theme Integration

Both navigation components integrate seamlessly with the existing theme system:
- Automatic dark/light mode support
- Uses semantic color tokens from Tailwind CSS
- Consistent styling with other UI components

## Technical Implementation

- **State Management**: Uses React's `useState` for mobile menu open/close
- **Authentication**: Integrates with NextAuth.js session management
- **Routing**: Uses Next.js Link component for client-side navigation
- **UI Components**: Built with Shadcn/ui components for consistency
- **Icons**: Uses Lucide React for consistent iconography

## Future Enhancements

Potential improvements for future versions:
- Breadcrumb navigation for complex page hierarchies
- Active state indicators for current page
- Keyboard shortcuts for power users
- Animation enhancements for smoother transitions
