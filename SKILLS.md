# Project Architecture & Coding Standards

## 1. Feature-Based Structure (Vertical Slices)

All domain-specific logic must be contained within `src/features/{feature-name}/`.
Strictly follow this folder hierarchy for every feature:

- `ui/`: Presentational components ONLY. No business logic, no data fetching.
- `services/`: API call definitions using the `ofetch` base instance.
- `hooks/`: Custom React hooks, TanStack Query mutations/queries, and form logic.
- `types/`: TypeScript interfaces and types specific to the feature.

## 2. The "Logic-Free UI" Rule

- UI components must be "dumb." They receive data and functions via props or a single feature-hook.
- Forbidden in `ui/`: `useEffect`, `useQuery`, `useMutation`, or complex event handlers.
- Example: A login button should call `onSubmit` from `useLoginForm()`, not handle the fetch directly.

## 3. Networking Layer (ofetch)

- Use a centralized `ofetch` instance located in `src/shared/api/baseFetcher.ts`.
- All methods (GET, POST, PUT, DELETE) must use this instance.
- Authentication tokens must be injected via the `onRequest` interceptor.
- 401 Unauthorized errors must be handled globally in the `onResponseError` interceptor.

## 4. Global Error Handling & Toasts

- Do NOT call toast notifications inside components or hooks.
- Use the **Global Query Cache** and **Mutation Cache** in `src/providers/QueryClientProvider.tsx`.
- The `onError` callback of the global cache is the ONLY place where `toast.error()` should be triggered for API failures.

## 5. State Management

- Server State: TanStack Query (React Query).
- Local State: Use hooks within the feature folder.
- Global State: Only use for cross-cutting concerns (e.g., Auth, Theme).
