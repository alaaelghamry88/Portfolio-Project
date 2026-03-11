# React Frontend Guidelines

> A comprehensive, team-wide reference for building maintainable, performant, and accessible React applications with TypeScript.
>
> **Stack assumptions:** React · TypeScript · Redux Toolkit (RTK) · Tailwind CSS · react-i18next
>
> _This guide recommends patterns but acknowledges alternatives. Adapt to your project's needs._

---

## Table of Contents

1. [Project Structure & Naming](#-project-structure--naming)
2. [Component Design Principles](#-component-design-principles)
3. [React Server Components & Client/Server Boundary](#-react-server-components--clientserver-boundary)
4. [Headless UI & Component Libraries](#-headless-ui--component-libraries)
5. [TypeScript Best Practices](#-typescript-best-practices)
6. [State Management](#-state-management)
7. [Data Fetching & API Layer](#-data-fetching--api-layer)
8. [Form Handling](#-form-handling)
9. [Error Handling & Error Boundaries](#-error-handling--error-boundaries)
10. [Performance Optimizations](#-performance-optimizations)
11. [Styling with Tailwind CSS](#-styling-with-tailwind-css)
12. [Internationalization (i18n)](#-internationalization-i18n)
13. [Accessibility (a11y)](#-accessibility-a11y)
14. [Testing & Dependency Injection](#-testing--dependency-injection)
15. [Security](#-security)
16. [Feature Flags & Environment Configuration](#-feature-flags--environment-configuration)
17. [Monorepo Considerations](#-monorepo-considerations)
18. [Checklist](#-checklist)

---

## 📁 Project Structure & Naming

### Feature-Based Structure

Organize code by feature (domain), not by file type. Each feature is a self-contained module.

```
src/
├── features/
│   └── {feature-name}/
│       ├── api/                          # API layer (queries, mutations)
│       │   └── {featureName}Api.ts
│       ├── components/
│       │   ├── {ComponentName}/
│       │   │   ├── {ComponentName}.tsx
│       │   │   └── use{Feature}Logic.ts  # Custom hook for component logic
│       │   └── index.ts                  # Public exports
│       ├── hooks/                        # Feature-specific hooks
│       ├── utils/                        # Feature-specific utilities
│       ├── constants.ts                  # All feature constants
│       └── types.ts                      # Feature-specific types
├── components/
│   ├── ui/                               # Base UI primitives (Button, Input, Dialog)
│   ├── common/                           # Shared composite components (ErrorView, EmptyState)
│   └── form/                             # Shared form components (FormSelect, FormDatePicker)
├── hooks/                                # Global shared hooks
├── utils/                                # Global shared utilities
├── types/                                # Global shared types
├── pages/                                # Route entry points (thin wrappers)
├── i18n/                                 # Internationalization config & locales
└── styles/                               # Global styles, Tailwind config
```

### Naming Conventions

| Item | Convention | Example |
|------|-----------|---------|
| Feature folders | `kebab-case` | `user-management/` |
| Component files | `PascalCase` | `UserProfile.tsx` |
| Hook files | `camelCase` with `use` prefix | `useUserFilters.ts` |
| Utility files | `camelCase` | `formatDate.ts` |
| Constant files | `camelCase` | `constants.ts` |
| Type files | `camelCase` | `types.ts` |
| Test files | Same as source + `.test` | `UserProfile.test.tsx` |
| API files | `camelCase` + `Api` suffix | `userManagementApi.ts` |

### Barrel Exports

Use explicit named exports in `index.ts` files. Avoid wildcard re-exports.

```typescript
// ✅ GOOD: Explicit named exports
export { UserList } from './UserList/UserList'
export { UserCard } from './UserCard/UserCard'

// ❌ BAD: Wildcard re-exports (hurts tree-shaking)
export * from './UserList'
export * from './UserCard'
```

---

## 🧩 Component Design Principles

### Separation of Concerns — Three Layers

```typescript
// 1️⃣ PAGE: Route entry point — layout only, no logic
const UserManagementPage: React.FC = () => (
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
    <UserList />
  </div>
)

// 2️⃣ CONTAINER: Data fetching, state, business logic
const UserList: React.FC = () => {
  const { data, isLoading, isError, refetch } = useGetUsersQuery()
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCreate = async (values: CreateUserDTO) => {
    await createUser(values).unwrap()
    refetch()
  }

  if (isError) return <ErrorView onRetry={refetch} />
  if (isLoading) return <UserListSkeleton />

  return <UserGrid items={data} onItemClick={handleItemClick} />
}

// 3️⃣ PRESENTER: Pure UI — props only, no data fetching hooks
interface UserGridProps {
  items: User[]
  onItemClick: (id: string) => void
}

const UserGrid: React.FC<UserGridProps> = ({ items, onItemClick }) => {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map(item => (
        <UserCard key={item.id} user={item} onClick={() => onItemClick(item.id)} />
      ))}
    </div>
  )
}
```

**Rules:**
- Pages contain layout only — no business logic, no data fetching
- Containers own hooks, state, API calls, and event handlers
- Presenters receive props, render UI, and may use `useTranslation` — nothing else
- Keep presenters simple, focused, and testable

### Single Responsibility

Each component should do one thing well. If a component has too many props, it's doing too much.

```typescript
// ✅ GOOD: Focused component with clear purpose
const UserAvatar: React.FC<{ user: User; size?: 'sm' | 'md' | 'lg' }> = ({
  user,
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
  } as const

  return (
    <div className={`rounded-full bg-primary-500 flex items-center justify-center ${sizeClasses[size]}`}>
      {user.firstName[0]}{user.lastName[0]}
    </div>
  )
}

// ❌ BAD: God component with too many responsibilities
const UserCard = ({
  user, onEdit, onDelete, showActions, showAvatar, showBio,
  compactMode, highlightActive, enableDragDrop, sortBy, filterBy, ...
}) => { /* Too complex — split it */ }
```

### Composition Over Configuration

Prefer composable children over deeply configurable prop APIs.

```typescript
// ✅ GOOD: Composable
<Card>
  <CardHeader>
    <CardTitle>{t('users.profile')}</CardTitle>
    <CardActions><Button>{t('common.edit')}</Button></CardActions>
  </CardHeader>
  <CardContent>
    <UserDetails user={user} />
  </CardContent>
</Card>

// ❌ BAD: Over-configured
<Card
  title="User Profile"
  showActions
  actionsConfig={{ edit: true, delete: false }}
  contentType="user"
  userData={user}
/>
```

### When to Extract Shared Components

**Extract to `src/components/common/` when:**
- Used in 2+ features (or very likely will be)
- Encapsulates a common UI pattern (cards, lists, filters, modals)
- Has clear, focused responsibility
- Contains no feature-specific business logic

**Keep in the feature when:**
- Tightly coupled to feature domain logic
- Unlikely to be reused elsewhere
- Contains feature-specific state or API calls

```typescript
// ✅ GOOD: Reusable common component — generic props, no domain coupling
interface DetailCardProps {
  title: string
  children: React.ReactNode
  actions?: React.ReactNode
  icon?: React.ReactNode
}

export const DetailCard: React.FC<DetailCardProps> = ({ title, children, actions, icon }) => (
  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      {actions}
    </div>
    {children}
  </div>
)

// ❌ BAD: Feature-specific logic leaked into a "common" component
export const OrderDetailCard = ({ order, onCancel }) => {
  const [cancelOrder] = useCancelOrderMutation()  // Feature-specific!
  // ...
}
```

### Loading, Error, and Empty States

Every data-driven component should handle all three UI states.

```typescript
const UserList: React.FC = () => {
  const { data, isLoading, isError, refetch } = useGetUsersQuery()

  if (isError) return <ErrorView message={t('users.error.load')} onRetry={refetch} />

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <Skeleton key={i} className="h-64 rounded-lg" />
        ))}
      </div>
    )
  }

  if (!data?.length) {
    return <EmptyState icon={<UsersIcon />} message={t('users.empty')} />
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {data.map(user => <UserCard key={user.id} user={user} />)}
    </div>
  )
}
```

---

## ⚛️ React Server Components & Client/Server Boundary

> **Applies to:** Projects using Next.js App Router, or any framework adopting the React Server Components (RSC) model. If your project is a traditional SPA (Vite + React Router), you can skip this section — but be aware of the direction the ecosystem is heading.

### The Mental Model

React now distinguishes between Server Components (default in App Router) and Client Components (opted in with `'use client'`). The key idea: push as much rendering to the server as possible, and only ship JavaScript to the client for interactive parts.

```
Server Components (default)          Client Components ('use client')
─────────────────────────────        ─────────────────────────────────
✅ Async data fetching (await)       ✅ useState, useEffect, hooks
✅ Direct DB/file system access      ✅ Event handlers (onClick, etc.)
✅ Zero JS shipped to client         ✅ Browser APIs (localStorage, etc.)
✅ Access secrets/env vars           ✅ Third-party client libs
❌ No hooks, no state, no effects    ❌ Cannot be async
❌ No browser APIs                   ❌ Full JS bundle shipped to client
```

### Where to Draw the Boundary

Push `'use client'` as far down the component tree as possible. The page-level component should remain a Server Component; only leaf-level interactive parts should be Client Components.

```typescript
// app/users/page.tsx — Server Component (default, no directive)
import { UserFilters } from './UserFilters'    // Client Component
import { UserTable } from './UserTable'         // Server Component

export default async function UsersPage() {
  const users = await getUsers()  // Runs on the server, no useEffect needed

  return (
    <main className="mx-auto max-w-7xl px-4 py-6">
      <h1>Users</h1>
      <UserFilters />                          {/* Interactive — client */}
      <UserTable users={users} />              {/* Static render — server */}
    </main>
  )
}

// app/users/UserFilters.tsx — Client Component
'use client'

import { useState } from 'react'

export const UserFilters = () => {
  const [role, setRole] = useState<string>('all')
  // ...interactive filter UI
}
```

### The `use` Hook (React 19+)

React 19 introduces the `use` hook, which can unwrap Promises and Context in both Server and Client Components. This replaces some patterns that previously required `useEffect` + `useState` for data fetching in Client Components.

```typescript
'use client'

import { use } from 'react'

interface UserDetailProps {
  userPromise: Promise<User>
}

// The parent Server Component passes a Promise as a prop
// The Client Component unwraps it with `use`
const UserDetail = ({ userPromise }: UserDetailProps) => {
  const user = use(userPromise)  // Suspends until resolved

  return <div>{user.name}</div>
}
```

### Rules

- Default to Server Components; add `'use client'` only when the component needs interactivity, hooks, or browser APIs
- Never import a Server Component into a Client Component — pass Server Components as `children` or props instead
- Keep `'use client'` boundaries as low in the tree as possible
- Data fetching in Server Components: use `async/await` directly, no `useEffect`
- Data fetching in Client Components: use your data fetching library (RTK Query, React Query) or the `use` hook
- If your project is a traditional SPA, these patterns don't apply yet — but structure your code so migration is feasible (separate data-fetching from rendering)

---

## 🧱 Headless UI & Component Libraries

### The Headless Pattern

Headless UI libraries provide fully accessible behavior and state management without any styling. You bring your own design system on top. This is the industry-standard approach for building custom, accessible component libraries.

### Recommended Stack

| Layer | Tool | Purpose |
|-------|------|---------|
| Behavior + a11y | Radix UI / React Aria / Headless UI | Handles focus, keyboard, ARIA, state |
| Styling | Tailwind CSS | Utility-first design |
| Pre-composed | shadcn/ui (built on Radix + Tailwind) | Copy-paste components you own and customize |

### Why Headless Over Traditional Libraries

```typescript
// ❌ AVOID: Fully styled component libraries (hard to customize, large bundles)
// MUI, Ant Design, Chakra — fine for prototyping, but lock you into their design system
import { Button } from '@mui/material'

// ✅ PREFER: Headless primitives + your own styles
// You own the markup and styling; the library handles behavior and accessibility
import * as Dialog from '@radix-ui/react-dialog'

const CustomDialog = ({ open, onClose, title, children }) => (
  <Dialog.Root open={open} onOpenChange={onClose}>
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
      <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-xl">
        <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
        {children}
        <Dialog.Close asChild>
          <button aria-label="Close" className="absolute top-4 right-4">
            <X className="w-4 h-4" />
          </button>
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
)
```

### Using shadcn/ui

shadcn/ui is not an npm package — it's a CLI that copies component source code into your project. You own the code and can modify it freely.

```bash
# Install a component
npx shadcn-ui@latest add button
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add select

# Components are copied to your project (e.g., src/components/ui/)
# You can and should customize them
```

**Structure with shadcn/ui:**
```
src/components/
├── ui/                          # shadcn/ui primitives (owned by you)
│   ├── button.tsx
│   ├── dialog.tsx
│   ├── select.tsx
│   └── ...
├── common/                      # Composite components built from ui/ primitives
│   ├── ErrorView.tsx
│   ├── EmptyState.tsx
│   └── ConfirmDialog.tsx
└── form/                        # Form-specific composites
    ├── FormSelect.tsx
    └── FormDatePicker.tsx
```

### Rules

- Use headless primitives (Radix, React Aria) for custom interactive components — don't reinvent focus management, keyboard navigation, or ARIA
- If using shadcn/ui, customize the copied components to match your design system — don't treat them as a black box
- Avoid mixing multiple fully-styled component libraries (e.g., MUI + Ant Design) in the same project
- When evaluating a component library, prioritize: accessibility compliance → bundle size → customizability → DX

---

## 🔷 TypeScript Best Practices

### General Rules

- Enable `strict` mode in `tsconfig.json` — never disable it
- Prefer `interface` for object shapes and component props; use `type` for unions, intersections, and utility types
- Avoid `any` — use `unknown` when the type is truly unknown, then narrow it
- Avoid type assertions (`as`) unless absolutely necessary; prefer type guards

### Component Typing

```typescript
// ✅ GOOD: Typed props with interface
interface UserProfileProps {
  user: User
  onSave: (data: UpdateUserDTO) => Promise<void>
  variant?: 'compact' | 'detailed'
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onSave, variant = 'detailed' }) => {
  // ...
}

// ✅ GOOD: Generic components
interface ListProps<T> {
  items: T[]
  renderItem: (item: T) => React.ReactNode
  keyExtractor: (item: T) => string
}

function List<T>({ items, renderItem, keyExtractor }: ListProps<T>) {
  return <>{items.map(item => <div key={keyExtractor(item)}>{renderItem(item)}</div>)}</>
}
```

### Constants with Type Safety

Use `as const` for constant objects and derive types from them. Prefer label mappings over switch statements.

```typescript
export const USER_ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer',
} as const

/** Derive the union type from the constant object */
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES]
// Result: 'admin' | 'editor' | 'viewer'

/** i18n label mappings — prefer over switch/if-else */
export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [USER_ROLES.ADMIN]: 'users.roles.admin',
  [USER_ROLES.EDITOR]: 'users.roles.editor',
  [USER_ROLES.VIEWER]: 'users.roles.viewer',
} as const

// Usage in component:
const label = t(USER_ROLE_LABELS[user.role])
```

### Constants File Pattern

Centralize all magic values in a `constants.ts` per feature.

```typescript
// features/user-management/constants.ts

/** Number of skeleton placeholders shown during loading */
export const UI_CONSTANTS = {
  SKELETON_COUNT: 6,
  PREVIEW_LIMIT: 10,
  DEBOUNCE_MS: 300,
} as const

/** Known API error codes returned by the backend */
export const ERROR_CODES = {
  CONFLICT: 'CONFLICT',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
} as const

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES]
```

**Rules:**
- No magic numbers or strings in components
- JSDoc comments for all exported constants
- Always use `as const` and export derived types
- Label mappings over switch statements

### Discriminated Unions

Use discriminated unions for state machines and complex conditional types.

```typescript
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string }

function renderState<T>(state: AsyncState<T>, renderData: (data: T) => React.ReactNode) {
  switch (state.status) {
    case 'idle':     return null
    case 'loading':  return <Spinner />
    case 'success':  return renderData(state.data)   // TS knows `data` exists here
    case 'error':    return <ErrorView message={state.error} />
  }
}
```

### Utility Types

Use built-in utility types and create custom ones when needed.

```typescript
// Built-in utilities
type UserPreview = Pick<User, 'id' | 'name' | 'avatar'>
type EditableUser = Omit<User, 'id' | 'createdAt'>
type PartialUser = Partial<User>

// Custom utility: Make specific fields required
type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }

// Custom utility: Make specific fields optional
type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>
```

### Type Guards

Prefer type guards over type assertions for runtime safety.

```typescript
// ✅ GOOD: Type guard with runtime check
function isApiError(error: unknown): error is { data: { message: string; code: string } } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'data' in error &&
    typeof (error as any).data?.message === 'string'
  )
}

// Usage
if (isApiError(error)) {
  // TS knows error.data.message is a string here
  showError(error.data.message)
}

// ❌ BAD: Blind assertion
const apiError = error as ApiError  // No runtime safety
```

---

## 📦 State Management

> **Recommended:** Redux Toolkit (RTK) for global/shared state.
> **Alternatives:** Zustand (lightweight), Jotai/Recoil (atomic), React Context (simple cases).
>
> _The principles below apply regardless of the library you choose._

### When to Use What

| State Type | Solution | Examples |
|-----------|---------|---------|
| Server/async data | Data fetching library (RTK Query, React Query, SWR) | API responses, cached entities |
| Global UI state | State management library (Redux, Zustand) | Theme, sidebar open/closed, current user |
| Feature-local state | `useState` / `useReducer` | Form inputs, modal visibility, local toggles |
| Derived/computed | `useMemo` or selectors | Filtered lists, computed totals |
| URL-driven state | URL search params / router | Pagination, filters, active tab |

### Core Principles (Library-Agnostic)

1. **Minimize global state.** If state is only used by one component or feature, keep it local.
2. **Colocate state with its consumers.** Lift state up only as far as needed.
3. **Single source of truth.** Never duplicate server data into local state — let the cache be the source.
4. **Normalize complex data.** Flatten nested structures to avoid deep updates and enable efficient lookups.
5. **Derive, don't store.** If a value can be computed from other state, compute it (via selectors or `useMemo`).
6. **Keep actions/mutations descriptive.** Name them after what happened (`userCreated`), not what the UI did (`buttonClicked`).

### Redux Toolkit Patterns

```typescript
// features/user-management/store/userSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
  selectedIds: string[]
  filterRole: UserRole | null
}

const initialState: UserState = {
  selectedIds: [],
  filterRole: null,
}

const userSlice = createSlice({
  name: 'userManagement',
  initialState,
  reducers: {
    userSelected(state, action: PayloadAction<string>) {
      state.selectedIds.push(action.payload)
    },
    userDeselected(state, action: PayloadAction<string>) {
      state.selectedIds = state.selectedIds.filter(id => id !== action.payload)
    },
    filterRoleChanged(state, action: PayloadAction<UserRole | null>) {
      state.filterRole = action.payload
    },
    selectionCleared(state) {
      state.selectedIds = []
    },
  },
})

export const { userSelected, userDeselected, filterRoleChanged, selectionCleared } = userSlice.actions
export default userSlice.reducer
```

### Selectors

```typescript
// ✅ GOOD: Typed selectors, memoized where needed
import { createSelector } from '@reduxjs/toolkit'

const selectUserState = (state: RootState) => state.userManagement
const selectAllUsers = (state: RootState) => state.userManagement.users

export const selectFilteredUsers = createSelector(
  [selectAllUsers, (state: RootState) => state.userManagement.filterRole],
  (users, filterRole) =>
    filterRole ? users.filter(u => u.role === filterRole) : users
)

// ❌ BAD: Inline selectors that create new references every render
const users = useSelector(state => state.users.filter(u => u.active))
```

### Avoid Common Pitfalls

```typescript
// ❌ BAD: Storing server data in Redux state manually
dispatch(setUsers(response.data))  // Duplicates cache, goes stale

// ✅ GOOD: Let the data fetching layer (RTK Query / React Query) own the cache
const { data: users } = useGetUsersQuery()

// ❌ BAD: Storing derived data
dispatch(setFilteredUsers(users.filter(u => u.active)))

// ✅ GOOD: Derive it with a selector or useMemo
const activeUsers = useMemo(() => users.filter(u => u.active), [users])
```

---

## 🌐 Data Fetching & API Layer

> **Recommended:** RTK Query (if using Redux) or React Query / TanStack Query.
>
> _Both follow the same principles: declarative fetching, automatic caching, and cache invalidation._

### RTK Query Example

```typescript
// features/user-management/api/userApi.ts

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], GetUsersParams>({
      query: (params) => ({
        url: '/users',
        params,
      }),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'User' as const, id })), { type: 'User', id: 'LIST' }]
          : [{ type: 'User', id: 'LIST' }],
    }),
    getUserById: builder.query<User, string>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    createUser: builder.mutation<User, CreateUserDTO>({
      query: (body) => ({
        url: '/users',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
    }),
    updateUser: builder.mutation<User, { id: string; data: UpdateUserDTO }>({
      query: ({ id, data }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'User', id }],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi
```

### React Query / TanStack Query Alternative

```typescript
// features/user-management/api/userQueries.ts

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/lib/apiClient'

const userKeys = {
  all:    ['users'] as const,
  lists:  () => [...userKeys.all, 'list'] as const,
  list:   (params: GetUsersParams) => [...userKeys.lists(), params] as const,
  detail: (id: string) => [...userKeys.all, 'detail', id] as const,
}

export const useGetUsers = (params: GetUsersParams) =>
  useQuery({
    queryKey: userKeys.list(params),
    queryFn: () => apiClient.get<User[]>('/users', { params }),
  })

export const useCreateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateUserDTO) => apiClient.post<User>('/users', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() })
    },
  })
}
```

### Custom Data Fetching Hook (Pattern)

Wrap your API hooks with feature-specific logic (filtering, sorting, pagination).

```typescript
// features/user-management/hooks/useUserFilters.ts

export const useUserFilters = () => {
  const [filters, setFilters] = useState<UserFilters>(defaultFilters)

  const queryParams = useMemo(() => buildQueryParams(filters), [filters])
  const { data, isLoading, isError, error, refetch } = useGetUsersQuery(queryParams)

  const clearFilters = useCallback(() => setFilters(defaultFilters), [])
  const activeFilterCount = useMemo(() => countActiveFilters(filters), [filters])

  return {
    data: data ?? [],
    isLoading,
    isError,
    error,
    refetch,
    filters,
    setFilters,
    clearFilters,
    activeFilterCount,
  }
}
```

### Polling & Background Refresh

```typescript
// ✅ GOOD: Conservative polling — pause when tab is hidden
const { data } = useGetUsersQuery(params, {
  pollingInterval: 30_000,
  refetchOnFocus: true,
  skipPollingIfUnfocused: true,
})

// ❌ BAD: Aggressive polling + redundant refetch mechanisms
const { data } = useGetUsersQuery(params, {
  pollingInterval: 5_000,                // Too frequent
  refetchOnMountOrArgChange: true,       // Redundant with polling
})
// + manual visibilitychange listener   // Redundant with refetchOnFocus
```

### Caching Strategy

Understanding cache timing is critical to avoiding stale data and unnecessary network requests.

**RTK Query:**
```typescript
// RTK Query uses a single `keepUnusedDataFor` setting (in seconds)
// Data is "fresh" as long as a component is subscribed. Once all subscribers
// unmount, the cache entry is kept for this duration before being garbage collected.

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  keepUnusedDataFor: 60,  // Default: 60 seconds. Increase for rarely-changing data.
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      keepUnusedDataFor: 300,  // Override per endpoint: 5 minutes for user lists
      providesTags: ['User'],
    }),
    getUserActivity: builder.query<Activity[], string>({
      query: (id) => `/users/${id}/activity`,
      keepUnusedDataFor: 10,  // Short-lived: activity changes frequently
    }),
  }),
})
```

**React Query / TanStack Query:**
```typescript
// React Query separates two concepts:
// - staleTime: How long data is considered "fresh" (no refetch triggered)
// - gcTime (formerly cacheTime): How long inactive data stays in cache

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,    // 5 minutes: data is fresh, no background refetch
      gcTime:    1000 * 60 * 30,    // 30 minutes: keep in cache after last subscriber unmounts
    },
  },
})

// Override per query for different freshness needs
export const useGetUserActivity = (userId: string) =>
  useQuery({
    queryKey: ['users', userId, 'activity'],
    queryFn: () => fetchUserActivity(userId),
    staleTime: 1000 * 10,       // Activity goes stale fast: 10 seconds
    gcTime:    1000 * 60 * 5,   // But keep in cache for 5 minutes
  })
```

**Guidelines for choosing cache timing:**

| Data type | staleTime / keepUnusedDataFor | Examples |
|-----------|-------------------------------|----------|
| Near-static | 10–30 minutes | User roles, app config, permissions |
| Moderate churn | 1–5 minutes | User lists, project listings |
| Frequently changing | 10–30 seconds | Activity feeds, notifications, dashboards |
| Real-time | 0 (always stale) + polling or WebSocket | Chat messages, live collaboration |

### Optimistic Updates

Show the expected result immediately, then reconcile with the server response. Roll back on failure.

```typescript
// RTK Query optimistic update
updateUser: builder.mutation<User, { id: string; data: UpdateUserDTO }>({
  query: ({ id, data }) => ({ url: `/users/${id}`, method: 'PATCH', body: data }),
  async onQueryStarted({ id, data }, { dispatch, queryFulfilled }) {
    // 1. Optimistically update the cache
    const patchResult = dispatch(
      userApi.util.updateQueryData('getUsers', undefined, (draft) => {
        const user = draft.find(u => u.id === id)
        if (user) Object.assign(user, data)
      })
    )
    try {
      await queryFulfilled  // 2. Wait for server confirmation
    } catch {
      patchResult.undo()    // 3. Roll back on failure
    }
  },
}),

// React Query optimistic update
export const useUpdateUser = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDTO }) =>
      apiClient.patch(`/users/${id}`, data),
    onMutate: async ({ id, data }) => {
      await queryClient.cancelQueries({ queryKey: ['users'] })
      const previous = queryClient.getQueryData<User[]>(['users'])

      queryClient.setQueryData<User[]>(['users'], (old) =>
        old?.map(u => (u.id === id ? { ...u, ...data } : u))
      )

      return { previous }  // Context for rollback
    },
    onError: (err, vars, context) => {
      queryClient.setQueryData(['users'], context?.previous)  // Roll back
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })  // Refetch for consistency
    },
  })
}
```

**When to use optimistic updates:**
- Toggling statuses (active/inactive, favorite/unfavorite)
- Inline edits where latency matters
- Deleting items from lists

**When NOT to use optimistic updates:**
- Complex mutations where the server may transform the data
- Mutations with significant side effects (email triggers, billing changes)
- When failure is common (poor connectivity, complex validation)

### Prefetching

Load data before the user needs it for instant navigation.

```typescript
// RTK Query: Prefetch on hover
const dispatch = useAppDispatch()

const handleHover = (userId: string) => {
  dispatch(userApi.util.prefetch('getUserById', userId, { force: false }))
}

<Link to={`/users/${id}`} onMouseEnter={() => handleHover(id)}>
  {user.name}
</Link>

// React Query: Prefetch on hover
const queryClient = useQueryClient()

const handleHover = (userId: string) => {
  queryClient.prefetchQuery({
    queryKey: ['users', userId],
    queryFn: () => fetchUser(userId),
    staleTime: 1000 * 60 * 5,  // Don't prefetch if already fresh
  })
}

// React Query: Prefetch in route loaders (React Router v6+)
const router = createBrowserRouter([
  {
    path: '/users/:id',
    loader: async ({ params }) => {
      queryClient.ensureQueryData({
        queryKey: ['users', params.id],
        queryFn: () => fetchUser(params.id!),
      })
      return null
    },
    element: <UserDetailPage />,
  },
])
```

---

## 📝 Form Handling

> **Recommended:** React Hook Form + Zod for validation.
> **Alternatives:** Formik + Yup, or any form library that supports schema-based validation.

### Basic Pattern

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const userSchema = z.object({
  name: z.string().min(1, 'validation.required').max(100, 'validation.maxLength'),
  email: z.string().email('validation.invalidEmail'),
  role: z.enum(['admin', 'editor', 'viewer']),
  isActive: z.boolean().default(true),
})

type UserFormData = z.infer<typeof userSchema>

interface UserFormProps {
  defaultValues?: Partial<UserFormData>
  onSubmit: (data: UserFormData) => Promise<void>
  isSubmitting?: boolean
}

const UserForm: React.FC<UserFormProps> = ({ defaultValues, onSubmit, isSubmitting }) => {
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues,
  })

  const handleFormSubmit = async (data: UserFormData) => {
    try {
      await onSubmit(data)
    } catch (error) {
      if (isApiValidationError(error)) {
        mapApiErrorsToForm(error.data.fieldErrors, setError)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} noValidate>
      <div>
        <label htmlFor="name">{t('users.fields.name')}</label>
        <input id="name" {...register('name')} aria-invalid={!!errors.name} />
        {errors.name && <p role="alert">{t(errors.name.message!)}</p>}
      </div>

      <div>
        <label htmlFor="email">{t('users.fields.email')}</label>
        <input id="email" type="email" {...register('email')} aria-invalid={!!errors.email} />
        {errors.email && <p role="alert">{t(errors.email.message!)}</p>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? t('common.saving') : t('common.save')}
      </button>
    </form>
  )
}
```

### Mapping API Errors to Form Fields

```typescript
/**
 * Maps backend field errors to React Hook Form's setError.
 * Keeps the mapping between API field names and form field names explicit.
 */
function mapApiErrorsToForm(
  fieldErrors: Record<string, string[]>,
  setError: UseFormSetError<any>,
  fieldMapping?: Record<string, string>
) {
  Object.entries(fieldErrors).forEach(([apiField, messages]) => {
    const formField = fieldMapping?.[apiField] ?? apiField
    setError(formField as any, {
      type: 'server',
      message: messages[0],
    })
  })
}
```

### Validation Best Practices

```typescript
// ✅ GOOD: Shared validation schemas — reuse across create/edit forms
const baseUserSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
})

const createUserSchema = baseUserSchema.extend({
  password: z.string().min(8),
})

const updateUserSchema = baseUserSchema.partial()

// ✅ GOOD: i18n-friendly validation messages (use translation keys)
const schema = z.object({
  name: z.string().min(1, 'validation.required'),
})

// ❌ BAD: Hardcoded English messages in schemas
const schema = z.object({
  name: z.string().min(1, 'Name is required'),
})
```

---

## 🚨 Error Handling & Error Boundaries

### Error Boundaries

Wrap major sections of your app with error boundaries to prevent full-page crashes.

```typescript
import { Component, ErrorInfo, ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode | ((error: Error, reset: () => void) => ReactNode)
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo)
    logger.error('ErrorBoundary caught an error', { error, errorInfo })
  }

  resetError = () => this.setState({ hasError: false, error: null })

  render() {
    if (this.state.hasError && this.state.error) {
      if (typeof this.props.fallback === 'function') {
        return this.props.fallback(this.state.error, this.resetError)
      }
      return this.props.fallback ?? <DefaultErrorFallback onRetry={this.resetError} />
    }
    return this.props.children
  }
}
```

**Where to place error boundaries:**
- Around the entire app (top-level fallback)
- Around each route/page
- Around independently failing sections (e.g., a sidebar widget shouldn't crash the whole page)

```typescript
// App-level
<ErrorBoundary fallback={<FullPageError />}>
  <RouterProvider router={router} />
</ErrorBoundary>

// Route-level
<Route
  path="/users"
  element={
    <ErrorBoundary fallback={(error, reset) => <PageError error={error} onRetry={reset} />}>
      <UserManagementPage />
    </ErrorBoundary>
  }
/>
```

### API Error Handling

```typescript
// ✅ GOOD: Structured error handling with context
const handleMutationError = (error: unknown, context: string) => {
  logger.apiError(`Failed to ${context}`, error, {
    component: 'UserForm',
  })

  if (isApiError(error)) {
    // 1. Check error codes first (reliable)
    if (error.data.code === ERROR_CODES.CONFLICT) {
      showWarning(t('users.errors.alreadyExists'))
      return
    }

    // 2. Map field errors to form
    if (error.data.fieldErrors) {
      mapApiErrorsToForm(error.data.fieldErrors, setError)
      return
    }

    // 3. Show API message
    showError(error.data.message)
    return
  }

  // 4. Generic fallback
  showError(t('common.errors.unexpected'))
}

// ❌ BAD: Silent failures, no context, hardcoded strings
try {
  await createUser(data).unwrap()
} catch (e) {
  console.error('Error:', e)              // Use a logger, not console
  alert('An error occurred')              // Use i18n and toast
}
```

### Logging

Use a structured logger instead of `console.*` in production code.

```typescript
// ✅ GOOD: Logger with context
logger.apiError('Failed to create user', error, {
  component: 'UserForm',
  userId: user.id,
  action: 'create',
})

// ❌ BAD: No context, bare console
console.error('Error:', error)
console.log('failed')
```

---

## ⚡ Performance Optimizations

### Lazy Loading & Code Splitting

```typescript
// ✅ Route-level code splitting
const UserManagementPage = lazy(() => import('@/pages/UserManagementPage'))
const AnalyticsPage = lazy(() => import('@/pages/AnalyticsPage'))

const router = createBrowserRouter([
  {
    path: '/users',
    element: (
      <Suspense fallback={<PageSkeleton />}>
        <UserManagementPage />
      </Suspense>
    ),
  },
])

// ✅ Heavy component lazy loading
const RichTextEditor = lazy(() => import('./RichTextEditor'))
const ChartComponent = lazy(() => import('recharts').then(m => ({ default: m.LineChart })))

// ❌ DON'T lazy load small, frequently-used components (Button, Input, etc.)
```

### Memoization

Memoize intentionally — measure before optimizing.

```typescript
// ✅ GOOD: Memoize expensive computations
const filteredAndSorted = useMemo(
  () => items.filter(matchesFilter).sort(compareFn),
  [items, matchesFilter, compareFn]
)

// ✅ GOOD: Memoize callbacks passed to memoized children
const handleClick = useCallback((id: string) => {
  navigate(`/users/${id}`)
}, [navigate])

// ✅ GOOD: Memoize list items / cards that render in large lists
export const UserCard = React.memo<UserCardProps>(({ user, onClick }) => {
  // ...
})

// ✅ GOOD: Memoize in persistent layout components (sidebars, headers)
const toggleSidebar = useCallback(() => setOpen(prev => !prev), [])
const navItems = useMemo(() => buildNavItems(permissions), [permissions])

// ❌ BAD: Memoizing everything "just in case"
const name = useMemo(() => user.firstName + ' ' + user.lastName, [user])  // Trivial — not worth it
```

### Static Computations

Hoist values that don't depend on state/props to module scope.

```typescript
// ✅ GOOD: Computed once at module load
const SORTED_ROUTES = Object.keys(ROUTES).sort((a, b) => b.length - a.length)
const STATUS_OPTIONS = Object.entries(STATUS_LABELS).map(([value, label]) => ({ value, label }))

// ❌ BAD: Recomputed every render for no reason
const MyComponent = () => {
  const sortedRoutes = Object.keys(ROUTES).sort((a, b) => b.length - a.length)  // Wasteful
  // ...
}
```

### Import Optimization

```typescript
// ✅ GOOD: Specific named imports
import { Edit, Trash2, ChevronDown } from 'lucide-react'

// ❌ BAD: Namespace imports pulling in entire libraries
import * as Icons from 'lucide-react'
```

### React.memo + forwardRef

```typescript
// ✅ GOOD: Wrapping forwardRef components with memo
export const Button = React.memo(
  React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    // ...
  })
)
```

---

## 🎨 Styling with Tailwind CSS

### Core Principles

- **Mobile-first responsive:** Start with the smallest screen, layer up with `sm:`, `md:`, `lg:`, `xl:`
- **Utility-first:** Compose styles from utility classes; avoid custom CSS unless absolutely necessary
- **Dark mode:** Support `dark:` variants for all visual elements
- **RTL support:** Use logical properties (`ms-`, `me-`, `ps-`, `pe-`, `start`, `end`) instead of `ml-`, `mr-`, `pl-`, `pr-`, `left`, `right`

### Responsive Patterns

```typescript
// ✅ GOOD: Mobile-first responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => <ItemCard key={item.id} item={item} />)}
</div>

// ✅ GOOD: Responsive spacing
<div className="px-4 sm:px-6 lg:px-8">

// ✅ GOOD: Responsive typography
<h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">

// ❌ BAD: Hardcoded widths
<div style={{ width: '800px' }}>
<div className="w-[800px]">
```

### Dark Mode

```typescript
// ✅ GOOD: Always pair light and dark styles
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
<div className="border border-gray-200 dark:border-gray-700">
<div className="hover:bg-gray-100 dark:hover:bg-gray-700">
```

### RTL Support

```typescript
// ✅ GOOD: Logical properties (RTL-safe)
<div className="ms-4 me-2">           {/* margin-start, margin-end */}
<div className="ps-4 pe-2">           {/* padding-start, padding-end */}
<div className="text-start">          {/* Not text-left */}
<div className="flex justify-start">  {/* Not justify-left */}

// ❌ BAD: Physical properties (break in RTL)
<div className="ml-4 mr-2">
<div className="text-left">
```

### Organizing Complex Class Lists

When classes get long, extract to variables or use a utility like `clsx`/`cn`.

```typescript
import { cn } from '@/lib/utils'

interface BadgeProps {
  variant: 'success' | 'warning' | 'error'
  children: React.ReactNode
}

const variantStyles = {
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  error:   'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
} as const

const Badge: React.FC<BadgeProps> = ({ variant, children }) => (
  <span className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', variantStyles[variant])}>
    {children}
  </span>
)
```

---

## 🌍 Internationalization (i18n)

> **Recommended:** react-i18next. Principles apply to any i18n library.

### Locale File Structure

```
src/i18n/
├── config.ts                              # i18n initialization
└── locales/
    ├── en/
    │   ├── index.ts                       # Exports all EN namespaces
    │   ├── common.json                    # Global/shared keys only
    │   └── {featureName}.json             # One file per feature
    └── {lang}/
        ├── index.ts
        ├── common.json
        └── {featureName}.json
```

### Rules

- **One locale file per feature per language.** All feature-specific text lives in `src/i18n/locales/{lang}/{featureName}.json`.
- **`common.json` is for truly global text only** — navigation, auth, generic buttons, generic toasts.
- **No feature keys in `common.json`.** No duplicated keys between common and feature files.
- **No locale folders inside feature directories.** Keep all locales centralized.
- **Index files required.** Each language folder must have an `index.ts` that imports and re-exports all namespace files.
- **Use feature namespaces** in translation keys: `t('users.form.title')`, not `t('formTitle')`.

### Key Organization

```json
// src/i18n/locales/en/users.json
{
  "users": {
    "title": "User Management",
    "actions": {
      "create": "Create User",
      "edit": "Edit User",
      "delete": "Delete User"
    },
    "fields": {
      "name": "Full Name",
      "email": "Email Address",
      "role": "Role"
    },
    "messages": {
      "createSuccess": "User created successfully",
      "deleteConfirm": "Are you sure you want to delete this user?"
    },
    "validation": {
      "required": "This field is required",
      "invalidEmail": "Please enter a valid email address"
    },
    "empty": "No users found",
    "error": {
      "load": "Failed to load users"
    }
  }
}
```

### Localization Utilities

Extract repeated localization logic into pure utility functions.

```typescript
// features/user-management/utils/localization.ts

interface LocalizedEntity {
  nameEn: string
  nameAr?: string | null
  // Add other language fields as needed
}

/**
 * Returns the localized name for an entity based on the current language.
 * Falls back to the default language (English) if the localized name is unavailable.
 */
export const getLocalizedName = (entity: LocalizedEntity, language: string): string => {
  const localizedField = `name${language.charAt(0).toUpperCase() + language.slice(1)}` as keyof LocalizedEntity
  return (entity[localizedField] as string) || entity.nameEn
}

/** Builds select/dropdown options from a list of localized entities. */
export const buildLocalizedOptions = <T extends LocalizedEntity & { id: string }>(
  items: T[],
  language: string
) =>
  items.map(item => ({
    value: item.id,
    label: getLocalizedName(item, language),
  }))
```

### Usage in Components

```typescript
// ✅ GOOD: Always use translation keys
const { t } = useTranslation()
<Button>{t('users.actions.save')}</Button>

// ✅ GOOD: Use localization utilities for entity names
import { getLocalizedName } from '../utils/localization'
const name = getLocalizedName(entity, i18n.language)

// ❌ BAD: Hardcoded text
<Button>Save</Button>
<p>Error occurred</p>
```

---

## ♿ Accessibility (a11y)

### Core Principles

- All interactive elements must be keyboard accessible
- All form inputs must have associated labels
- All images must have descriptive `alt` text (or `alt=""` for decorative images)
- Color must not be the sole means of conveying information
- Focus management must be handled for modals, drawers, and dynamic content

### Semantic HTML

```typescript
// ✅ GOOD: Semantic elements
<nav aria-label="Main navigation">
  <ul>{navItems.map(item => <li key={item.path}><a href={item.path}>{item.label}</a></li>)}</ul>
</nav>

<main>
  <section aria-labelledby="users-heading">
    <h2 id="users-heading">{t('users.title')}</h2>
    {/* content */}
  </section>
</main>

// ❌ BAD: Div soup
<div className="nav">
  <div className="nav-item" onClick={handleClick}>Home</div>
</div>
```

### Interactive Elements

```typescript
// ✅ GOOD: Accessible button with icon
<button
  onClick={handleDelete}
  aria-label={t('users.actions.deleteUser', { name: user.name })}
  type="button"
>
  <Trash2 className="w-4 h-4" aria-hidden="true" />
</button>

// ✅ GOOD: Accessible form field
<div>
  <label htmlFor="user-email">{t('users.fields.email')}</label>
  <input
    id="user-email"
    type="email"
    aria-invalid={!!errors.email}
    aria-describedby={errors.email ? 'email-error' : undefined}
    {...register('email')}
  />
  {errors.email && <p id="email-error" role="alert">{t(errors.email.message!)}</p>}
</div>

// ❌ BAD: Inaccessible clickable div
<div onClick={handleClick}>Click me</div>
```

### Focus Management

```typescript
// ✅ GOOD: Focus trap in modals/dialogs (most UI libraries handle this)
// If using Radix/shadcn Dialog, focus trapping is built-in.

// ✅ GOOD: Return focus after modal close
const triggerRef = useRef<HTMLButtonElement>(null)

const handleClose = () => {
  setIsOpen(false)
  triggerRef.current?.focus()  // Return focus to trigger
}

// ✅ GOOD: Skip to main content link
<a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4">
  {t('common.skipToContent')}
</a>
<main id="main-content" tabIndex={-1}>
```

### ARIA Patterns

```typescript
// ✅ GOOD: Loading state announced to screen readers
<div aria-live="polite" aria-busy={isLoading}>
  {isLoading ? <Spinner /> : <UserList users={data} />}
</div>

// ✅ GOOD: Status messages
<div role="status" aria-live="polite">
  {successMessage && <p>{successMessage}</p>}
</div>

// ✅ GOOD: Descriptive labels for icon-only actions
<button aria-label={t('common.close')} onClick={onClose}>
  <X className="w-4 h-4" aria-hidden="true" />
</button>
```

### Checklist (Quick Reference)

- All `<img>` have `alt` attributes
- All form inputs have `<label>` elements (or `aria-label`)
- All icon-only buttons have `aria-label`
- Decorative icons have `aria-hidden="true"`
- Error messages use `role="alert"` or `aria-live`
- Modals trap focus and return it on close
- Dynamic content uses `aria-live` regions
- Color contrast meets WCAG AA (4.5:1 for text, 3:1 for large text)
- Tab order is logical and complete

---

## 🧪 Testing & Dependency Injection

### What to Test

| Priority | What | How |
|---------|------|-----|
| High | User interactions & flows | React Testing Library — simulate clicks, input, form submission |
| High | Conditional rendering | Render with different props/states, assert correct output |
| High | Custom hooks with logic | `renderHook` from React Testing Library |
| Medium | Integration between components | Render parent, verify child behavior |
| Medium | Error states & edge cases | Mock API failures, empty data, missing props |
| Low | Static presenters | Only test if they have conditional logic |
| Avoid | Implementation details | Don't test state variables, internal methods, or DOM structure |

### Dependency Injection for Testable Components

Hard-wired hook calls inside components make testing difficult. Use dependency injection to create natural testing seams without sacrificing ergonomics in production code.

```typescript
// ✅ GOOD: Injectable hooks with sensible defaults
// The component works out of the box in production, but hooks can be swapped in tests.

interface UserListDeps {
  useUsers?: typeof useGetUsersQuery
  useDeleteUser?: typeof useDeleteUserMutation
}

const UserList: React.FC<UserListDeps> = ({
  useUsers = useGetUsersQuery,
  useDeleteUser = useDeleteUserMutation,
}) => {
  const { data, isLoading, isError, refetch } = useUsers()
  const [deleteUser] = useDeleteUser()

  // ...component logic
}

// In production — zero-cost, uses real hooks:
<UserList />

// In tests — swap in mocks, no jest.mock() needed:
const mockUseUsers = () => ({
  data: mockUsers,
  isLoading: false,
  isError: false,
  refetch: jest.fn(),
})

render(<UserList useUsers={mockUseUsers} />)
```

**When to use dependency injection:**
- Container components that call data fetching hooks
- Components that depend on environment-specific services (analytics, logging, feature flags)
- Anywhere `jest.mock()` becomes brittle or hard to reason about

**When NOT to use it:**
- Simple presentational components (just pass different props)
- Hooks used internally with no testing value (e.g., `useTranslation`)

### Alternative: Context-Based Injection

For cross-cutting dependencies shared by many components, use a Context-based approach.

```typescript
// services/ServiceContext.tsx
interface Services {
  analytics: AnalyticsService
  logger: LoggerService
  featureFlags: FeatureFlagService
}

const ServiceContext = createContext<Services | null>(null)

export const ServiceProvider: React.FC<{ services: Services; children: React.ReactNode }> = ({
  services,
  children,
}) => <ServiceContext.Provider value={services}>{children}</ServiceContext.Provider>

export const useServices = () => {
  const ctx = useContext(ServiceContext)
  if (!ctx) throw new Error('useServices must be used within ServiceProvider')
  return ctx
}

// In tests — provide mock services:
render(
  <ServiceProvider services={mockServices}>
    <MyComponent />
  </ServiceProvider>
)
```

### Component Testing

```typescript
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('UserList', () => {
  it('renders users and handles selection', async () => {
    const user = userEvent.setup()
    render(<UserList users={mockUsers} onSelect={mockOnSelect} />)

    // ✅ Query by role/text — what the user sees
    const userCards = screen.getAllByRole('article')
    expect(userCards).toHaveLength(mockUsers.length)

    // ✅ Interact like a user
    await user.click(screen.getByText('Jane Doe'))
    expect(mockOnSelect).toHaveBeenCalledWith('user-2')
  })

  it('shows empty state when no users', () => {
    render(<UserList users={[]} onSelect={jest.fn()} />)
    expect(screen.getByText(/no users found/i)).toBeInTheDocument()
  })

  it('shows error state on API failure', () => {
    render(<UserList users={[]} error="Failed to load" onRetry={mockRetry} />)
    expect(screen.getByRole('alert')).toHaveTextContent(/failed to load/i)
  })
})
```

### Testing Principles

```typescript
// ✅ GOOD: Query by role, label, or text (what the user perceives)
screen.getByRole('button', { name: /save/i })
screen.getByLabelText(/email/i)
screen.getByText(/no results/i)

// ❌ BAD: Query by test ID or class name (implementation details)
screen.getByTestId('submit-btn')
container.querySelector('.btn-primary')

// ✅ GOOD: Assert behavior, not implementation
expect(screen.getByText('Jane Doe')).toBeInTheDocument()
expect(mockOnSave).toHaveBeenCalledWith({ name: 'Jane', email: 'jane@test.com' })

// ❌ BAD: Assert internal state
expect(component.state.isOpen).toBe(true)
```

### Testing Custom Hooks

```typescript
import { renderHook, act } from '@testing-library/react'

describe('useCounter', () => {
  it('increments count', () => {
    const { result } = renderHook(() => useCounter(0))

    act(() => result.current.increment())

    expect(result.current.count).toBe(1)
  })
})
```

### Mocking API Calls

```typescript
// ✅ BEST: Use dependency injection (see above) — no module mocking needed

// ✅ GOOD: Mock at the network level with MSW (for integration tests)
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
  http.get('/api/users', () => HttpResponse.json(mockUsers))
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

// ⚠️ ACCEPTABLE: Module-level mocking (brittle, but sometimes necessary)
jest.mock('../api/userApi', () => ({
  useGetUsersQuery: () => ({
    data: mockUsers,
    isLoading: false,
    isError: false,
  }),
}))
```

---

## 🔒 Security

### XSS Prevention

React escapes rendered content by default, but there are important exceptions and patterns to follow.

```typescript
// ✅ SAFE: React auto-escapes interpolated values
const UserGreeting = ({ name }: { name: string }) => (
  <h1>Hello, {name}</h1>  // Safe — React escapes special characters
)

// ⚠️ DANGEROUS: dangerouslySetInnerHTML bypasses React's escaping
// Only use when absolutely necessary (e.g., rendering sanitized rich text from a CMS)
const RichContent = ({ html }: { html: string }) => (
  <div dangerouslySetInnerHTML={{ __html: sanitize(html) }} />  // MUST sanitize first
)

// ✅ GOOD: Always sanitize before using dangerouslySetInnerHTML
import DOMPurify from 'dompurify'

const sanitize = (dirty: string): string =>
  DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
  })

// ❌ BAD: Unsanitized HTML injection
<div dangerouslySetInnerHTML={{ __html: userProvidedContent }} />  // XSS vulnerability!
```

**Rules:**
- Never use `dangerouslySetInnerHTML` with unsanitized user input
- If you must render HTML, use a sanitization library like DOMPurify
- Whitelist allowed tags and attributes — don't just strip `<script>` tags
- Be cautious with `href` attributes — sanitize `javascript:` protocol URLs

### URL and Link Safety

```typescript
// ✅ GOOD: Validate URLs before rendering as links
const isValidUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url)
    return ['http:', 'https:', 'mailto:'].includes(parsed.protocol)
  } catch {
    return false
  }
}

const SafeLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  if (!isValidUrl(href)) return <span>{children}</span>

  return (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )
}

// ❌ BAD: Rendering user-provided URLs without validation
<a href={userProvidedUrl}>{linkText}</a>  // Could be javascript:alert('XSS')
```

### CSRF Protection

```typescript
// ✅ GOOD: Include CSRF token in API requests
// Most frameworks (Django, Rails, Laravel) provide a CSRF token in a cookie or meta tag.

// Option A: Read from a meta tag (common in server-rendered apps)
const getCsrfToken = (): string =>
  document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? ''

// Option B: Read from a cookie (common with Django, etc.)
const getCsrfFromCookie = (): string => {
  const match = document.cookie.match(/csrftoken=([^;]+)/)
  return match?.[1] ?? ''
}

// Include in your base API client
const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  prepareHeaders: (headers) => {
    const token = getCsrfToken()
    if (token) headers.set('X-CSRF-Token', token)
    return headers
  },
  credentials: 'same-origin',  // Important: send cookies with requests
})
```

### Input Sanitization

```typescript
// ✅ GOOD: Sanitize user input before rendering or sending to APIs
// Even though React escapes JSX, sanitize data that will be:
// - Stored in the database
// - Used in URLs, query parameters, or dynamic attributes
// - Rendered via dangerouslySetInnerHTML

// ✅ GOOD: Trim and validate before submission
const handleSubmit = (data: FormData) => {
  const sanitized = {
    name: data.name.trim(),
    email: data.email.trim().toLowerCase(),
    bio: DOMPurify.sanitize(data.bio),
  }
  createUser(sanitized)
}

// ❌ BAD: Trust user input blindly
const handleSubmit = (data: FormData) => {
  createUser(data)  // Untrimmed, unsanitized
}
```

### Additional Security Practices

- **Never store secrets in frontend code.** API keys, tokens, and secrets belong on the server or in environment variables that are NOT embedded in the client bundle.
- **Use `rel="noopener noreferrer"`** on all external links (`target="_blank"`).
- **Content Security Policy (CSP):** Configure CSP headers on your server to restrict script sources.
- **Dependency auditing:** Run `npm audit` regularly and keep dependencies updated.
- **Avoid `eval()` and `new Function()`** — these are almost always unnecessary and create injection vectors.

---

## 🚩 Feature Flags & Environment Configuration

### Environment Variables

```typescript
// ✅ GOOD: Type-safe environment configuration
// env.ts — single source of truth for all env vars

const env = {
  apiBaseUrl:     import.meta.env.VITE_API_BASE_URL as string,
  appEnvironment: import.meta.env.VITE_APP_ENV as 'development' | 'staging' | 'production',
  sentryDsn:      import.meta.env.VITE_SENTRY_DSN as string | undefined,
  enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
} as const

// Validate at startup — fail fast if required vars are missing
const requiredVars = ['apiBaseUrl', 'appEnvironment'] as const
for (const key of requiredVars) {
  if (!env[key]) throw new Error(`Missing required environment variable: ${key}`)
}

export default env

// Usage — always import from env.ts, never access import.meta.env directly
import env from '@/config/env'

const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: env.apiBaseUrl }),
  // ...
})
```

**Rules:**
- Centralize all environment variables in one typed config file
- Validate required variables at app startup — don't let missing vars cause runtime errors deep in the app
- Never access `import.meta.env` or `process.env` directly in components — always go through the config
- Never commit `.env` files with secrets to version control

### Feature Flags

Feature flags decouple deployments from releases. They let you merge code to main, deploy it, and enable features independently.

```typescript
// config/featureFlags.ts

/** Define all feature flags with their default values */
const FEATURE_FLAGS = {
  NEW_DASHBOARD:    false,
  ADVANCED_SEARCH:  false,
  BETA_EXPORT:      false,
  DARK_MODE_V2:     true,
} as const

type FeatureFlag = keyof typeof FEATURE_FLAGS

/**
 * Resolve a feature flag's value.
 * Priority: remote config > environment variable > default
 */
export const isFeatureEnabled = (flag: FeatureFlag): boolean => {
  // 1. Check remote config (LaunchDarkly, Unleash, etc.) if available
  const remoteValue = remoteConfig?.getFlag(flag)
  if (remoteValue !== undefined) return remoteValue

  // 2. Check environment variable override
  const envKey = `VITE_FF_${flag}` as keyof ImportMetaEnv
  const envValue = import.meta.env[envKey]
  if (envValue !== undefined) return envValue === 'true'

  // 3. Fall back to default
  return FEATURE_FLAGS[flag]
}

// Usage in components
const Dashboard = () => {
  if (isFeatureEnabled('NEW_DASHBOARD')) {
    return <NewDashboard />
  }
  return <LegacyDashboard />
}

// ✅ BETTER: React hook + Context for reactive flag changes
const useFeatureFlag = (flag: FeatureFlag): boolean => {
  const flags = useContext(FeatureFlagContext)
  return flags[flag] ?? FEATURE_FLAGS[flag]
}

const Dashboard = () => {
  const showNewDashboard = useFeatureFlag('NEW_DASHBOARD')
  return showNewDashboard ? <NewDashboard /> : <LegacyDashboard />
}
```

**Rules:**
- Define all flags in one place with sensible defaults
- Use a hook or context for reactive flag resolution (flags can change at runtime with remote config)
- Clean up stale flags regularly — once a feature is fully rolled out, remove the flag and the old code path
- Feature-flagged code should be structured so the flag can be cleanly removed (avoid deeply nesting flag checks)

---

## 🏗️ Monorepo Considerations

> **Applies to:** Teams managing multiple apps or shared libraries in a single repository.
> **Tools:** Nx, Turborepo, pnpm workspaces, or Yarn workspaces.
>
> _If your project is a single app with no shared packages, you can skip this section._

### When to Consider a Monorepo

- You have 2+ frontend apps sharing components, utilities, or types
- You have a component library consumed by multiple apps
- You want atomic commits across packages (e.g., change an API contract + update the UI in one PR)
- Your shared code is currently copy-pasted between repos

### Recommended Structure

```
my-monorepo/
├── apps/
│   ├── web/                        # Main web application
│   │   ├── src/
│   │   ├── package.json
│   │   └── vite.config.ts
│   ├── admin/                      # Admin dashboard
│   │   ├── src/
│   │   └── package.json
│   └── mobile/                     # React Native app (if applicable)
├── packages/
│   ├── ui/                         # Shared component library
│   │   ├── src/
│   │   │   ├── Button/
│   │   │   ├── Dialog/
│   │   │   └── index.ts
│   │   └── package.json
│   ├── shared-utils/               # Shared utilities (date formatting, validation, etc.)
│   │   ├── src/
│   │   └── package.json
│   ├── api-client/                 # Shared API client / types
│   │   ├── src/
│   │   └── package.json
│   └── tsconfig/                   # Shared TypeScript configs
│       ├── base.json
│       ├── react.json
│       └── package.json
├── package.json                    # Root workspace config
├── turbo.json                      # Turborepo config (or nx.json for Nx)
└── pnpm-workspace.yaml             # Workspace package globs
```

### Shared Package Guidelines

```typescript
// packages/ui/src/Button/Button.tsx
// ✅ GOOD: Shared components are generic, well-typed, and have no app-specific dependencies

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const Button: React.FC<ButtonProps> = ({ variant = 'primary', size = 'md', isLoading, children, ...props }) => {
  // ...
}

// packages/ui/package.json
{
  "name": "@myorg/ui",
  "main": "./src/index.ts",         // Point to source for internal consumption
  "types": "./src/index.ts",
  "peerDependencies": {
    "react": "^18.0.0 || ^19.0.0",  // Don't bundle React — let the consuming app provide it
    "react-dom": "^18.0.0 || ^19.0.0"
  }
}
```

### Rules

- **Shared packages must not import from apps.** Dependency direction is always `app → package`, never the reverse.
- **Use peer dependencies** for React, React DOM, and other framework-level packages in shared libraries — don't bundle them.
- **Shared TypeScript config:** Maintain base `tsconfig` presets in a shared package; apps extend them.
- **Consistent tooling:** Enforce the same linter, formatter, and test runner across all packages.
- **Scope your packages:** Use an org scope (`@myorg/ui`, `@myorg/shared-utils`) to avoid naming conflicts.
- **Build only what changed:** Use Turborepo's caching or Nx's affected graph to avoid rebuilding unchanged packages.
- **Internal packages can import source directly** (no build step needed) if your bundler supports it. Only build/publish when packages are consumed externally.

---

## ✅ Checklist

Use this before submitting a PR or starting a code review.

### Architecture
- [ ] Page = layout wrapper only (no business logic)
- [ ] Container/Presenter separation is clear
- [ ] Custom hooks encapsulate complex logic
- [ ] Shared components live in `src/components/common/`

### TypeScript
- [ ] `strict` mode enabled
- [ ] No `any` usage (use `unknown` + type guards)
- [ ] Props defined with `interface`
- [ ] Constants use `as const` with derived types
- [ ] Type guards over type assertions

### State Management
- [ ] Server data owned by data fetching cache (not Redux state)
- [ ] Global state is minimal
- [ ] Selectors used for derived data
- [ ] No duplicated state

### Data Fetching
- [ ] API layer uses RTK Query / React Query (or equivalent)
- [ ] Cache invalidation is configured correctly
- [ ] `staleTime` / `keepUnusedDataFor` tuned per endpoint based on data freshness needs
- [ ] Optimistic updates used where latency matters (toggles, inline edits)
- [ ] Prefetching configured for predictable navigation (hover, route loaders)
- [ ] Polling uses `skipPollingIfUnfocused` + `refetchOnFocus`
- [ ] No redundant refetch mechanisms

### Forms
- [ ] Schema-based validation (Zod / Yup)
- [ ] API errors mapped to form fields
- [ ] Validation messages use i18n keys
- [ ] Submit button has loading/disabled state

### Error Handling
- [ ] Error boundaries at app and route level
- [ ] API errors handled with structured logger (not `console`)
- [ ] Error codes checked before string matching
- [ ] All data components handle loading/error/empty states

### Performance
- [ ] Feature routes are lazy loaded (`React.lazy` + `Suspense`)
- [ ] Heavy dependencies lazy loaded on-demand
- [ ] Explicit named exports (no `export *`)
- [ ] Specific icon imports
- [ ] `React.memo` on list items, cards, and core UI primitives
- [ ] `useMemo` / `useCallback` in persistent layout components
- [ ] Static computations hoisted to module scope

### Styling
- [ ] Mobile-first responsive design
- [ ] Dark mode supported (`dark:` variants)
- [ ] RTL-safe (logical properties: `ms-`, `me-`, `start`, `end`)
- [ ] No hardcoded widths or inline styles

### i18n
- [ ] All user-facing text uses translation keys
- [ ] i18n keys organized by feature namespace
- [ ] Localization utility functions for entity names
- [ ] No hardcoded strings in components
- [ ] Feature locale files in centralized `src/i18n/locales/`

### Accessibility
- [ ] All form inputs have labels
- [ ] All icon-only buttons have `aria-label`
- [ ] Error messages use `role="alert"`
- [ ] Modals trap and return focus
- [ ] Semantic HTML used throughout

### Testing
- [ ] Key user flows have tests
- [ ] Loading, error, and empty states are tested
- [ ] Queries use roles/labels (not test IDs)
- [ ] Container components use dependency injection for testable hook seams
- [ ] API calls are mocked via DI, MSW, or hook-level mocks

### Security
- [ ] No `dangerouslySetInnerHTML` without DOMPurify sanitization
- [ ] User-provided URLs validated before rendering as `href`
- [ ] External links use `rel="noopener noreferrer"`
- [ ] CSRF token included in API requests (if applicable)
- [ ] No secrets or API keys in client-side code
- [ ] `npm audit` passes with no critical vulnerabilities

### Feature Flags & Config
- [ ] Environment variables centralized in a typed config file
- [ ] Required env vars validated at startup
- [ ] Feature flags defined in one place with defaults
- [ ] Stale feature flags cleaned up after full rollout

### Code Quality
- [ ] No magic numbers/strings (centralized in `constants.ts`)
- [ ] Label mappings over switch statements
- [ ] No `console.*` in production code (use logger)
- [ ] Feature has no unused imports or dead code

---

> **Version:** 2.0 | **Last updated:** 2026-02-17 | **Scope:** General-purpose React + TypeScript frontend guidelines
