import { MONTHS } from "../constants";

interface Props {
  year: number;
  month: number;
  readOnly: boolean;
  onPrev: () => void;
  onNext: () => void;
  //onExport: () => void;
}

export function Header({ year, month, readOnly, onPrev, onNext }: Props) {
  return (
    <>
      <div className="header">
        <div className="header-left">
          <h1>График работы</h1>
          <p>{readOnly ? "Актуальный график" : "Нажмите на ячейку, чтобы переключить смену"}</p>
        </div>
        <div className="header-right">
          <div className="month-nav">
            <button className="nav-btn" onClick={onPrev} aria-label="Предыдущий месяц">
              &#8592;
            </button>
            <span className="month-label">
              {MONTHS[month]} {year}
            </span>
            <button className="nav-btn" onClick={onNext} aria-label="Следующий месяц">
              &#8594;
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
