import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import {
  ArrowLeftOutlined, ArrowRightOutlined, InfoCircleOutlined, SearchOutlined,
  CheckCircleFilled,
  CodeOutlined,
  DatabaseOutlined,
  SafetyCertificateOutlined,
  LinkOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Input, Row, Segmented, Tag, Typography, Tooltip, message, Empty, Skeleton } from 'antd';
import { useNavigate } from "react-router-dom";
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

const { Text, Title } = Typography;

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
  const navigate = useNavigate();
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
  const goUrl = useCallback((url: string) => navigate(url), [navigate]);
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
        message.error("Failed to load blocks");
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
      message.warning("Please input a valid block number");
      return;
    }
    updateUI('searchModel', true);
    await loadBlocks({ start: n, number: 1 }, "search");
  }, [searchBlock, loadBlocks]);

  const getValidationIcon = (key: string) => {
    switch (key) {
      case "block.number":
        return <CodeOutlined />;
      case "block.input(hex)":
        return <DatabaseOutlined />;
      case "block.proof(hex)":
        return <SafetyCertificateOutlined />;
      case "block.quote(hex)":
        return <CodeOutlined />;
      case "block.anchor_hash":
        return <LinkOutlined />;
      case "kaspa_consensus":
        return <CheckCircleFilled style={{ color: "#52c41a" }} />;
      default:
        return <InfoCircleOutlined style={{ color: "#018382" }} />;
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
    <div className="stats-page">
      <section className="stats-page__hero">
        <div>
          <Title level={1} className="stats-page__title">
            Kasplex stats
          </Title>
        </div>

        <Tag className="stats-page__live-tag">
          <span className="stats-page__live-dot" />
          Live Network Feed
        </Tag>
      </section>
      <section className="stats-page__section">
        <Row gutter={[16, 16]}>
          {uiState.statsLoading ? Array.from({ length: 16 }).map((_, index) => (
            <Col xs={24} sm={12} lg={6} key={`skeleton-${index}`}>
              <Card className="stats-card stats-card--skeleton">
                <div className="stats-card__meta">
                  <Skeleton.Button
                    active
                    size="small"
                    shape="square"
                    className="stats-card__skeleton-label"
                  />
                  <InfoCircleOutlined className="stats-card__icon is-skeleton" />
                </div>

                <div className="stats-card__value">
                  <Skeleton.Button
                    active
                    size="small"
                    shape="square"
                    className="stats-card__skeleton-value"
                  />
                </div>
              </Card>
            </Col>
          )) : statsInfo?.map((item) => (
            <Col xs={24} sm={12} lg={6} key={item.id}>
              <Card className="stats-card">
                <div className="stats-card__meta">
                  <Text className="stats-card__label">{item.title}</Text>
                  <Tooltip title={item.description} color="#018382">
                    <InfoCircleOutlined className="stats-card__icon" />
                  </Tooltip>
                </div>
                <div className="stats-card__value">
                  {formatNumber(item.value, 3)}
                  {item.units}
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </section>
      <section className="stats-page__section">
        <Row gutter={[24, 24]}>
          <Col xs={24} lg={16}>
            <div className="stats-section-title">
              <SearchOutlined color="#a1faff" />
              <span>Search Blocks</span>
            </div>
            <div className="stats-search-box">
              <Input
                size="large"
                value={searchBlock}
                onChange={(e) => setSearchBlock(e.target.value)}
                placeholder="Search Block Number"
                className="stats-search-box__input"
              />
              <Button type="primary" onClick={handleSearch} disabled={uiState.blockLoading} icon={<ArrowRightOutlined style={{ fontSize: '16px' }} />} className="stats-search-box__btn" />
            </div>
          </Col>
          <Col xs={24} lg={8}>
            <div className="stats-section-title">Network Nodes</div>
            <Segmented
              block
              value={network}
              options={[
                {
                  label: <div>
                    <img className='radio-check' src={network === 'TEE' ? RadioCheck2 : Radio2} alt="TEE" />
                    <div>TEE Network</div>
                  </div>,
                  value: 'TEE'
                },
                {
                  label: <div >
                    <img className='radio-check' src={network === 'ZK' ? RadioCheck2 : Radio2} alt="ZK" />
                    <div>ZK Network</div>
                  </div>,
                  value: 'ZK'
                },
              ]}
              className="stats-network-switch"
            />
          </Col>
        </Row>
      </section>
      <section className="stats-page__section">
        <div className="stats-page__section-head">
          <Title level={2} className="stats-page__section-title">
            Block Registry
          </Title>
        </div>
        <Row gutter={[16, 16]}>
          {uiState.blockLoading ? (
            Array.from({ length: 8 }).map((_, index) => (
              <Col xs={24} sm={12} lg={6} key={`block-skeleton-${index}`}>
                <Card className={index % 2 === 0 ? "block-card block-card--zk block-card--skeleton" : "block-card block-card--skeleton"}>
                  <div className="block-card__icon-wrap">
                    <Skeleton.Avatar
                      active
                      size={40}
                      shape="square"
                      className="block-card__skeleton-icon"
                    />
                  </div>
                  <div className="block-card__id">
                    <Skeleton.Button
                      active
                      size="small"
                      shape="square"
                      className="block-card__skeleton-id"
                    />
                  </div>
                  <div className="block-card__hash">
                    <Skeleton.Button
                      active
                      size="small"
                      shape="square"
                      className="block-card__skeleton-hash"
                    />
                  </div>
                  <div className="block-card__stats">
                    <div>
                      <div className="block-card__stats-value">
                        <Skeleton.Button
                          active
                          size="small"
                          shape="square"
                          className="block-card__skeleton-stat"
                        />
                      </div>
                      <div className="block-card__stats-label">TXNS</div>
                    </div>

                    <div>
                      <div className="block-card__stats-value">
                        <Skeleton.Button
                          active
                          size="small"
                          shape="square"
                          className="block-card__skeleton-stat"
                        />
                      </div>
                      <div className="block-card__stats-label">AGO</div>
                    </div>
                  </div>

                  <div className="block-card__network">
                    <Skeleton.Button
                      active
                      size="small"
                      shape="square"
                      className="block-card__skeleton-network"
                    />
                  </div>
                </Card>
              </Col>
            ))
          ) : showEmpty ? (
            <Col span={24}>
              <div style={{ padding: "24px 0", width: "100%", margin: "40px auto" }}>
                <Empty description={<span style={{ color: "#fff" }}>No Data</span>} />
              </div>
            </Col>
          ) : (
            (blockData ?? []).map((item, index) => {
              return (
                <Col xs={24} sm={12} lg={6} key={item.number} onClick={() => openBlockModal(item)}>
                  <Card className={index % 2 === 0 ? "block-card block-card--zk" : "block-card"}>
                    <div className="block-card__icon-wrap">
                      <img className="block-card__icon" src={LayersIcon1} alt="" />
                    </div>
                    <div className="block-card__id">{item.number}</div>
                    <div className="block-card__hash">{shortenString(item.anchor_hash, 2, 6)}</div>
                    <div className="block-card__stats">
                      <div>
                        <div className="block-card__stats-value">{item.transactionsCount}</div>
                        <div className="block-card__stats-label">TXNS</div>
                      </div>
                      <div>
                        <div className="block-card__stats-value">{item.ago || "—"}</div>
                        <div className="block-card__stats-label">AGO</div>
                      </div>
                    </div>
                    <div className="block-card__network">{network} Network</div>
                  </Card>
                </Col>
              );
            })
          )}
        </Row>
        {
          blockData && blockData.length > 0 && (
            <div className="stats-pagination">
              <Button
                onClick={() => pageChange("prev")}
                disabled={isPrevDisabled || uiState.blockLoading}
                icon={<ArrowLeftOutlined />}
                className="stats-pagination__btn stats-pagination__btn-prev"
              >
                PREVIOUS
              </Button>
              <Button
                onClick={() => pageChange("next")}
                disabled={isNextDisabled || uiState.blockLoading}
                icon={<ArrowRightOutlined />}
                iconPlacement="end"
                className="stats-pagination__btn stats-pagination__btn-next"
              >
                NEXT
              </Button>
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
        goUrl={goUrl}
      />
    </div>
  );
};

export default StatsPage;
