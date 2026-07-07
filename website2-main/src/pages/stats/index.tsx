import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Search,
  Info,
  Code,
  Database,
  ShieldCheck,
  Link2,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
} from 'lucide-react';
import BlockValidationModal from '@/pages/stats/components/BlockValidationModal';
import { getStats, getSgxInfo, getBlocks, getTransactionCountByBlock } from "@/api/api";
import type {
  KasplexStatsItem,
  BlockParams,
  BlocksApiResponse,
  DecoratedBlock,
  BlockValidation,
  ValidationData,
} from "@/types/type";
import { computeDecoratedBlocks, formatNumber, shortenString, getAgo, validateBlock } from "@/utils/utils";
import { pageSize } from "@/utils/constants";

import LayersIcon1 from '@/assets/stats/icon-layers-1.svg'
import Radio2 from '@/assets/stats/icon-radio-2.svg'
import RadioCheck2 from '@/assets/stats/icon-radio-check2.svg'

type ToastType = 'error' | 'warning';

interface ToastState {
  type: ToastType;
  msg: string;
}

function useDebouncedCallback<TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  delayMs: number
) {
  const timerRef = useRef<number | null>(null);
  const callback = useCallback((...args: TArgs) => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      fn(...args);
      timerRef.current = null;
    }, delayMs);
  }, [fn, delayMs]);

  useEffect(() => {
    return () => {
      if (timerRef.current != null) window.clearTimeout(timerRef.current);
    };
  }, []);
  return callback;
}

const StatsPage: React.FC = () => {
  const [cursorStack, setCursorStack] = useState<number[]>([]);
  const [uiState, setUiState] = useState({
    statsLoading: true,
    blockLoading: true,
    searchModel: false,
    modalOpen: false,
  });

  const lastRequestKeyRef = useRef<string>("");
  const requestIdRef = useRef(0);
  const [searchBlock, setSearchBlock] = useState<string>("");
  const [blockParams, setBlockParams] = useState<BlockParams>({ start: 0, number: 24 });
  const [blockData, setBlockData] = useState<DecoratedBlock[] | undefined>(undefined);
  const [statsInfo, setStatsInfo] = useState<KasplexStatsItem[] | undefined>(undefined);
  const [selectedBlock, setSelectedBlock] = useState<DecoratedBlock | null>(null);
  const [validation, setValidation] = useState<BlockValidation | null>(null);

  const [network] = useState<'TEE' | 'ZK'>('TEE');
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const openMsg = useCallback((type: ToastType, msg: string) => {
    if (toastTimerRef.current != null) {
      window.clearTimeout(toastTimerRef.current);
    }
    setToast({ type, msg });
    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 3000);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current != null) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  const updateUI = useCallback((key: keyof typeof uiState, value: boolean) => {
    setUiState((prev) => ({ ...prev, [key]: value }));
  }, []);
  const loadBlocks = useCallback(async (params: BlockParams, mode: "list" | "search") => {
      const requestKey = JSON.stringify({ params, mode, cursorDepth: cursorStack.length });
      if (lastRequestKeyRef.current === requestKey) return;
      lastRequestKeyRef.current = requestKey;
      const reqId = ++requestIdRef.current;
      updateUI('blockLoading', true);
      try {
        const [resp] = await Promise.all([
          getSgxInfo(params) as Promise<BlocksApiResponse>,
          getBlocks(),
        ]);
        if (reqId !== requestIdRef.current) return;
        if (resp.errcode === 0 && Array.isArray(resp.blocks)) {
          const decorated = computeDecoratedBlocks(resp.blocks);
          setBlockData(decorated);
          decorated.forEach(async (item) => {
            try {
              const res = await getTransactionCountByBlock(item.number);
              if (reqId !== requestIdRef.current) return;
              setBlockData((prev) => prev && prev.map((b) => b.number === item.number ? {
                ...b,
                transactionsCount: res.transactions_count,
                ago: getAgo(res.timestamp) || "-"
              } : b));
            } catch (e) {
              console.error("load txCount error", e);
            }
          });
        } else {
          setBlockData([]);
        }
      } catch {
        if (reqId !== requestIdRef.current) return;
        setBlockData([]);
        openMsg('error', "Failed to load blocks");
      } finally {
        if (reqId === requestIdRef.current) {
          updateUI('blockLoading', false);
        }
      }
    }, [cursorStack.length]);

  const closeModal = () => {
    updateUI('modalOpen', false);
    setSelectedBlock(null);
    setValidation(null);
  };

  const handleSearch = useCallback(async () => {
    const v = searchBlock.trim();
    if (!v) return;
    const n = Number(v) + 1;
    if (!Number.isFinite(n) || Number.isNaN(n)) {
      openMsg('warning', "Please input a valid block number");
      return;
    }
    updateUI('searchModel', true);
    await loadBlocks({ start: n, number: 1 }, "search");
  }, [searchBlock, loadBlocks]);

  const getValidationIcon = (key: string) => {
    switch (key) {
      case "block.number":
        return <Code size={15} />;
      case "block.input(hex)":
        return <Database size={15} />;
      case "block.proof(hex)":
        return <ShieldCheck size={15} />;
      case "block.quote(hex)":
        return <Code size={15} />;
      case "block.anchor_hash":
        return <Link2 size={15} />;
      case "kaspa_consensus":
        return <CheckCircle2 size={15} style={{ color: "#52c41a" }} />;
      default:
        return <Info size={15} className="text-primary" />;
    }
  }

  const validationDescriptions: ValidationData[] = useMemo(() => {
    if (!validation) return [];
    return validation.items.map((it) => ({
      key: it.label,
      label: it.label,
      icon: getValidationIcon(it.label),
      status: it.ok ? "OK" : "FAIL",
      detail: it.detail ?? "",
    }));
  }, [validation]);

  const pageChange = (type: "next" | "prev") => {
    if (uiState.searchModel) return;
    const nextParams: BlockParams = { start: blockParams.start, number: pageSize };
    if (type === "next") {
      if (!blockData?.length) {
        return;
      }
      const last = blockData[blockData.length - 1].number;
      nextParams.start = last;
      setCursorStack((prev) => [...prev, blockParams.start]);
    } else {
      const prevStart = cursorStack[cursorStack.length - 1];
      if (prevStart == null) return;
      nextParams.start = prevStart;
      setCursorStack((prev) => prev.slice(0, -1));
    }
    setBlockParams(nextParams);
    loadListDebounced(nextParams);
  };

  const openBlockModal = (item: DecoratedBlock) => {
    setSelectedBlock(item);
    setValidation(validateBlock(item));
    updateUI('modalOpen', true);
  };

  const loadListDebounced = useDebouncedCallback((params: BlockParams) => {
    void loadBlocks(params, "list");
  }, 300);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        updateUI('statsLoading', true);
        updateUI('blockLoading', true);
        const stats = await getStats();
        if (!cancelled && stats?.counters) {
          setStatsInfo(stats.counters as KasplexStatsItem[]);
          updateUI('statsLoading', false);
        }
        if (!cancelled) {
          await loadBlocks(blockParams, "list");
        }
      } finally {
        if (!cancelled) {
          updateUI('statsLoading', false);
          updateUI('blockLoading', false);
        }
      }
    };
    void load();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (searchBlock.trim() === "" && uiState.searchModel) {
      updateUI('searchModel', false);
      loadListDebounced(blockParams);
    }
  }, [searchBlock, uiState.searchModel, blockParams]);

  const showEmpty = !uiState.blockLoading && (blockData?.length ?? 0) === 0;
  const isPrevDisabled = cursorStack.length === 0;
  const isNextDisabled = !blockData || blockData.length === 0

  return (
    <div className="space-y-8">
      {/* Toast / banner */}
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[60] w-[calc(100%-2rem)] max-w-md">
          <div
            className={`glass-card rounded-xl px-4 py-3 flex items-center gap-3 shadow-xl ${
              toast.type === 'warning'
                ? 'border-warning-amber/40 shadow-warning-amber/10'
                : 'border-error-red/40 shadow-error-red/10'
            }`}
            role="alert"
          >
            {toast.type === 'warning' ? (
              <AlertTriangle size={18} className="text-warning-amber shrink-0" />
            ) : (
              <AlertCircle size={18} className="text-error-red shrink-0" />
            )}
            <p className={`text-sm leading-snug ${toast.type === 'warning' ? 'text-warning-amber' : 'text-error-red'}`}>
              {toast.msg}
            </p>
          </div>
        </div>
      )}

      {/* ------------------ Hero: title + live tag ------------------ */}
      <section className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-headline font-black text-3xl sm:text-4xl text-[#e2e2e2] tracking-tight">
          Kasplex stats
        </h1>
        <span className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-secondary-container/30 px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-wider text-primary-fixed">
          <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          Live Network Feed
        </span>
      </section>

      {/* ------------------ Stat cards ------------------ */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {uiState.statsLoading ? Array.from({ length: 16 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="glass-card rounded-2xl p-5 animate-pulse">
              <div className="flex items-center justify-between gap-3">
                <div className="h-3 w-28 rounded bg-surface-container-high" />
                <Info size={14} className="text-outline/40 shrink-0" />
              </div>
              <div className="mt-4 h-7 w-32 rounded bg-surface-container-high" />
            </div>
          )) : statsInfo?.map((item) => (
            <div key={item.id} className="glass-card rounded-2xl p-5 hover:border-primary/40 transition-colors">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[11px] uppercase tracking-wider text-outline leading-snug">
                  {item.title}
                </span>
                <span className="relative group shrink-0">
                  <Info size={14} className="text-outline group-hover:text-primary transition-colors cursor-help" />
                  <span className="pointer-events-none absolute bottom-full right-[-6px] mb-2 w-60 glass-card rounded-lg px-3 py-2.5 text-xs text-[#e2e2e2] leading-relaxed normal-case tracking-normal font-sans opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-30 shadow-2xl border-primary/25">
                    {item.description}
                  </span>
                </span>
              </div>
              <div className="mt-3 font-headline font-bold text-2xl text-primary tracking-tight">
                {formatNumber(item.value, 3)}
                {item.units}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ------------------ Search Blocks + Network Nodes ------------------ */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center gap-2">
            <Search size={16} className="text-primary" />
            <span className="font-headline font-semibold text-sm text-[#e2e2e2]">Search Blocks</span>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              value={searchBlock}
              onChange={(e) => setSearchBlock(e.target.value)}
              placeholder="Search Block Number"
              className="flex-1 min-w-0 bg-surface-container border border-outline-variant rounded-xl px-4 py-3 text-sm font-mono text-[#e2e2e2] placeholder:text-outline/70 outline-none focus:border-primary transition-colors"
            />
            <button
              type="button"
              onClick={handleSearch}
              disabled={uiState.blockLoading}
              aria-label="Search"
              className="px-4 bg-primary text-background hover:bg-secondary rounded-xl flex items-center justify-center transition-all shadow-xl shadow-primary/15 active:scale-[0.98] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="space-y-3">
          <div className="font-headline font-semibold text-sm text-[#e2e2e2]">Network Nodes</div>
          <div className="glass-card rounded-xl p-1 grid grid-cols-2 gap-1">
            <button
              type="button"
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                network === 'TEE'
                  ? 'bg-secondary-container/40 border border-primary/30 text-primary'
                  : 'border border-transparent text-outline'
              }`}
            >
              <img className="w-4 h-4" src={network === 'TEE' ? RadioCheck2 : Radio2} alt="TEE" />
              <span>TEE Network</span>
            </button>
            <button
              type="button"
              className={`flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${
                network === 'ZK'
                  ? 'bg-secondary-container/40 border border-primary/30 text-primary'
                  : 'border border-transparent text-outline'
              }`}
            >
              <img className="w-4 h-4" src={network === 'ZK' ? RadioCheck2 : Radio2} alt="ZK" />
              <span>ZK Network</span>
            </button>
          </div>
        </div>
      </section>

      {/* ------------------ Block Registry ------------------ */}
      <section className="space-y-5">
        <h2 className="font-headline font-bold text-2xl text-[#e2e2e2] tracking-tight">
          Block Registry
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {uiState.blockLoading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <div
                key={`block-skeleton-${index}`}
                className={`glass-card rounded-2xl p-5 flex flex-col items-center gap-3 animate-pulse ${
                  index % 2 === 0 ? 'border-primary/20' : ''
                }`}
              >
                <div className="w-11 h-11 rounded-xl bg-surface-container-high" />
                <div className="h-4 w-24 rounded bg-surface-container-high" />
                <div className="h-3 w-28 rounded bg-surface-container-high" />
                <div className="w-full grid grid-cols-2 gap-3 pt-1">
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="h-3.5 w-10 rounded bg-surface-container-high" />
                    <div className="font-mono text-[10px] uppercase tracking-wider text-outline/60">TXNS</div>
                  </div>
                  <div className="flex flex-col items-center gap-1.5">
                    <div className="h-3.5 w-12 rounded bg-surface-container-high" />
                    <div className="font-mono text-[10px] uppercase tracking-wider text-outline/60">AGO</div>
                  </div>
                </div>
                <div className="w-full border-t border-outline-variant/40 pt-3 flex justify-center">
                  <div className="h-3 w-20 rounded bg-surface-container-high" />
                </div>
              </div>
            ))
          ) : showEmpty ? (
            <div className="col-span-full py-16 text-center">
              <p className="text-sm text-[#fff]">No Data</p>
            </div>
          ) : (
            (blockData ?? []).map((item, index) => {
              const isAccent = index % 2 === 0;
              return (
                <div
                  key={item.number}
                  onClick={() => openBlockModal(item)}
                  className={`glass-card rounded-2xl p-5 flex flex-col items-center gap-2.5 cursor-pointer transition-all hover:-translate-y-0.5 hover:border-primary/50 ${
                    isAccent ? 'border-primary/25' : ''
                  }`}
                >
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
                      isAccent
                        ? 'bg-primary/10 border-primary/25'
                        : 'bg-surface-container border-outline-variant/50'
                    }`}
                  >
                    <img className="w-6 h-6 object-contain" src={LayersIcon1} alt="" />
                  </div>
                  <div className="font-headline font-bold text-lg text-[#e2e2e2] tracking-tight">
                    {item.number}
                  </div>
                  <div className="font-mono text-xs text-outline">
                    {shortenString(item.anchor_hash, 2, 6)}
                  </div>
                  <div className="w-full grid grid-cols-2 gap-3 pt-1">
                    <div className="text-center">
                      <div className="font-mono text-sm text-[#e2e2e2]">{item.transactionsCount}</div>
                      <div className="font-mono text-[10px] uppercase tracking-wider text-outline">TXNS</div>
                    </div>
                    <div className="text-center">
                      <div className="font-mono text-sm text-[#e2e2e2]">{item.ago || "—"}</div>
                      <div className="font-mono text-[10px] uppercase tracking-wider text-outline">AGO</div>
                    </div>
                  </div>
                  <div
                    className={`w-full border-t border-outline-variant/40 pt-3 text-center font-mono text-[10px] uppercase tracking-wider ${
                      isAccent ? 'text-primary-fixed' : 'text-outline'
                    }`}
                  >
                    {network} Network
                  </div>
                </div>
              );
            })
          )}
        </div>
        {
          blockData && blockData.length > 0 && (
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => pageChange("prev")}
                disabled={isPrevDisabled || uiState.blockLoading}
                className="px-5 py-2.5 bg-surface-container hover:bg-surface-container-high border border-outline-variant hover:border-outline text-[#e2e2e2] font-headline font-semibold text-xs tracking-wider uppercase rounded-xl flex items-center gap-2 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <ArrowLeft size={14} />
                PREVIOUS
              </button>
              <button
                type="button"
                onClick={() => pageChange("next")}
                disabled={isNextDisabled || uiState.blockLoading}
                className="px-5 py-2.5 bg-primary text-background hover:bg-secondary font-headline font-semibold text-xs tracking-wider uppercase rounded-xl flex items-center gap-2 transition-all shadow-xl shadow-primary/15 active:scale-[0.98] cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                NEXT
                <ArrowRight size={14} />
              </button>
            </div>
          )
        }
      </section>

      <BlockValidationModal
        open={uiState.modalOpen}
        closeModal={closeModal}
        selectedBlock={selectedBlock}
        validation={validation}
        validationDescriptions={validationDescriptions}
      />
    </div>
  );
};

export default StatsPage;
