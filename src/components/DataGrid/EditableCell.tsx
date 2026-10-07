'use client';
// Inline edit of one cell: an edit button opens a text field. Enter saves and
// Escape cancels, both returning focus to the button; leaving the field saves
// and leaves focus where the user went. An empty or unchanged value is not
// saved.
import { Edit } from '@carbon/icons-react';
import { IconButton, TextInput } from '@carbon/react';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';

interface EditableCellProps {
  value: unknown;
  /** Accessible name of the edit button and the field. */
  label: string;
  size: 'sm' | 'md' | 'lg';
  onSave: (value: string | number) => void;
  children: ReactNode;
}

export function EditableCell({
  value,
  label,
  size,
  onSave,
  children,
}: EditableCellProps) {
  const id = useId();
  const [editing, setEditing] = useState(false);
  // Set by Enter and Escape: the field closes and focus goes back.
  const refocus = useRef(false);
  const closing = useRef(false);
  const button = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!editing && refocus.current) {
      refocus.current = false;
      button.current?.focus();
    }
  }, [editing]);
  const numeric = typeof value === 'number';

  /** Saves a valid, changed value; returns false when the value is invalid. */
  const save = (text: string) => {
    const next = numeric ? Number(text) : text;
    if (numeric && (text.trim() === '' || Number.isNaN(next))) return false;
    if (next !== value) onSave(next);
    return true;
  };

  if (editing)
    return (
      <TextInput
        id={id}
        size={size}
        labelText={label}
        hideLabel
        type={numeric ? 'number' : 'text'}
        defaultValue={String(value ?? '')}
        autoFocus
        onBlur={(event) => {
          if (closing.current) return;
          // Leaving an invalid number cancels the edit.
          save(event.currentTarget.value);
          setEditing(false);
        }}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            // Without this, the key's click lands on the edit button that
            // takes focus back, and the field opens again.
            event.preventDefault();
            if (!save(event.currentTarget.value)) return;
          } else if (event.key === 'Escape') {
            event.preventDefault();
          } else return;
          closing.current = true;
          refocus.current = true;
          setEditing(false);
        }}
      />
    );

  return (
    <div className="afframe-data-grid__editable">
      <span>{children}</span>
      <IconButton
        ref={button}
        kind="ghost"
        size="sm"
        label={label}
        onClick={() => {
          closing.current = false;
          setEditing(true);
        }}>
        <Edit />
      </IconButton>
    </div>
  );
}
