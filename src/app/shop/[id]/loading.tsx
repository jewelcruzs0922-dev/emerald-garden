export default function ProductLoading() {
  return (
    <main id="main" aria-busy="true" aria-label="Loading product">
      <section className="page-head">
        <div className="wrap">
          <div className="page-head__grid">
            <div>
              <div className="skeleton skeleton--text" style={{ width: "14ch", height: "1rem" }} />
              <div className="skeleton skeleton--heading" style={{ marginTop: ".8rem", width: "22ch" }} />
            </div>
          </div>
        </div>
      </section>

      <section className="section section--flush-top">
        <div className="wrap">
          <div className="pdp-skeleton">
            <div className="skeleton skeleton--img" style={{ aspectRatio: "4 / 5" }} />
            <div>
              <div className="skeleton skeleton--text" style={{ width: "40%", height: ".8rem" }} />
              <div className="skeleton skeleton--heading" style={{ marginTop: ".6rem", width: "70%" }} />
              <div className="skeleton skeleton--text" style={{ marginTop: "1rem", width: "25%", height: "1.5rem" }} />
              <div className="skeleton skeleton--text" style={{ marginTop: "1.2rem", width: "100%", height: "3rem" }} />
              <div className="skeleton skeleton--text" style={{ marginTop: ".8rem", width: "80%", height: "4rem" }} />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
