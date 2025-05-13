# Kondition Expo - Frontend Documentation

## Overview

This is the React Native/Expo frontend for the Kondition fitness motivator application. It provides a mobile interface for users to track workouts, set schedules, monitor progress, and stay motivated on their fitness journey.

## Tech Stack

- **React Native**: Cross-platform mobile framework
- **Expo**: Development platform for React Native
- **Expo Router**: File-based routing system
- **React Navigation**: Navigation library
- **Expo Vector Icons**: Icon library
- **TypeScript**: Type-safe JavaScript

## Project Structure

```
KonditionExpo/
├── app/                  # Main application screens and navigation
│   ├── _layout.tsx       # Root layout with navigation setup
│   ├── login.tsx         # Login screen
│   ├── (tabs)/           # Tab-based navigation
│   │   ├── _layout.tsx   # Tab navigation configuration
│   │   ├── index.tsx     # Home tab screen
│   │   └── explore.tsx   # Explore tab screen
├── assets/               # Static assets (images, fonts)
├── components/           # Reusable UI components
│   ├── ui/               # Basic UI components
│   └── ...               # Feature-specific components
├── constants/            # App constants and configuration
├── hooks/                # Custom React hooks
└── scripts/              # Utility scripts
```

## Screens

### Login Screen

The login screen provides user authentication functionality:

- Email and password input with validation
- "Remember me" option
- Password visibility toggle
- Error handling for invalid credentials
- Navigation to signup (placeholder)
- Forgot password functionality (placeholder)

```typescript
// Key components:
<KeyboardAvoidingView>
  <Input label="Email" />
  <Input label="Password" secureTextEntry={!showPassword} />
  <Checkbox isChecked={rememberMe} onChange={setRememberMe} label="Remember me" />
  <Button title="Sign In" onPress={handleLogin} />
</KeyboardAvoidingView>
```

### Home Screen

The home screen serves as the main entry point for the application:

- App logo and branding
- Welcome message and tagline
- Call-to-action buttons for authentication
- Navigation to other app sections

```typescript
// Key components:
<ScrollView>
  <Image source={require('@/assets/images/icon.png')} />
  <ThemedText type="title">KONDITION</ThemedText>
  <ThemedText>Your Personal Fitness Journey Starts Here</ThemedText>
  <Button title="Sign In" onPress={handleNavigateToLogin} />
</ScrollView>
```

### Explore Screen

The explore screen showcases the app's features:

- List of features with icons and descriptions
- Visual representation of app capabilities
- Numbered feature items for easy reference

```typescript
// Key components:
<ScrollView>
  <ThemedText type="title">FEATURES</ThemedText>
  <FeatureItem number={1} title="WORKOUT PLANS" icon="fitness-outline" />
  <FeatureItem number={2} title="NUTRITION TRACKING" icon="nutrition-outline" />
  {/* Additional feature items */}
</ScrollView>
```

## Components

### UI Components

#### Button

A customizable button component with various states:

- Multiple variants: solid, outline, ghost
- Size options: sm, md, lg
- Loading state with spinner
- Disabled state
- Full-width option

#### Input

A form input component with validation:

- Label and placeholder
- Error state and message
- Right icon for actions (e.g., password visibility)
- Various keyboard types

#### Checkbox

A toggle component for boolean inputs:

- Checked and unchecked states
- Label support
- Custom styling

#### ThemedText

A text component with theme support:

- Adapts to light/dark mode
- Typography variants: title, subtitle, body
- Custom styling options

#### ThemedView

A view component with theme support:

- Adapts to light/dark mode
- Background color based on theme
- Custom styling options

#### IconSymbol

An icon wrapper for consistent styling:

- Platform-specific icons (iOS/Android)
- Size and color customization
- Support for various icon libraries

### Navigation Components

#### HapticTab

A tab button with haptic feedback:

- Provides tactile feedback on press
- Custom styling for active/inactive states
- Accessibility support

#### TabBarBackground

A styled background for the tab bar:

- Platform-specific styling (iOS blur effect)
- Theme-aware background colors
- Visual separation from content

## Theming

The app supports both light and dark modes:

- Color scheme detection based on system settings
- Theme-aware components
- Consistent styling across the app

```typescript
// Theme colors
export const Colors = {
  light: {
    text: '#000',
    background: '#fff',
    tint: '#007AFF',
    tabIconDefault: '#ccc',
    tabIconSelected: '#007AFF',
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: '#0A84FF',
    tabIconDefault: '#ccc',
    tabIconSelected: '#0A84FF',
  },
};
```

## Hooks

### useColorScheme

A hook to detect and use the device's color scheme:

```typescript
const colorScheme = useColorScheme(); // 'light' | 'dark'
```

### useThemeColor

A hook to get theme-specific colors:

```typescript
const backgroundColor = useThemeColor({}, 'background');
const textColor = useThemeColor({}, 'text');
```

## Authentication Flow

The current authentication implementation is a placeholder with simulated API calls:

1. User enters email and password
2. Client-side validation checks for valid email format and password length
3. On successful validation, a simulated API call is made
4. After successful "authentication," the user is redirected to the main app
5. Future implementation will connect to the FastAPI backend

## Development Setup

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS testing)
- Android Emulator or physical device (for Android testing)

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

### Environment Setup

The app uses Expo's configuration system:

```javascript
// app.json
{
  "expo": {
    "name": "KonditionExpo",
    "slug": "konditionexpo",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/images/icon.png",
    "scheme": "myapp",
    // Additional configuration...
  }
}
```

## Future Implementations

### Planned Features

1. **Authentication Integration**
   - Connect to FastAPI backend for real authentication
   - Implement token storage and refresh
   - Add signup functionality

2. **Workout Tracking**
   - Create workout logging screen
   - Implement calendar view for scheduling
   - Add progress charts and statistics

3. **Notifications**
   - Set up push notifications for workout reminders
   - Configure notification preferences

4. **Social Features**
   - Implement friend connections
   - Add activity feed
   - Create leaderboards and challenges

### Component Roadmap

- **WorkoutCard**: Display workout details
- **ProgressChart**: Visualize fitness progress
- **ScheduleCalendar**: Plan and view workout schedule
- **AchievementBadge**: Display user achievements
- **SocialFeed**: Show friend activities

## Best Practices

### Code Style

- Use TypeScript for type safety
- Follow React Native best practices
- Implement proper error handling
- Write meaningful comments

### Performance

- Optimize list rendering with FlatList
- Minimize re-renders with React.memo and useMemo
- Use image caching for better performance
- Implement lazy loading for heavy components

### Accessibility

- Provide proper labels for screen readers
- Ensure sufficient color contrast
- Support dynamic text sizes
- Implement keyboard navigation

## Troubleshooting

### Common Issues

1. **Metro bundler issues**
   - Solution: Clear cache with `expo start -c`

2. **Dependency conflicts**
   - Solution: Check package versions and resolve conflicts

3. **Expo build errors**
   - Solution: Verify Expo SDK compatibility

4. **Styling inconsistencies**
   - Solution: Use theme-aware components consistently

## Resources

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [Expo Router Documentation](https://docs.expo.dev/router/introduction/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
