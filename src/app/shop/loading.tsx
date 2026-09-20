export default function ShopLoading() {
  return (
    <main id="main" aria-busy="true" aria-label="Loading shop">
      <section className="page-head">
        <div className="wrap">
          <div className="page-head__grid">
            <div>
              <div
                className="skeleton skeleton--text"
                style={{ width: "8ch", height: "1rem" }}
              />
              <div
                className="skeleton skeleton--heading"
                style={{ marginTop: ".8rem", width: "18ch" }}
              />
              <div
                className="skeleton skeleton--text"
                style={{ marginTop: ".6rem", maxWidth: "42ch" }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section section--flush-top">
        <div className="wrap">
          <div className="skeleton-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton skeleton--img" />
                <div
                  className="skeleton skeleton--text"
                  style={{ width: "60%", height: ".7rem", marginTop: ".8rem" }}
                />
                <div
                  className="skeleton skeleton--text"
                  style={{ width: "80%", height: "1rem", marginTop: ".4rem" }}
                />
                <div
                  className="skeleton skeleton--text"
                  style={{ width: "30%", height: "1rem", marginTop: ".4rem" }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
