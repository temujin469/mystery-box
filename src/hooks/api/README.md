# React Query API Hooks

This directory contains React Query hooks for all API services, providing type-safe, cached, and optimized data fetching and mutation capabilities.

## Setup

First, wrap your app with the `ReactQueryProvider`:

```tsx
import { ReactQueryProvider } from '@/providers';

function App() {
  return (
    <ReactQueryProvider>
      {/* Your app components */}
    </ReactQueryProvider>
  );
}
```

## Usage

### Authentication Hooks

```tsx
import { useLogin, useRegister, useAuthUser, useLogout } from '@/hooks/api';

function LoginForm() {
  const loginMutation = useLogin();
  const { data: user, isLoading } = useAuthUser();
  const logoutMutation = useLogout();

  const handleLogin = async (credentials) => {
    try {
      await loginMutation.mutateAsync(credentials);
      // User is now logged in
    } catch (error) {
      // Handle login error
    }
  };

  return (
    // Your login form JSX
  );
}
```

### User Hooks

```tsx
import { useUsers, useUser, useUpdateUser, useDeleteUser } from '@/hooks/api';

function UserList() {
  const { data: users, isLoading } = useUsers({ page: 1, limit: 10 });
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const handleUpdateUser = (id: string, data: UpdateUserData) => {
    updateUserMutation.mutate({ id, data });
  };

  return (
    // Your user list JSX
  );
}

function UserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading } = useUser(userId);
  const { data: stats } = useUserStats(userId);

  if (isLoading) return <div>Loading...</div>;

  return (
    // Your user profile JSX
  );
}
```

### Box Hooks

```tsx
import { useBoxes, useBox, useFeaturedBoxes, useCreateBox } from '@/hooks/api';

function BoxList() {
  const { data: boxes, isLoading } = useBoxes({ 
    page: 1, 
    limit: 12,
    isFeatured: true 
  });
  const { data: featuredBoxes } = useFeaturedBoxes();

  return (
    // Your box list JSX
  );
}

function BoxDetails({ boxId }: { boxId: number }) {
  const { data: box, isLoading } = useBox(boxId);
  
  if (isLoading) return <div>Loading...</div>;

  return (
    // Your box details JSX
  );
}

function CreateBoxForm() {
  const createBoxMutation = useCreateBox();

  const handleSubmit = async (boxData: CreateBoxData) => {
    try {
      await createBoxMutation.mutateAsync(boxData);
      // Box created successfully
    } catch (error) {
      // Handle error
    }
  };

  return (
    // Your create box form JSX
  );
}
```

### Item Hooks

```tsx
import { useItems, useItem, useCreateItem, useSearchItemsByName } from '@/hooks/api';

function ItemList() {
  const { data: items, isLoading } = useItems({ page: 1, limit: 20 });
  const createItemMutation = useCreateItem();

  return (
    // Your item list JSX
  );
}

function ItemSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: searchResults } = useSearchItemsByName(
    searchQuery, 
    searchQuery.length >= 2
  );

  return (
    // Your item search JSX
  );
}
```

### Address Hooks

```tsx
import { useAddresses, useDefaultAddress, useCreateAddress } from '@/hooks/api';

function AddressList({ userId }: { userId: string }) {
  const { data: addresses } = useAddressesByUserId(userId);
  const { data: defaultAddress } = useDefaultAddress(userId);
  const createAddressMutation = useCreateAddress();

  return (
    // Your address list JSX
  );
}
```

### Category Hooks

```tsx
import { useCategories, useActiveCategories, useToggleCategoryActive } from '@/hooks/api';

function CategoryList() {
  const { data: categories } = useCategories();
  const { data: activeCategories } = useActiveCategories();
  const toggleActiveMutation = useToggleCategoryActive();

  const handleToggleActive = (categoryId: number) => {
    toggleActiveMutation.mutate(categoryId);
  };

  return (
    // Your category list JSX
  );
}
```

## Advanced Usage

### Manual Cache Updates

```tsx
import { useQueryClient } from '@tanstack/react-query';
import { boxKeys } from '@/hooks/api';

function SomeComponent() {
  const queryClient = useQueryClient();

  // Manually invalidate queries
  const refreshBoxes = () => {
    queryClient.invalidateQueries({ queryKey: boxKeys.lists() });
  };

  // Manually set query data
  const updateBoxInCache = (box: Box) => {
    queryClient.setQueryData(boxKeys.detail(box.id), box);
  };

  return (
    // Your component JSX
  );
}
```

### Optimistic Updates

```tsx
import { useUpdateBox } from '@/hooks/api';

function BoxEditForm({ box }: { box: Box }) {
  const updateBoxMutation = useUpdateBox();

  const handleUpdate = (newData: UpdateBoxData) => {
    updateBoxMutation.mutate(
      { id: box.id, data: newData },
      {
        onSuccess: () => {
          // Handle success
        },
        onError: (error) => {
          // Handle error
        },
      }
    );
  };

  return (
    // Your form JSX
  );
}
```

### Conditional Queries

```tsx
import { useUser } from '@/hooks/api';

function ConditionalUserProfile({ userId }: { userId?: string }) {
  const { data: user, isLoading } = useUser(
    userId!, 
    !!userId // Only run query if userId exists
  );

  if (!userId) return <div>No user selected</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    // Your user profile JSX
  );
}
```

## Query Keys

Each hook exports query keys that you can use for advanced cache management:

```tsx
import { boxKeys, userKeys, itemKeys } from '@/hooks/api';

// Available query keys:
boxKeys.all              // ['boxes']
boxKeys.lists()          // ['boxes', 'list']
boxKeys.detail(id)       // ['boxes', 'detail', id]
boxKeys.featured()       // ['boxes', 'featured']

userKeys.all             // ['users']
userKeys.detail(id)      // ['users', 'detail', id]
userKeys.stats(id)       // ['users', 'detail', id, 'stats']
```

## Error Handling

All hooks automatically handle common error scenarios:

- 4xx errors (client errors) are not retried
- Network errors are retried up to 3 times
- Authentication errors (401) should be handled globally

```tsx
import { useBox } from '@/hooks/api';

function BoxComponent({ boxId }: { boxId: number }) {
  const { data: box, isLoading, error } = useBox(boxId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    // Your component JSX
  );
}
```

## Performance Tips

1. **Use appropriate stale times**: Hooks have sensible defaults, but you can override them
2. **Enable/disable queries conditionally**: Use the `enabled` option to prevent unnecessary requests
3. **Use query keys effectively**: Related queries share cache benefits
4. **Leverage optimistic updates**: For better UX in mutations

```tsx
// Custom stale time
const { data } = useBoxes(query, {
  staleTime: 10 * 60 * 1000, // 10 minutes
});

// Conditional query
const { data } = useUser(userId, {
  enabled: !!userId && userRole === 'admin',
});
```
