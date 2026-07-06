"use client";

/* A recursive, schema-free form editor for the content JSON. Renders inputs for
   strings/numbers/booleans and add / remove / reorder controls for arrays. */

type Json = unknown;

function humanize(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function blankLike(sample: Json): Json {
  if (Array.isArray(sample)) return [];
  if (sample === null) return "";
  switch (typeof sample) {
    case "string":
      return "";
    case "number":
      return 0;
    case "boolean":
      return false;
    case "object": {
      const out: Record<string, Json> = {};
      for (const [k, v] of Object.entries(sample as object)) out[k] = blankLike(v);
      return out;
    }
    default:
      return "";
  }
}

function templateFor(arr: Json[]): Json {
  return arr.length ? blankLike(arr[0]) : "";
}

const inputCls =
  "w-full rounded-lg border border-[var(--hairline)] bg-[var(--page)] px-3 py-2 text-sm text-[var(--ink)] outline-none transition-colors placeholder:text-[var(--muted)] focus:border-[var(--accent)]";

function StringField({ value, onChange, path }: { value: string; onChange: (v: string) => void; path: string }) {
  const long = value.length > 60 || value.includes("\n");
  if (long) {
    return (
      <textarea
        className={`${inputCls} min-h-[70px] resize-y font-normal`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={Math.min(10, Math.max(2, Math.ceil(value.length / 70)))}
        aria-label={path}
      />
    );
  }
  return <input className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} aria-label={path} />;
}

export default function JsonEditor({
  value,
  onChange,
  path = "",
  depth = 0,
}: {
  value: Json;
  onChange: (v: Json) => void;
  path?: string;
  depth?: number;
}) {
  // primitives
  if (typeof value === "string") return <StringField value={value} onChange={onChange} path={path} />;
  if (typeof value === "number")
    return (
      <input
        type="number"
        className={inputCls}
        value={value}
        onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))}
        aria-label={path}
      />
    );
  if (typeof value === "boolean")
    return (
      <button
        type="button"
        onClick={() => onChange(!value)}
        role="switch"
        aria-checked={value}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${value ? "bg-[var(--accent)]" : "bg-[var(--hairline)]"}`}
      >
        <span className={`inline-block size-4 rounded-full bg-white transition-transform ${value ? "translate-x-6" : "translate-x-1"}`} />
      </button>
    );

  // arrays
  if (Array.isArray(value)) {
    const arr = value;
    const set = (i: number, v: Json) => onChange(arr.map((x, j) => (j === i ? v : x)));
    const remove = (i: number) => onChange(arr.filter((_, j) => j !== i));
    const move = (i: number, dir: -1 | 1) => {
      const j = i + dir;
      if (j < 0 || j >= arr.length) return;
      const next = arr.slice();
      [next[i], next[j]] = [next[j], next[i]];
      onChange(next);
    };
    const add = () => onChange([...arr, templateFor(arr)]);
    const primitive = arr.every((x) => typeof x !== "object" || x === null);

    return (
      <div className="space-y-2">
        {arr.map((item, i) => (
          <div
            key={i}
            className={`rounded-lg border border-[var(--hairline)] ${primitive ? "flex items-start gap-2 p-2" : "bg-[var(--header-tint)]/50 p-3"}`}
          >
            {!primitive && (
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-[var(--muted)]">Item {i + 1}</span>
                <div className="flex items-center gap-1">
                  <RowBtn label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>↑</RowBtn>
                  <RowBtn label="Move down" disabled={i === arr.length - 1} onClick={() => move(i, 1)}>↓</RowBtn>
                  <RowBtn label="Delete" danger onClick={() => remove(i)}>✕</RowBtn>
                </div>
              </div>
            )}
            <div className={primitive ? "flex-1" : ""}>
              <JsonEditor value={item} onChange={(v) => set(i, v)} path={`${path}[${i}]`} depth={depth + 1} />
            </div>
            {primitive && (
              <div className="flex items-center gap-1 pt-0.5">
                <RowBtn label="Move up" disabled={i === 0} onClick={() => move(i, -1)}>↑</RowBtn>
                <RowBtn label="Move down" disabled={i === arr.length - 1} onClick={() => move(i, 1)}>↓</RowBtn>
                <RowBtn label="Delete" danger onClick={() => remove(i)}>✕</RowBtn>
              </div>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={add}
          className="rounded-lg border border-dashed border-[var(--hairline)] px-3 py-1.5 text-xs font-semibold text-[var(--accent-strong)] transition-colors hover:border-[var(--accent)] hover:bg-[var(--header-tint)]"
        >
          + Add item
        </button>
      </div>
    );
  }

  // objects
  if (value && typeof value === "object") {
    const obj = value as Record<string, Json>;
    return (
      <div className={depth === 0 ? "space-y-5" : "space-y-3"}>
        {Object.entries(obj).map(([k, v]) => {
          const nested = v && typeof v === "object";
          return (
            <div key={k} className={nested ? "rounded-xl border border-[var(--hairline)] bg-[var(--card)] p-4" : ""}>
              <label className="mb-1.5 block text-sm font-semibold text-[var(--navy)]">{humanize(k)}</label>
              <JsonEditor value={v} onChange={(nv) => onChange({ ...obj, [k]: nv })} path={path ? `${path}.${k}` : k} depth={depth + 1} />
            </div>
          );
        })}
      </div>
    );
  }

  return <span className="text-xs text-[var(--muted)]">Unsupported value</span>;
}

function RowBtn({
  children,
  onClick,
  label,
  disabled,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  label: string;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className={`grid size-6 place-items-center rounded-md border border-[var(--hairline)] bg-[var(--page)] text-xs transition-colors disabled:opacity-30 ${
        danger ? "text-red-500 hover:border-red-400" : "text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
      }`}
    >
      {children}
    </button>
  );
}
