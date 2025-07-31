# Leave Calendar Component

A professional, responsive leave calendar component built with Material-UI and TypeScript that displays employee leave schedules throughout the year.

## Features

- 📅 **Monthly Calendar View**: Clean, grid-based calendar layout
- 🎨 **Dynamic Theming**: Integrates with the application's theme system
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- 🔍 **Interactive Elements**: Click on dates to view leave details
- 📊 **Leave Indicators**: Visual indicators for different leave types
- 📈 **Statistics**: Built-in statistics and analytics
- 🔧 **Extensible**: Easy to maintain and extend

## Components

### 1. LeaveCalendar (`LeaveCalendar.tsx`)
The main calendar component that displays the monthly view with leave indicators.

**Props:**
```typescript
interface LeaveCalendarProps {
  leaveData?: LeaveDay[];
  onDayClick?: (date: Date, leaves: LeaveDay[]) => void;
  onLeaveClick?: (leave: LeaveDay) => void;
}
```

### 2. useLeaveCalendar Hook (`hooks/useLeaveCalendar.ts`)
Custom hook for managing leave data and providing utility functions.

**Returns:**
```typescript
{
  leaveData: LeaveDay[];
  loading: boolean;
  error: string | null;
  statistics: LeaveStatistics;
  getLeavesForDate: (date: Date) => LeaveDay[];
  getLeavesForDateRange: (startDate: Date, endDate: Date) => LeaveDay[];
  addLeave: (leave: Omit<LeaveDay, 'id'>) => void;
  updateLeave: (id: string, updates: Partial<LeaveDay>) => void;
  deleteLeave: (id: string) => void;
}
```

### 3. LeaveCalendarDemo (`LeaveCalendarDemo.tsx`)
Complete demo page showcasing all features with sample data.

## Data Structure

### LeaveDay Interface
```typescript
interface LeaveDay {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'annual' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'other';
  startDate: Date;
  endDate: Date;
  status: 'approved' | 'pending' | 'rejected';
  notes?: string;
}
```

### Leave Types
- **Annual Leave**: Green (#4caf50)
- **Sick Leave**: Red (#f44336)
- **Personal Leave**: Orange (#ff9800)
- **Maternity Leave**: Purple (#9c27b0)
- **Paternity Leave**: Blue (#2196f3)
- **Other Leave**: Gray (#607d8b)

## Usage Examples

### Basic Implementation
```tsx
import LeaveCalendar from './LeaveCalendar';
import { useLeaveCalendar } from './hooks/useLeaveCalendar';

const MyComponent = () => {
  const { leaveData, loading } = useLeaveCalendar();

  const handleDayClick = (date: Date, leaves: LeaveDay[]) => {
    console.log('Date clicked:', date, 'Leaves:', leaves);
  };

  const handleLeaveClick = (leave: LeaveDay) => {
    console.log('Leave clicked:', leave);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <LeaveCalendar
      leaveData={leaveData}
      onDayClick={handleDayClick}
      onLeaveClick={handleLeaveClick}
    />
  );
};
```

### With Filters
```tsx
const { leaveData } = useLeaveCalendar({
  employeeId: 'EMP001',
  leaveType: 'annual',
  status: 'approved',
  dateRange: {
    start: new Date('2024-01-01'),
    end: new Date('2024-12-31')
  }
});
```

### Adding New Leave
```tsx
const { addLeave } = useLeaveCalendar();

const handleAddLeave = () => {
  addLeave({
    employeeId: 'EMP001',
    employeeName: 'John Doe',
    leaveType: 'annual',
    startDate: new Date('2024-06-15'),
    endDate: new Date('2024-06-20'),
    status: 'pending',
    notes: 'Summer vacation'
  });
};
```

## Styling

The component uses Material-UI's `sx` prop for styling and integrates with the application's theme system. Key styling features:

- **Theme Integration**: Uses `themeColor` from settings context
- **Responsive Grid**: Adapts to different screen sizes
- **Hover Effects**: Smooth transitions and visual feedback
- **Color Coding**: Different colors for different leave types
- **Accessibility**: Proper contrast ratios and focus states

## Customization

### Adding New Leave Types
1. Update the `LEAVE_TYPES` object in `LeaveCalendar.tsx`
2. Add the new type to the `LeaveDay` interface
3. Update the type configurations with appropriate colors

```typescript
const LEAVE_TYPES = {
  // ... existing types
  training: { label: 'Training Leave', color: '#00bcd4', bgColor: '#e0f7fa' }
};
```

### Custom Styling
Override styles using Material-UI's `sx` prop or create custom CSS classes:

```tsx
<LeaveCalendar
  sx={{
    '& .calendar-day': {
      backgroundColor: 'custom-color',
      // ... other styles
    }
  }}
/>
```

### Extending Functionality
The component is designed to be easily extensible. Common extensions:

- **Export Features**: Add PDF/Excel export functionality
- **Bulk Operations**: Select multiple dates for bulk leave management
- **Notifications**: Add notification system for leave approvals
- **Integration**: Connect with external calendar systems

## Performance Considerations

- **Memoization**: Uses `useMemo` for expensive calculations
- **Virtualization**: Consider implementing virtual scrolling for large datasets
- **Lazy Loading**: Load leave data on demand for better performance
- **Caching**: Cache leave data to reduce API calls

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Dependencies

- Material-UI (@mui/material, @mui/icons-material)
- date-fns (for date manipulation)
- React 18+
- TypeScript 4.5+

## Future Enhancements

1. **Year View**: Add yearly calendar view
2. **Team View**: Show team leave schedules
3. **Conflict Detection**: Highlight overlapping leaves
4. **Drag & Drop**: Allow drag and drop for leave management
5. **Recurring Leaves**: Support for recurring leave patterns
6. **Leave Quotas**: Track and display leave balances
7. **Approval Workflow**: Integrated approval system
8. **Calendar Sync**: Sync with external calendars (Google, Outlook)

## Contributing

When extending the component:

1. Follow the existing TypeScript patterns
2. Maintain responsive design principles
3. Add proper error handling
4. Include accessibility features
5. Write unit tests for new functionality
6. Update documentation

## Troubleshooting

### Common Issues

1. **Dates not displaying correctly**: Ensure dates are proper Date objects
2. **Theme colors not updating**: Check that `useSettings` hook is properly connected
3. **Performance issues**: Consider implementing pagination for large datasets
4. **Mobile responsiveness**: Test on various screen sizes

### Debug Tips

- Use browser dev tools to inspect calendar grid
- Check console for date formatting errors
- Verify leave data structure matches interface
- Test with different theme colors 