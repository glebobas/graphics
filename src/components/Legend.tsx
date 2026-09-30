export function Legend() {
  return (
    <div className="legend">
      <div className="leg-pill day">
        <div className="leg-dot" />
        Дневная
      </div>
      <div className="leg-pill eve">
        <div className="leg-dot" />
        Вечерняя
      </div>
      <div className="leg-pill off">
        <div className="leg-dot" />
        Выходной
      </div>
      <div className="leg-pill warn">
        <div className="leg-dot" />
        Короткий отдых — вечер → утро
      </div>
    </div>
  );
}
