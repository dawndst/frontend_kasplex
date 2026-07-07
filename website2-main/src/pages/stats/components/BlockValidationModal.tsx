import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle2 } from "lucide-react";

type SelectedBlock = {
  number: number | string;
  input: string;
  proof: string;
  quote: string;
  daa_score?: number | string;
  anchor_hash?: string;
};

interface ValidationData {
  key: string;
  label: string;
  icon: React.ReactNode;
  status: "OK" | "FAIL";
  detail: string;
}

interface BlockValidationModalProps {
  open: boolean;
  closeModal: () => void;
  selectedBlock: SelectedBlock | null;
  validation: unknown;
  validationDescriptions: ValidationData[];
}

const SectionHead: React.FC<{ title: string }> = ({ title }) => (
  <div className="flex items-center gap-2.5">
    <span className="w-1 h-4 rounded-full bg-primary" />
    <span className="font-headline font-semibold text-sm text-secondary uppercase tracking-wider">
      {title}
    </span>
  </div>
);

const BlockValidationModal: React.FC<BlockValidationModalProps> = ({
  open,
  selectedBlock,
  validation,
  validationDescriptions,
  closeModal,
}) => {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.18 }}
            className="glass-card glow-cyan rounded-2xl w-full max-w-[660px] shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between gap-4 px-5 sm:px-6 py-4 border-b border-outline-variant/40 bg-surface-container-low/40">
              <h4 className="font-headline font-bold text-base sm:text-lg text-[#e2e2e2] tracking-tight">
                {selectedBlock
                  ? `Block #${selectedBlock.number} Validation`
                  : "Block Validation"}
              </h4>
              <button
                type="button"
                aria-label="Close"
                onClick={closeModal}
                className="p-2 rounded-lg text-outline hover:text-[#e2e2e2] hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="px-5 sm:px-6 py-5 space-y-6 max-h-[65vh] overflow-y-auto custom-scrollbar">
              {selectedBlock && validation ? (
                <>
                  <section className="space-y-3">
                    <SectionHead title="Basic Information" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="rounded-xl border border-outline-variant/40 bg-surface-container-low/60 px-4 py-3 space-y-1">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-outline">
                          Block Number
                        </p>
                        <p className="font-mono text-base text-primary break-all">
                          {selectedBlock.number}
                        </p>
                      </div>
                      <div className="rounded-xl border border-outline-variant/40 bg-surface-container-low/60 px-4 py-3 space-y-1">
                        <p className="font-mono text-[10px] uppercase tracking-wider text-outline">
                          DaaScore
                        </p>
                        <p className="font-mono text-base text-[#e2e2e2] break-all">
                          {selectedBlock.daa_score || "--"}
                        </p>
                      </div>
                    </div>
                  </section>

                  <section className="space-y-3">
                    <SectionHead title="Hex Data Validations" />
                    <div className="rounded-xl border border-outline-variant/40 bg-surface-container-low/40 divide-y divide-outline-variant/30">
                      {validationDescriptions.length > 0 &&
                        validationDescriptions.map((item) => (
                          <div
                            key={item.key}
                            className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-primary shrink-0 flex items-center">
                                {item.icon}
                              </span>
                              <span className="font-mono text-xs text-[#e2e2e2] truncate">
                                {item.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-3 shrink-0">
                              {item.detail && (
                                <span className="font-mono text-[10px] text-primary-fixed bg-secondary-container/30 border border-primary/15 px-2 py-0.5 rounded">
                                  {item.detail}
                                </span>
                              )}
                              <span
                                className={`flex items-center gap-1 font-mono text-[11px] font-semibold ${
                                  item.status === "OK"
                                    ? "text-[#52c41a]"
                                    : "text-error-red"
                                }`}
                              >
                                <CheckCircle2 size={13} />
                                <span>{item.status}</span>
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </section>
                </>
              ) : (
                <div className="space-y-3 animate-pulse py-2">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-3.5 rounded bg-surface-container-high ${
                        i % 3 === 2 ? "w-2/3" : "w-full"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end px-5 sm:px-6 py-4 border-t border-outline-variant/40 bg-surface-container-low/40">
              <button
                type="button"
                onClick={closeModal}
                className="px-6 py-2.5 bg-surface-container hover:bg-surface-container-high border border-outline-variant hover:border-outline text-[#e2e2e2] font-headline font-semibold text-xs tracking-wider uppercase rounded-xl transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BlockValidationModal;
