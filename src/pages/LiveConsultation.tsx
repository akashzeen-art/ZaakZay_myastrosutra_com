import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Layout from "@/components/Layout";
import PanditGrid, { type RosterItem } from "@/components/consultation/PanditGrid";
import ConsultationModal from "@/components/consultation/ConsultationModal";
import { Phone, ArrowLeft } from "lucide-react";

const LiveConsultation = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<RosterItem | null>(null);

  const openCall = (pandit: RosterItem) => {
    if (pandit.status !== "available") return;
    setSelected(pandit);
    setShowModal(true);
  };

  return (
    <Layout noMobileFabPad>
      <div className="sutra-page pb-12">
        <div className="mb-6 flex items-center justify-between gap-3">
          <Link
            to="/"
            className="inline-flex items-center gap-2 sutra-link text-sm group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Home
          </Link>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/25 bg-green-500/10 px-2.5 py-1 text-[11px] font-medium text-green-300">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-400" />
            </span>
            Live now
          </span>
        </div>

        <header className="mb-8 max-w-3xl">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-teal-300/80">
            Guru Darshan
          </p>
          <h1 className="font-display text-3xl sm:text-4xl md:text-[2.75rem] font-bold leading-[1.1] text-amber-50">
            Connect with a{" "}
            <span className="sutra-text">verified Guru</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm sm:text-base leading-relaxed text-orange-100/55">
            See who is free right now. Green = ready for a private 12-minute
            voice session on kundli, muhurat, remedies, marriage & career.
          </p>
        </header>

        <PanditGrid onCall={openCall} />

        <ConsultationModal
          open={showModal}
          pandit={selected}
          onClose={() => setShowModal(false)}
          onProceed={() => {
            if (selected) {
              localStorage.setItem(
                "selected_pandit",
                JSON.stringify({
                  id: selected.id,
                  name: selected.name,
                  title: selected.title,
                  image: selected.image,
                  specialty: selected.specialty,
                }),
              );
            }
            setShowModal(false);
            navigate("/consultation");
          }}
        />
      </div>
    </Layout>
  );
};

export default LiveConsultation;
