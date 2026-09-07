export default function App() {
  return (
    <div className="p-8 space-y-4 bg-surface min-h-screen">
      <h1 className="text-headline-md text-primary">Majestic Tourism</h1>
      <button className="btn-primary">Primary Button</button>
      <button className="btn-secondary">Secondary Button</button>
      <div className="card max-w-sm">
        <span className="chip bg-tertiary-container text-on-tertiary-container">Trending</span>
        <p className="text-body-md text-text-muted mt-2">Card with soft shadow, no border.</p>
      </div>
    </div>
  );
}