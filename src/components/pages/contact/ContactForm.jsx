import Form from "./Form";

const ContactForm = () => {
  return (
    <section className="relative py-16 sm:py-20 bg-slate-50 overflow-hidden">
      {/* sub-grid background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(220,38,38,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(220,38,38,.04) 1px,transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
        {/* Section header */}
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-50 border border-red-100 text-red-600 text-[11px] font-semibold tracking-wide uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            Send a Message
          </span>
          <h2
            className="font-black text-slate-900 mt-4 mb-3 leading-none"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: "clamp(28px,5vw,50px)",
            }}
          >
            FILL OUT THE <span className="text-red-600">FORM</span>
          </h2>
          <p className="text-slate-500 text-[14px] max-w-sm mx-auto leading-relaxed">
            Fill out the form or find us on the map to get in touch.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ── FORM CARD ── */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-100/80 overflow-hidden">
              {/* Top gradient bar */}
              <div className="h-1 w-full bg-linear-to-r from-red-600 via-red-500 to-amber-500" />

              <Form />
            </div>
          </div>

          {/* ── MAP ── */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-100/80 overflow-hidden h-full min-h-125">
              <div className="h-1 w-full bg-linear-to-r from-red-600 via-red-500 to-amber-500" />
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d5795.795980198256!2d3.708454!3d43.420958!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12b1357c2efa6fbb%3A0xddfc93666aef9f37!2s8%20Rue%20de%20Dublin%2C%2034200%20S%C3%A8te%2C%20France!5e0!3m2!1sen!2sbd!4v1723619506631!5m2!1sen!2sbd"
                width="100%"
                height="100%"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="min-h-125"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
