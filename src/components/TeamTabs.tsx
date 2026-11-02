import { TEAMS, TEAM_KEYS, type Team } from "../constants";

interface Props {
  value: Team;
  /** Команда текущего пользователя — помечается точкой */
  own: Team | null;
  onChange: (team: Team) => void;
}

export function TeamTabs({ value, own, onChange }: Props) {
  return (
    <div className="tabs" role="tablist">
      {TEAM_KEYS.map((t) => (
        <button
          key={t}
          role="tab"
          aria-selected={t === value}
          className={`tab${t === value ? " active" : ""}`}
          onClick={() => onChange(t)}
        >
          {TEAMS[t].label}
          {t === own && <span className="tab-dot" title="Ваш график" />}
        </button>
      ))}
    </div>
  );
}
