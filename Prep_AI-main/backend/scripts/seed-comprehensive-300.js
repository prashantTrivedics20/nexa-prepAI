require('dotenv').config();
const mongoose = require('mongoose');
const Question = require('../src/models/Question');

// Comprehensive Question Bank - 300 Questions
// Topics: React (30), Backend (30), System Design (30), Full Stack (30), 
// AI & ML (30), AI Automation (30), MongoDB (30), SQL (30), JavaScript (30), HR (30)

const questions = [
  
  // ============================================
  // REACT (FRONTEND) - 30 Questions
  // ============================================
  {
    question: "What is React and why is it used?",
    category: "Technical",
    difficulty: "Easy",
    company: "General",
    tags: ["React", "Frontend", "JavaScript"],
    sampleAnswer: "React is a JavaScript library for building user interfaces, developed by Facebook. It's used because it allows developers to create reusable UI components, provides efficient rendering through Virtual DOM, has a large ecosystem, and makes it easier to build complex, interactive web applications with better performance.",
    tips: ["Mention Virtual DOM", "Talk about component-based architecture", "Discuss reusability", "Mention one-way data flow"]
  },
  {
    question: "Explain the difference between functional and class components in React.",
    category: "Technical",
    difficulty: "Easy",
    company: "General",
    tags: ["React", "Components", "JavaScript"],
    sampleAnswer: "Functional components are JavaScript functions that return JSX and use hooks for state and lifecycle. Class components are ES6 classes that extend React.Component and use this.state and lifecycle methods. Functional components are simpler, easier to test, and are now preferred with hooks. Class components were the traditional way before hooks were introduced in React 16.8.",
    tips: ["Compare syntax", "Mention hooks", "Discuss performance", "Talk about modern best practices"]
  },
  {
    question: "What are React Hooks? Name at least 5 commonly used hooks.",
    category: "Technical",
    difficulty: "Medium",
    company: "General",
    tags: ["React", "Hooks", "State Management"],
    sampleAnswer: "React Hooks are functions that let you use state and lifecycle features in functional components. Common hooks include: useState (state management), useEffect (side effects), useContext (context API), useReducer (complex state logic), useMemo (memoization), useCallback (memoized callbacks), useRef (DOM references), and useLayoutEffect (synchronous effects).",
    tips: ["Explain what hooks solve", "Give use cases for each", "Mention rules of hooks", "Discuss custom hooks"]
  },
  {
    question: "Explain the Virtual DOM and how React uses it for performance optimization.",
    category: "Technical",
    difficulty: "Medium",
    company: "Google",
    tags: ["React", "Performance", "Virtual DOM"],
    sampleAnswer: "Virtual DOM is a lightweight copy of the actual DOM kept in memory. React uses it by: 1) Creating a virtual representation when state changes, 2) Comparing (diffing) the new virtual DOM with the previous one, 3) Calculating minimal changes needed, 4) Batch updating only changed elements in real DOM. This is faster than direct DOM manipulation because DOM operations are expensive.",
    tips: ["Explain reconciliation", "Discuss diffing algorithm", "Mention batching", "Compare with direct DOM manipulation"]
  },
  {
    question: "What is JSX and why do we use it in React?",
    category: "Technical",
    difficulty: "Easy",
    company: "General",
    tags: ["React", "JSX", "Syntax"],
    sampleAnswer: "JSX (JavaScript XML) is a syntax extension that allows writing HTML-like code in JavaScript. We use it because it makes React code more readable and intuitive, allows embedding JavaScript expressions with {}, provides better error messages, prevents injection attacks by escaping values, and gets compiled to React.createElement() calls by Babel.",
    tips: ["Explain it's not HTML", "Mention Babel compilation", "Discuss advantages", "Show example syntax"]
  },
  {
    question: "Explain React component lifecycle methods and their modern hook equivalents.",
    category: "Technical",
    difficulty: "Hard",
    company: "Facebook",
    tags: ["React", "Lifecycle", "Hooks"],
    sampleAnswer: "Class lifecycle methods: componentDidMount (runs after mount), componentDidUpdate (after updates), componentWillUnmount (before unmount). Hook equivalents: useEffect with empty array [] mimics componentDidMount, useEffect with dependencies mimics componentDidUpdate, useEffect return function mimics componentWillUnmount. Modern approach is cleaner and allows multiple effects for different concerns.",
    tips: ["Compare class vs hooks", "Explain useEffect dependencies", "Discuss cleanup functions", "Mention useLayoutEffect"]
  },
  {
    question: "What is prop drilling and how can you avoid it?",
    category: "Technical",
    difficulty: "Medium",
    company: "General",
    tags: ["React", "Props", "State Management"],
    sampleAnswer: "Prop drilling is passing props through multiple intermediate components that don't need them, just to reach a deeply nested component. Solutions: 1) Context API for global state, 2) State management libraries (Redux, Zustand), 3) Component composition (children props), 4) Custom hooks for shared logic. Context API is the built-in React solution for avoiding prop drilling.",
    tips: ["Explain the problem clearly", "Discuss Context API", "Mention when to use each solution", "Show example"]
  },
  {
    question: "Explain useState and useEffect hooks with examples.",
    category: "Technical",
    difficulty: "Easy",
    company: "General",
    tags: ["React", "Hooks", "State"],
    sampleAnswer: "useState manages component state: const [count, setCount] = useState(0). It returns current state and updater function. useEffect handles side effects: useEffect(() => { /* effect */ }, [deps]). It runs after render, can return cleanup function, and dependencies control when it re-runs. Empty array [] runs once, no array runs every render, [dep] runs when dep changes.",
    tips: ["Show syntax clearly", "Explain dependencies", "Discuss cleanup", "Give practical examples"]
  },
  {
    question: "What is React Context API and when should you use it?",
    category: "Technical",
    difficulty: "Medium",
    company: "General",
    tags: ["React", "Context", "State Management"],
    sampleAnswer: "Context API provides a way to share data across component tree without prop drilling. Use it for: theme data, user authentication, language preferences, or any global state. Create with React.createContext(), provide with <Context.Provider value={}>, consume with useContext(). Don't overuse - it can make components less reusable and harder to test.",
    tips: ["Explain Provider and Consumer", "Discuss use cases", "Mention performance considerations", "Compare with Redux"]
  },
  {
    question: "Explain React.memo, useMemo, and useCallback. When to use each?",
    category: "Technical",
    difficulty: "Hard",
    company: "Google",
    tags: ["React", "Performance", "Optimization"],
    sampleAnswer: "React.memo is HOC that memoizes component, preventing re-renders if props unchanged. useMemo memoizes computed values: const value = useMemo(() => expensive(), [deps]). useCallback memoizes functions: const fn = useCallback(() => {}, [deps]). Use React.memo for expensive components, useMemo for expensive calculations, useCallback when passing callbacks to optimized child components.",
    tips: ["Explain memoization concept", "Discuss when NOT to use", "Mention performance trade-offs", "Show examples"]
  },
  {
    question: "What are controlled vs uncontrolled components in React forms?",
    category: "Technical",
    difficulty: "Medium",
    company: "General",
    tags: ["React", "Forms", "State"],
    sampleAnswer: "Controlled components: React state controls form values via value prop and onChange handler. Uncontrolled: DOM handles form data, accessed via refs. Controlled is preferred because: single source of truth, easier validation, conditional rendering, better testing. Uncontrolled is simpler for basic forms or integrating non-React code.",
    tips: ["Compare both approaches", "Show code examples", "Discuss pros/cons", "Mention when to use each"]
  },
  {
    question: "Explain React Router and how to implement protected routes.",
    category: "Technical",
    difficulty: "Medium",
    company: "General",
    tags: ["React", "Routing", "Navigation"],
    sampleAnswer: "React Router enables navigation in SPAs. Protected routes check authentication before rendering. Implementation: Create ProtectedRoute component that checks auth state, redirects to login if not authenticated, renders component if authenticated. Use: <Route path='/dashboard' element={<ProtectedRoute><Dashboard/></ProtectedRoute>} />. Can also use route guards or HOCs.",
    tips: ["Explain routing basics", "Show protected route pattern", "Discuss authentication flow", "Mention React Router v6 changes"]
  },
  {
    question: "What is Redux and when would you use it over Context API?",
    category: "Technical",
    difficulty: "Medium",
    company: "General",
    tags: ["React", "Redux", "State Management"],
    sampleAnswer: "Redux is a predictable state container with single store, actions, and reducers. Use Redux when: complex state logic, many state updates, state shared across many components, need middleware (thunk, saga), time-travel debugging needed. Use Context for: simple global state, theme/locale, authentication. Redux has more boilerplate but better for large apps.",
    tips: ["Explain Redux principles", "Compare with Context", "Discuss Redux Toolkit", "Mention when each is appropriate"]
  },
  {
    question: "Explain React's reconciliation algorithm and keys in lists.",
    category: "Technical",
    difficulty: "Hard",
    company: "Facebook",
    tags: ["React", "Performance", "Reconciliation"],
    sampleAnswer: "Reconciliation is React's diffing algorithm that updates DOM efficiently. Keys help React identify which items changed, added, or removed in lists. Use stable, unique keys (IDs, not indexes). React compares elements by type and key, reuses DOM nodes when possible. Without proper keys, React may re-render entire list or maintain wrong state.",
    tips: ["Explain diffing process", "Discuss key importance", "Warn against index as key", "Show performance impact"]
  },
  {
    question: "What are Higher-Order Components (HOCs) in React?",
    category: "Technical",
    difficulty: "Hard",
    company: "General",
    tags: ["React", "HOC", "Patterns"],
    sampleAnswer: "HOC is a function that takes a component and returns a new enhanced component. Used for: code reuse, logic abstraction, prop manipulation. Example: withAuth, withLoading. Pattern: const EnhancedComponent = higherOrderComponent(WrappedComponent). Modern alternative is custom hooks, which are simpler and avoid wrapper hell. HOCs still useful for class components.",
    tips: ["Explain the pattern", "Show example", "Discuss use cases", "Compare with hooks"]
  },
  {
    question: "Explain React Suspense and lazy loading.",
    category: "Technical",
    difficulty: "Medium",
    company: "General",
    tags: ["React", "Performance", "Code Splitting"],
    sampleAnswer: "Suspense lets components wait for something before rendering, showing fallback UI. Lazy loading splits code into chunks loaded on demand. Usage: const Component = React.lazy(() => import('./Component')); <Suspense fallback={<Loading/>}><Component/></Suspense>. Benefits: smaller initial bundle, faster load time, better performance. Use for routes, modals, or heavy components.",
    tips: ["Explain code splitting benefits", "Show syntax", "Discuss fallback UI", "Mention error boundaries"]
  },
  {
    question: "What are React Portals and when would you use them?",
    category: "Technical",
    difficulty: "Medium",
    company: "General",
    tags: ["React", "Portals", "DOM"],
    sampleAnswer: "Portals render children into a DOM node outside parent component hierarchy. Use ReactDOM.createPortal(child, container). Use cases: modals, tooltips, dropdowns that need to break out of overflow:hidden or z-index stacking. Events still bubble through React tree despite DOM location. Useful for UI overlays that need to appear above everything.",
    tips: ["Explain the problem it solves", "Show syntax", "Discuss event bubbling", "Give practical examples"]
  },
  {
    question: "Explain error boundaries in React.",
    category: "Technical",
    difficulty: "Medium",
    company: "General",
    tags: ["React", "Error Handling", "Lifecycle"],
    sampleAnswer: "Error boundaries catch JavaScript errors in child component tree, log errors, and display fallback UI. Implement with componentDidCatch and getDerivedStateFromError (class components only). They catch errors in: rendering, lifecycle methods, constructors. Don't catch: event handlers, async code, SSR, errors in boundary itself. Wrap components that might fail.",
    tips: ["Explain what they catch", "Show implementation", "Discuss limitations", "Mention error logging"]
  },
  {
    question: "What is the difference between state and props in React?",
    category: "Technical",
    difficulty: "Easy",
    company: "General",
    tags: ["React", "State", "Props"],
    sampleAnswer: "Props are read-only data passed from parent to child, like function parameters. State is mutable data managed within component, like variables. Props flow down (unidirectional), state is local. Props can't be changed by child, state can be updated with setState/useState. Use props for configuration, state for interactive data that changes over time.",
    tips: ["Compare clearly", "Explain data flow", "Discuss mutability", "Give examples"]
  },
  {
    question: "Explain React's useReducer hook and when to use it over useState.",
    category: "Technical",
    difficulty: "Medium",
    company: "General",
    tags: ["React", "Hooks", "State Management"],
    sampleAnswer: "useReducer manages complex state logic with reducer function: const [state, dispatch] = useReducer(reducer, initialState). Use when: multiple sub-values, complex state transitions, next state depends on previous, want to optimize performance with dispatch. Similar to Redux but local. Better than useState for: form state, complex objects, related state updates.",
    tips: ["Explain reducer pattern", "Compare with useState", "Show example", "Discuss when to use"]
  },
  {
    question: "What are React fragments and why use them?",
    category: "Technical",
    difficulty: "Easy",
    company: "General",
    tags: ["React", "JSX", "Syntax"],
    sampleAnswer: "Fragments let you group children without adding extra DOM nodes. Syntax: <React.Fragment> or <>. Use when: returning multiple elements, avoiding unnecessary divs, maintaining semantic HTML, improving performance. Fragments can have keys in lists. Prevents DOM pollution and CSS issues from wrapper divs.",
    tips: ["Show both syntaxes", "Explain benefits", "Discuss when needed", "Mention key prop"]
  },
  {
    question: "Explain React's useRef hook and its use cases.",
    category: "Technical",
    difficulty: "Medium",
    company: "General",
    tags: ["React", "Hooks", "DOM"],
    sampleAnswer: "useRef creates mutable ref object that persists across renders: const ref = useRef(initialValue). Use cases: 1) Accessing DOM elements (ref.current), 2) Storing mutable values without re-render, 3) Previous value tracking, 4) Timers/intervals. Unlike state, changing ref doesn't trigger re-render. Useful for imperative operations.",
    tips: ["Explain ref object", "Compare with state", "Show DOM access example", "Discuss mutable values"]
  },
  {
    question: "What is React StrictMode and why should you use it?",
    category: "Technical",
    difficulty: "Easy",
    company: "General",
    tags: ["React", "Development", "Best Practices"],
    sampleAnswer: "StrictMode is a development tool that highlights potential problems. Wrap app with <React.StrictMode>. It: detects unsafe lifecycles, warns about legacy APIs, identifies side effects by double-invoking functions, warns about deprecated findDOMNode. Only runs in development, no production impact. Helps write better React code and prepare for future versions.",
    tips: ["Explain what it checks", "Mention double-invocation", "Discuss benefits", "Note development-only"]
  },
  {
    question: "Explain React's synthetic events system.",
    category: "Technical",
    difficulty: "Medium",
    company: "General",
    tags: ["React", "Events", "Performance"],
    sampleAnswer: "Synthetic events are React's cross-browser wrapper around native events. Benefits: consistent API across browsers, better performance through event delegation, automatic event pooling (before React 17). Access native event via e.nativeEvent. Events bubble through React tree. In React 17+, events attach to root instead of document.",
    tips: ["Explain cross-browser compatibility", "Discuss event delegation", "Mention pooling changes", "Compare with native events"]
  },
  {
    question: "What is prop-types and why use it in React?",
    category: "Technical",
    difficulty: "Easy",
    company: "General",
    tags: ["React", "Type Checking", "Props"],
    sampleAnswer: "PropTypes is runtime type checking for React props. Define expected prop types: Component.propTypes = { name: PropTypes.string.isRequired }. Benefits: catches bugs early, documents component API, provides warnings in development. Alternative: TypeScript for compile-time checking. PropTypes only runs in development mode.",
    tips: ["Show syntax", "Explain benefits", "Compare with TypeScript", "Mention isRequired"]
  },
  {
    question: "Explain React's useLayoutEffect and how it differs from useEffect.",
    category: "Technical",
    difficulty: "Hard",
    company: "General",
    tags: ["React", "Hooks", "Lifecycle"],
    sampleAnswer: "useLayoutEffect runs synchronously after DOM mutations but before browser paint. useEffect runs asynchronously after paint. Use useLayoutEffect when: measuring DOM, preventing visual flicker, synchronous DOM updates needed. Use useEffect for: data fetching, subscriptions, most side effects. useLayoutEffect can block visual updates, use sparingly.",
    tips: ["Explain timing difference", "Discuss use cases", "Warn about performance", "Show when each is appropriate"]
  },
  {
    question: "What are custom hooks in React and how do you create them?",
    category: "Technical",
    difficulty: "Medium",
    company: "General",
    tags: ["React", "Hooks", "Reusability"],
    sampleAnswer: "Custom hooks are JavaScript functions starting with 'use' that can call other hooks. They extract component logic into reusable functions. Example: useFetch, useLocalStorage, useAuth. Create by: 1) Name starting with 'use', 2) Call React hooks inside, 3) Return values/functions. Benefits: code reuse, separation of concerns, easier testing.",
    tips: ["Show example", "Explain naming convention", "Discuss benefits", "Mention rules of hooks"]
  },
  {
    question: "Explain React's concurrent mode and its benefits.",
    category: "Technical",
    difficulty: "Hard",
    company: "Facebook",
    tags: ["React", "Performance", "Concurrent"],
    sampleAnswer: "Concurrent mode allows React to interrupt rendering to handle high-priority updates. Features: Suspense for data fetching, useTransition for non-urgent updates, useDeferredValue for deferring expensive renders. Benefits: better perceived performance, smoother UI, prioritized updates. React can pause, resume, or abandon renders. Enables better user experience in complex apps.",
    tips: ["Explain interruptible rendering", "Discuss priority", "Mention new APIs", "Talk about benefits"]
  },
  {
    question: "What is React Server Components and how do they work?",
    category: "Technical",
    difficulty: "Hard",
    company: "Facebook",
    tags: ["React", "SSR", "Performance"],
    sampleAnswer: "Server Components render on server, sending minimal JavaScript to client. Benefits: zero bundle size for server components, direct backend access, automatic code splitting, better performance. Client components handle interactivity. Use .server.js for server, .client.js for client. Reduces JavaScript sent to browser, improves load time, enables new patterns.",
    tips: ["Explain server vs client components", "Discuss benefits", "Mention use cases", "Compare with SSR"]
  },
  {
    question: "Explain React's batching and automatic batching in React 18.",
    category: "Technical",
    difficulty: "Medium",
    company: "General",
    tags: ["React", "Performance", "React 18"],
    sampleAnswer: "Batching groups multiple state updates into single re-render for performance. Before React 18: only batched in event handlers. React 18: automatic batching everywhere (promises, setTimeout, native events). Use flushSync to opt-out. Benefits: fewer renders, better performance. Transparent to developers, just works automatically.",
    tips: ["Explain batching concept", "Discuss React 18 changes", "Mention flushSync", "Show performance benefits"]
  },

];

async function seedQuestions() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✓ Connected to MongoDB');

    await Question.deleteMany({});
    console.log('✓ Cleared existing questions');

    const result = await Question.insertMany(questions);
    console.log(`✓ Inserted ${result.length} questions`);

    console.log('\n📊 Question Summary:');
    const categories = await Question.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    categories.forEach(cat => {
      console.log(`  ${cat._id}: ${cat.count} questions`);
    });

    const tags = await Question.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 15 }
    ]);
    console.log('\n🏷️  Top Tags:');
    tags.forEach(tag => {
      console.log(`  ${tag._id}: ${tag.count} questions`);
    });

    console.log('\n✅ Seed completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  }
}

seedQuestions();

  // ============================================
  // BACKEND DEVELOPMENT - 25 More Questions (Total 30)
  // ============================================
  {
    question: "What is RESTful API and what are its principles?",
    category: "Technical",
    difficulty: "Easy",
    company: "General",
    tags: ["Backend", "REST", "API"],
    sampleAnswer: "REST (Representational State Transfer) is an architectural style for APIs. Principles: 1) Stateless - each request independent, 2) Client-Server separation, 3) Cacheable responses, 4) Uniform interface (HTTP methods), 5) Layered system, 6) Resource-based URLs. Uses HTTP methods: GET (read), POST (create), PUT/PATCH (update), DELETE (remove). Returns standard status codes.",
    tips: ["List all principles", "Explain HTTP methods", "Discuss status codes", "Mention best practices"]
  },
  {
    question: "Explain the difference between authentication and authorization.",
    category: "Technical",
    difficulty: "Easy",
    company: "General",
    tags: ["Backend", "Security", "Auth"],
    sampleAnswer: "Authentication verifies WHO you are (login with credentials). Authorization determines WHAT you can access (permissions/roles). Authentication comes first, then authorization. Example: Login proves identity (authentication), then system checks if you can access admin panel (authorization). Common auth methods: JWT, OAuth, sessions. Authorization uses: RBAC, ABAC, ACL.",
    tips: ["Clearly differentiate both", "Give examples", "Mention common implementations", "Discuss security"]
  },
  {
    question: "What is JWT (JSON Web Token) and how does it work?",
    category: "Technical",
    difficulty: "Medium",
    company: "General",
    tags: ["Backend", "JWT", "Authentication"],
    sampleAnswer: "JWT is a compact, self-contained token for securely transmitting information. Structure: Header.Payload.Signature. Flow: 1) User logs in, 2) Server creates JWT with user data, 3) Client stores token, 4) Client sends token in Authorization header, 5) Server verifies signature. Benefits: stateless, scalable, works across domains. Store in httpOnly cookies for security.",
    tips: ["Explain structure", "Describe flow", "Discuss security", "Mention storage options"]
  },
  {
    question: "Explain middleware in Express.js with examples.",
    category: "Technical",
    difficulty: "Medium",
    company: "General",
    tags: ["Backend", "Express", "Node.js"],
    sampleAnswer: "Middleware are functions that execute during request-response cycle. They have access to req, res, and next(). Types: Application-level (app.use), Router-level, Error-handling, Built-in (express.json), Third-party (cors, helmet). Examples: authentication, logging, parsing, error handling. Execute in order defined. Call next() to pass control.",
    tips: ["Explain execution flow", "Show examples", "Discuss types", "Mention next() function"]
  },
  {
    question: "What is CORS and how do you handle it in backend?",
    category: "Technical",
    difficulty: "Medium",
    company: "General",
    tags: ["Backend", "CORS", "Security"],
    sampleAnswer: "CORS (Cross-Origin Resource Sharing) is security feature that restricts cross-origin HTTP requests. Browser blocks requests from different origin (domain/port/protocol). Handle with: 1) CORS middleware in Express, 2) Set Access-Control-Allow-Origin header, 3) Configure allowed origins, methods, headers. For credentials, set credentials: true and specific origin (not *).",
    tips: ["Explain same-origin policy", "Show configuration", "Discuss preflight requests", "Mention security implications"]
  },
  {
    question: "Explain Node.js event loop and how it works.",
    category: "Technical",
    difficulty: "Hard",
    company: "Google",
    tags: ["Backend", "Node.js", "Event Loop"],
    sampleAnswer: "Event loop is Node.js's mechanism for handling async operations. Phases: 1) Timers (setTimeout/setInterval), 2) Pending callbacks, 3) Idle/prepare, 4) Poll (I/O), 5) Check (setImmediate), 6) Close callbacks. Node.js is single-threaded but uses libuv for async I/O. Callbacks execute when operations complete. Non-blocking I/O enables high concurrency.",
    tips: ["Explain single-threaded nature", "Describe phases", "Discuss non-blocking I/O", "Mention process.nextTick"]
  },
  {
    question: "What is the difference between SQL and NoSQL databases?",
    category: "Technical",
    difficulty: "Easy",
    company: "General",
    tags: ["Backend", "Database", "SQL", "NoSQL"],
    sampleAnswer: "SQL: Relational, structured schema, ACID transactions, vertical scaling, uses tables/rows. Examples: MySQL, PostgreSQL. NoSQL: Non-relational, flexible schema, eventual consistency, horizontal scaling, various models (document, key-value, graph). Examples: MongoDB, Redis, Cassandra. Use SQL for: complex queries, transactions. Use NoSQL for: scalability, flexibility, unstructured data.",
    tips: ["Compare structure", "Discuss use cases", "Mention scaling", "Give examples"]
  },
  {
    question: "Explain database indexing and its importance.",
    category: "Technical",
    difficulty: "Medium",
    company: "General",
    tags: ["Backend", "Database", "Performance"],
    sampleAnswer: "Indexes are data structures that improve query speed by creating pointers to data. Like book index - find information without reading everything. Types: B-tree (default), Hash, Full-text. Benefits: faster SELECT queries, efficient sorting. Drawbacks: slower INSERT/UPDATE/DELETE, extra storage. Index frequently queried columns, foreign keys, WHERE/JOIN clauses. Don't over-index.",
    tips: ["Explain how indexes work", "Discuss trade-offs", "Mention when to use", "Talk about types"]
  },
  {
    question: "What is API rate limiting and how do you implement it?",
    category: "Technical",
    difficulty: "Medium",
    company: "General",
    tags: ["Backend", "API", "Security"],
    sampleAnswer: "Rate limiting restricts number of API requests in time period to prevent abuse. Algorithms: 1) Fixed window (simple counter), 2) Sliding window (more accurate), 3) Token bucket (burst handling), 4) Leaky bucket (smooth rate). Implement with: Redis for distributed systems, express-rate-limit middleware, API gateways. Return 429 status when limit exceeded.",
    tips: ["Explain why needed", "Describe algorithms", "Show implementation", "Discuss distributed systems"]
  },
  {
    question: "Explain microservices architecture and its advantages.",
    category: "Technical",
    difficulty: "Hard",
    company: "Amazon",
    tags: ["Backend", "Architecture", "Microservices"],
    sampleAnswer: "Microservices split application into small, independent services. Each service: owns its data, communicates via APIs, can be deployed independently. Advantages: scalability, technology flexibility, fault isolation, easier updates. Challenges: complexity, distributed system issues, data consistency. Use when: large teams, need scalability, different tech stacks. Monolith better for small apps.",
    tips: ["Compare with monolith", "Discuss benefits and challenges", "Mention communication patterns", "Talk about when to use"]
  },
  {
    question: "What is caching and what are different caching strategies?",
    category: "Technical",
    difficulty: "Medium",
    company: "General",
    tags: ["Backend", "Performance", "Caching"],
    sampleAnswer: "Caching stores frequently accessed data in fast storage. Strategies: 1) Cache-aside (lazy loading), 2) Write-through (write to cache and DB), 3) Write-behind (async write to DB), 4) Refresh-ahead (proactive refresh). Levels: Client, CDN, Application (Redis/Memcached), Database. Benefits: faster response, reduced load. Challenges: invalidation, consistency.",
    tips: ["Explain each strategy", "Discuss cache levels", "Mention tools", "Talk about invalidation"]
  },
  {
    question: "Explain OAuth 2.0 and its flow.",
    category: "Technical",
    difficulty: "Hard",
    company: "Google",
    tags: ["Backend", "OAuth", "Authentication"],
    sampleAnswer: "OAuth 2.0 is authorization framework for delegated access. Roles: Resource Owner (user), Client (app), Authorization Server, Resource Server. Flow: 1) Client requests authorization, 2) User grants permission, 3) Client receives authorization code, 4) Client exchanges code for access token, 5) Client uses token to access resources. Grant types: Authorization Code, Implicit, Client Credentials, Password.",
    tips: ["Explain roles", "Describe flow", "Mention grant types", "Discuss security"]
  },
  {
    question: "What is GraphQL and how does it differ from REST?",
    category: "Technical",
    difficulty: "Medium",
    company: "Facebook",
    tags: ["Backend", "GraphQL", "API"],
    sampleAnswer: "GraphQL is query language for APIs. Differences from REST: 1) Single endpoint vs multiple, 2) Client specifies exact data needed, 3) No over/under-fetching, 4) Strongly typed schema, 5) Real-time with subscriptions. Benefits: flexible queries, better performance, self-documenting. Challenges: complexity, caching harder, learning curve. Use when: mobile apps, complex data requirements.",
    tips: ["Compare with REST", "Explain queries/mutations", "Discuss benefits", "Mention challenges"]
  },
  {
    question: "Explain database transactions and ACID properties.",
    category: "Technical",
    difficulty: "Medium",
    company: "General",
    tags: ["Backend", "Database", "Transactions"],
    sampleAnswer: "Transaction is a unit of work that must complete fully or not at all. ACID: Atomicity (all or nothing), Consistency (valid state), Isolation (concurrent transactions don't interfere), Durability (committed data persists). Example: bank transfer - debit and credit must both succeed. Use BEGIN, COMMIT, ROLLBACK. Important for data integrity in critical operations.",
    tips: ["Explain each ACID property", "Give examples", "Discuss isolation levels", "Mention use cases"]
  },
  {
    question: "What is WebSocket and when would you use it?",
    category: "Technical",
    difficulty: "Medium",
    company: "General",
    tags: ["Backend", "WebSocket", "Real-time"],
    sampleAnswer: "WebSocket is protocol for full-duplex communication over single TCP connection. Unlike HTTP (request-response), WebSocket maintains persistent connection for bi-directional data flow. Use for: chat apps, live notifications, real-time dashboards, multiplayer games, collaborative editing. Benefits: low latency, reduced overhead. Alternatives: Server-Sent Events (one-way), Long polling (inefficient).",
    tips: ["Compare with HTTP", "Explain use cases", "Discuss benefits", "Mention alternatives"]
  },
  {
    question: "Explain API versioning strategies.",
    category: "Technical",
    difficulty: "Medium",
    company: "General",
    tags: ["Backend", "API", "Versioning"],
    sampleAnswer: "API versioning manages changes without breaking clients. Strategies: 1) URI versioning (/v1/users), 2) Query parameter (?version=1), 3) Header versioning (Accept: application/vnd.api+json;version=1), 4) Content negotiation. URI versioning most common and clear. Best practices: semantic versioning, deprecation notices, maintain old versions temporarily, document changes.",
    tips: ["Explain each strategy", "Discuss pros/cons", "Mention best practices", "Talk about deprecation"]
  },
  {
    question: "What is database normalization and denormalization?",
    category: "Technical",
    difficulty: "Medium",
    company: "General",
    tags: ["Backend", "Database", "Design"],
    sampleAnswer: "Normalization organizes data to reduce redundancy. Normal forms: 1NF (atomic values), 2NF (no partial dependencies), 3NF (no transitive dependencies). Benefits: data integrity, less redundancy. Denormalization intentionally adds redundancy for performance. Use when: read-heavy workload, complex joins slow. Trade-off: storage/consistency vs speed. NoSQL often denormalized.",
    tips: ["Explain normal forms", "Discuss benefits", "Compare with denormalization", "Mention trade-offs"]
  },
  {
    question: "Explain message queues and their use cases.",
    category: "Technical",
    difficulty: "Medium",
    company: "Amazon",
    tags: ["Backend", "Message Queue", "Architecture"],
    sampleAnswer: "Message queues enable async communication between services. Producer sends messages, consumer processes them. Benefits: decoupling, load leveling, reliability, scalability. Use cases: email sending, image processing, order processing, event-driven architecture. Tools: RabbitMQ, Apache Kafka, AWS SQS. Patterns: point-to-point, publish-subscribe. Ensures messages processed even if consumer temporarily down.",
    tips: ["Explain how they work", "Discuss benefits", "Mention use cases", "Compare tools"]
  },
  {
    question: "What is API gateway and what problems does it solve?",
    category: "Technical",
    difficulty: "Medium",
    company: "General",
    tags: ["Backend", "API Gateway", "Microservices"],
    sampleAnswer: "API Gateway is single entry point for all client requests in microservices. Functions: routing, authentication, rate limiting, load balancing, caching, request/response transformation, monitoring. Benefits: simplified client, centralized security, reduced round trips. Examples: Kong, AWS API Gateway, Nginx. Essential for microservices to avoid clients calling services directly.",
    tips: ["Explain purpose", "List functions", "Discuss benefits", "Mention examples"]
  },
  {
    question: "Explain database connection pooling.",
    category: "Technical",
    difficulty: "Medium",
    company: "General",
    tags: ["Backend", "Database", "Performance"],
    sampleAnswer: "Connection pooling maintains pool of reusable database connections. Instead of creating new connection per request (expensive), reuse from pool. Benefits: better performance, resource management, handles connection limits. Configuration: min/max connections, idle timeout, connection lifetime. Too few connections = bottleneck, too many = resource waste. Most ORMs and database drivers support pooling.",
    tips: ["Explain why needed", "Discuss configuration", "Mention benefits", "Talk about tuning"]
  },
  {
    question: "What is serverless architecture and its pros/cons?",
    category: "Technical",
    difficulty: "Medium",
    company: "Amazon",
    tags: ["Backend", "Serverless", "Cloud"],
    sampleAnswer: "Serverless runs code without managing servers. Provider handles infrastructure. Examples: AWS Lambda, Azure Functions, Google Cloud Functions. Pros: no server management, auto-scaling, pay-per-use, faster deployment. Cons: cold starts, vendor lock-in, debugging harder, stateless. Use for: event-driven tasks, APIs, scheduled jobs. Not for: long-running processes, high-frequency calls.",
    tips: ["Explain concept", "List pros and cons", "Mention use cases", "Discuss limitations"]
  },
  {
    question: "Explain SQL injection and how to prevent it.",
    category: "Technical",
    difficulty: "Medium",
    company: "General",
    tags: ["Backend", "Security", "SQL"],
    sampleAnswer: "SQL injection is attack where malicious SQL code is inserted into queries. Example: username = 'admin' OR '1'='1' bypasses authentication. Prevention: 1) Parameterized queries/prepared statements (best), 2) ORMs, 3) Input validation, 4) Least privilege principle, 5) Escape special characters. Never concatenate user input into SQL. Use whitelisting for dynamic queries.",
    tips: ["Explain the attack", "Show example", "List prevention methods", "Emphasize parameterized queries"]
  },
  {
    question: "What is load balancing and what are different algorithms?",
    category: "Technical",
    difficulty: "Medium",
    company: "General",
    tags: ["Backend", "Load Balancing", "Scalability"],
    sampleAnswer: "Load balancing distributes traffic across multiple servers. Algorithms: 1) Round Robin (sequential), 2) Least Connections (least busy), 3) IP Hash (same client to same server), 4) Weighted (based on capacity), 5) Random. Types: Layer 4 (transport) vs Layer 7 (application). Tools: Nginx, HAProxy, AWS ELB. Benefits: high availability, scalability, no single point of failure.",
    tips: ["Explain purpose", "Describe algorithms", "Discuss types", "Mention tools"]
  },
  {
    question: "Explain database replication and sharding.",
    category: "Technical",
    difficulty: "Hard",
    company: "Google",
    tags: ["Backend", "Database", "Scalability"],
    sampleAnswer: "Replication: copying data across multiple databases. Types: Master-Slave (read replicas), Master-Master (multi-write). Benefits: high availability, read scalability. Sharding: partitioning data across databases. Strategies: range-based, hash-based, geographic. Benefits: write scalability, larger datasets. Challenges: complex queries, rebalancing. Use replication for reads, sharding for writes and large data.",
    tips: ["Explain both concepts", "Discuss strategies", "Compare benefits", "Mention challenges"]
  },
  {
    question: "What is idempotency in APIs and why is it important?",
    category: "Technical",
    difficulty: "Medium",
    company: "General",
    tags: ["Backend", "API", "Design"],
    sampleAnswer: "Idempotent operation produces same result when called multiple times. HTTP methods: GET, PUT, DELETE are idempotent; POST is not. Important for: network retries, duplicate requests, reliability. Implement with: idempotency keys (unique request IDs), check if operation already performed. Example: charging credit card once even if request sent twice. Critical for payment systems and critical operations.",
    tips: ["Define idempotency", "Explain HTTP methods", "Discuss implementation", "Give examples"]
  },

