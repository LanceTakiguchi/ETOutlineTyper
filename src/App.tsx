import React, { useEffect, useRef, useState } from 'react'

interface Section {
  section: number | string
  heading: string
  day?: string
  subsections?: Section[]
}

interface OutlineData {
  title: string
  sections: Section[]
}

function normalizeExpectedKey(ch: string): string {
  if (ch === '\n') return 'Enter'
  return ch
}

function flattenSections(sections: Section[], depth: number = 0): string[] {
  const lines: string[] = []
  for (const section of sections) {
    const indent = '  '.repeat(depth)
    lines.push(`${indent}${section.section}. ${section.heading}`)
    if (section.subsections && section.subsections.length > 0) {
      lines.push(...flattenSections(section.subsections, depth + 1))
    }
  }
  return lines
}

export default function App() {
  const [outline, setOutline] = useState<string>('')
  const [day, setDay] = useState<number>(10)
  const [target, setTarget] = useState<string>('')
  const [typed, setTyped] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [previewVisible, setPreviewVisible] = useState<boolean>(false)
  const [ghostVisible, setGhostVisible] = useState<boolean>(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Get Outline data on load.
  useEffect(() => {
    fetch('./EToutline.json')
      .then((r) => r.json())
      .then((data: OutlineData) => {
        const lines = flattenSections(data.sections)
        setOutline(lines.join('\n'))
      })
      .catch(() => setOutline('Could not load EToutline.json'))
  }, [])

  // Day Sectioning.
  useEffect(() => {
    // compute portion based on day (1..10)
    // const chars = outline.length
    // const take = Math.max(1, Math.ceil((day / 10) * chars))
    // setTarget(outline.slice(0, take))
    setTarget(outline)
    setTyped('')
    setError(null)
  }, [outline, day])

  // Focus input on load.
  useEffect(() => {
    inputRef.current?.focus()
  }, [inputRef, target])

  // Typing logic.
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!target) return
      if (e.key === 'Meta' || e.key === 'Alt' || e.key === 'Control') return

      if (e.key === 'Backspace') {
        setTyped((t) => t.slice(0, -1))
        setError(null)
        return
      }

      const expected = target[typed.length];
      const expectedKey = normalizeExpectedKey(expected);

      // If user typed the right key, advance
      if (e.key === expectedKey) {
        setTyped((t) => t + expected)
        setError(null)
      } else {
        // ignore keys like Shift and other non-character keys
        if (e.key.length === 1 || e.key === 'Enter' || e.key === 'Tab') {
          setError(`Wrong character. Expected: "${expected === '\n' ? '\\n (Enter)' : expected}"`)
        }
      }
    }

    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [target, typed])


  const renderChar = (ch: string, i: number) => {
    const isTyped = i < typed.length
    const isCurrent = i === typed.length
    const base = isTyped ? 'text-green-600' : isCurrent ? 'underline decoration-black ' + (ghostVisible ? 'text-black-400' : 'text-transparent') : ghostVisible ? 'text-gray-400' : 'hidden'
    const visible = ch === '\n' ? '↵' : ch === ' ' ? '·' : ch
    return (
      <span key={i} className={`${base} not-italic whitespace-pre-wrap`}>{visible}</span>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-semibold mb-4">ET Outline Typer</h1>

        {/* <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Day (1–10)</label>
          <input
            type="number"
            min={1}
            max={10}
            value={day}
            onChange={(e) => setDay(Math.max(1, Math.min(10, Number(e.target.value || 1))))}
            className="mt-1 block w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
          <p className="text-sm text-gray-500 mt-1">Typing target is first {Math.max(1, Math.ceil((day / 10) * (outline.length || 1)))} characters of the outline.</p>
        </div> */}
        <div className="mb-4 flex items-center gap-2">
          <label className="block text-sm font-medium text-gray-700">Outline Preview</label>
          <button onClick={() => setPreviewVisible((v) => !v)} className="px-2 py-1 bg-gray-200 rounded text-sm">{previewVisible ? 'Hide 🙈' : 'Show 🐵'}</button>
        </div>
        <div className={`${previewVisible ? null : ' hidden'} preview mb-4 p-4 bg-slate-100 rounded max-h-64 overflow-auto font-mono text-sm`}>
          {outline.split('\n').map((line, i) => (
            <div key={i} className="text-sm text-black-400 font-mono whitespace-pre-wrap">{line}</div>
          ))}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Instructions</label>
          <p className="text-sm text-gray-600">Type the outline character-by-character. If you type a wrong character the progress will pause until you correct it. Use Backspace to delete.</p>
          <p className="text-sm text-gray-600">Key:</p>
          <ul className="list-disc list-inside text-sm text-gray-600">
            <li><span className="text-green-600 font-semibold">Green</span>: Correctly typed characters.</li>
            <li><span className="underline decoration-black">Underlined</span>: The next character to type.</li>
            <li><span className="text-gray-400">Gray</span>: Upcoming characters (shown when "Ghost Characters" is enabled).</li>
            <li><span className="text-transparent">Invisible</span>: Upcoming characters (default state).</li>
          </ul>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <label className="block text-sm font-medium text-gray-700">Ghost Characters</label>
          <button onClick={() => setGhostVisible((v) => !v)} className="px-2 py-1 bg-gray-200 rounded text-sm">{ghostVisible ? 'Hide 👻' : 'Show 👻'}</button>
        </div>

        <div className="type-area mb-4 p-4 bg-slate-100 rounded min-h-[12rem] overflow-auto font-mono text-sm">
          {target.split('').map((ch, i) => renderChar(ch, i))}
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="text-sm">Progress: <strong>{Math.min(100, Math.round((typed.length / Math.max(1, target.length)) * 100))}%</strong></div>
          <div className="text-sm text-gray-600">Typed: {typed.length} / {target.length} chars</div>
        </div>

        {error && <div className="mb-4 text-red-700">{error}</div>}

        <div className="mt-2">
          <input ref={inputRef} className="opacity-0 absolute left-0 top-0" aria-hidden value={typed} readOnly />
          <button onClick={() => inputRef.current?.focus()} className="px-3 py-2 bg-indigo-600 text-white rounded">Focus input (start typing)</button>
        </div>
      </div>
    </div>
  )
}
