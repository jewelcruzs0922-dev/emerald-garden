export default function CheckoutLoading() {
  return (
    <main id="main" aria-busy="true" aria-label="Loading checkout">
      <section className="page-head">
        <div className="wrap">
          <div className="page-head__grid">
            <div>
              <div className="skeleton skeleton--heading" style={{ width: "18ch" }} />
              <div
                className="skeleton skeleton--text"
                style={{ marginTop: ".6rem", maxWidth: "36ch" }}
              />
            </div>
          </div>
        </div>
      </section>

      <section className="section section--flush-top">
        <div className="wrap">
          <div className="checkout-skeleton">
            <div>
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} style={{ marginBottom: "1rem" }}>
                  <div
                    className="skeleton skeleton--text"
                    style={{ width: "30%", height: ".7rem" }}
                  />
                  <div
                    className="skeleton skeleton--text"
                    style={{ marginTop: ".4rem", width: "100%", height: "2.5rem" }}
                  />
                </div>
              ))}
            </div>
            <div>
              <div
                className="skeleton skeleton--text"
                style={{ width: "50%", height: "1rem" }}
              />
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="skeleton-card" style={{ marginTop: ".8rem" }}>
                  <div
                    className="skeleton skeleton--img"
                    style={{ width: 56, height: 56 }}
                  />
                  <div
                    className="skeleton skeleton--text"
                    style={{ flex: 1, height: ".8rem" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
