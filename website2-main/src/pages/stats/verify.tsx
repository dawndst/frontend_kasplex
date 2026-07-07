import React, { useCallback, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Form,
  Input,
  Radio,
  Button,
  Tag,
  message,
  Card,
  Typography,
  Row,
  Col,
  Space,
} from "antd";
import { ArrowLeftOutlined, CheckCircleFilled } from "@ant-design/icons";

import useResponsive from "@/hooks/useResponsive";
import { ProofData, verifySingleProof } from "@/verifier/index";
import { isHexString, shortenHex, generateDaaScoreRange } from "@/utils/utils";
import { getVspcList } from "@/api/api";
import { calcAnchorHash } from "@/utils/vspcsHash";
import "@/styles/verify.less";

type ProofType = "TEE" | "ZK";

type VerifyFormValues = {
  proof: string;
  input: string;
  quote: string;
  block: string;
  anchorHash: string;
  daaScore: string;
  type: ProofType;
};

type VspcHashItem = {
  daa_score: number;
  hash: string;
};

interface ChainBlock {
  daascore: number;
  hash: string;
}

interface VspcItem {
  chainBlock: ChainBlock;
  txList: unknown[];
}

interface GetVspcResponse {
  message: string;
  result: VspcItem[];
}

const { Title, Paragraph, Text } = Typography;

const proofRules = [
  { required: true as const, message: "Please enter proof" },
  {
    validator: async (_: unknown, v: string) => {
      const value = (v || "").trim();
      if (!value) return;
      if (!isHexString(value) || value.length <= 2) {
        throw new Error("Proof must be a valid hex string (0x...)");
      }
    },
  },
];

const inputRules = [
  { required: true as const, message: "Please enter input" },
  {
    validator: async (_: unknown, v: string) => {
      const value = (v || "").trim();
      if (!value) return;
      if (!isHexString(value) || value.length <= 2) {
        throw new Error("Input must be a valid hex string (0x...)");
      }
    },
  },
];

const quoteRules = [{ required: true as const, message: "Please enter quote value" }];

const blockRules = [
  { required: true as const, message: "Please enter block number" },
  {
    validator: async (_: unknown, v: string) => {
      const s = (v || "").trim();
      if (!s) return;
      const n = Number(s);
      if (!Number.isFinite(n) || n <= 0 || !Number.isInteger(n)) {
        throw new Error("Block must be a positive integer");
      }
    },
  },
];

const daaScoreRules = [
  {
    validator: async (_: unknown, v: string) => {
      const value = (v || "").trim();
      if (!value) return;
      const n = Number(value);
      if (!Number.isFinite(n) || n <= 0) {
        throw new Error("DaaScore must be a positive number");
      }
    },
  },
];

const anchorHashRules = [
  {
    validator: async (_: unknown, v: string) => {
      const value = (v || "").trim();
      if (!value) return;
      if (!isHexString(value)) {
        throw new Error("AnchorHash must be a valid hex string (0x...)");
      }
    },
  },
];

const typeRules = [{ required: true as const, message: "Please choose type" }];

const Verify: React.FC = () => {
  const navigate = useNavigate();
  const { isMobile } = useResponsive();

  const [loading, setLoading] = useState(false);
  const [vspcRangeLoading, setVspcRangeLoading] = useState(false);

  const [verifyOk, setVerifyOk] = useState<boolean | null>(null);
  const [verifyDaaScoreStatus, setVerifyDaaScoreStatus] = useState<boolean | null>(null);
  const [verifyDetail, setVerifyDetail] = useState<string>("");

  const [searchParams] = useSearchParams();
  const initialType = (searchParams.get("type")?.trim() as ProofType) || "TEE";
  const initialProof = (searchParams.get("proof") || "").trim();
  const block = (searchParams.get("block") || "").trim();
  const quote = (searchParams.get("quote") || "").trim();
  const input = (searchParams.get("input") || "").trim();
  const daaScore = (searchParams.get("daa_score") || "").trim();
  const anchorHash = (searchParams.get("anchor_hash") || "").trim();

  const [form] = Form.useForm<VerifyFormValues>();

  const initialValues = useMemo<VerifyFormValues>(
    () => ({
      proof: initialProof,
      quote,
      block,
      input,
      anchorHash,
      daaScore,
      type: initialType,
    }),
    [initialProof, quote, block, input, anchorHash, daaScore, initialType]
  );

  const fetchVspcRangeList = useCallback(async (daa: number): Promise<VspcHashItem[]> => {
    if (!Number.isFinite(daa) || daa <= 0) return [];

    setVspcRangeLoading(true);
    try {
      const daaScoreList = generateDaaScoreRange(daa);
      const results: GetVspcResponse[] = await Promise.all(
        daaScoreList.map((d) => getVspcList(d))
      );

      const formatResults: VspcHashItem[] = results.flatMap((res) => {
        if (!res.result || !res.result.length) return [];
        const { daascore, hash } = res.result[0].chainBlock;
        return [{ daa_score: daascore, hash: `0x${hash}` }];
      });

      return formatResults;
    } catch (err) {
      console.error("fetchVspcRangeList error:", err);
      return [];
    } finally {
      setVspcRangeLoading(false);
    }
  }, []);

  const verifierFun = useCallback(async () => {
    if (loading) return;

    setVerifyDaaScoreStatus(null);
    setVerifyOk(null);
    setVerifyDetail("");
    setLoading(true);

    try {
      const v = await form.validateFields(["proof", "input", "quote"]);
      const proofData: ProofData = {
        input: v.input.trim(),
        proof: v.proof.trim(),
        quote: v.quote.trim(),
      };

      const res = await verifySingleProof(proofData);

      const ok = !!res?.valid;
      const firstErr = Array.isArray(res?.errors) ? String(res.errors[0] ?? "") : "";
      console.log('firstErr', firstErr, ok)
      setVerifyOk(ok);
      setVerifyDetail(ok ? "" : firstErr);

      if (!ok && firstErr) {
        message.error(firstErr);
      }
    } catch (e) {
      const msg = (e as Error ).message ? (e as Error).message : String(e);
      setVerifyOk(false);
      setVerifyDetail(msg);
      if (msg && msg !== "[object Object]") {
        message.error(`Verify exceptions: ${msg}`);
      }
    } finally {
      setLoading(false);
    }
  }, [form, loading]);

  const verifyDaaScore = useCallback(async () => {
    if (vspcRangeLoading) return;

    setVerifyOk(null);
    setVerifyDaaScoreStatus(null);
    setVerifyDetail("");

    try {
      const v = await form.validateFields(["daaScore", "anchorHash"]);

      const daa = Number((v.daaScore || "").trim());
      const remoteAnchorHash = (v.anchorHash || "").trim();

      if (!Number.isFinite(daa) || daa <= 0) {
        throw new Error("DaaScore must be a positive number");
      }
      if (!isHexString(remoteAnchorHash)) {
        throw new Error("AnchorHash must be a valid hex string (0x...)");
      }

      const listForHash = await fetchVspcRangeList(daa);
      if (!listForHash.length) {
        throw new Error("VSPC range list is empty, cannot verify anchorHash.");
      }

      const localAnchorHash = calcAnchorHash(listForHash);
      const ok = localAnchorHash.toLowerCase() === remoteAnchorHash.toLowerCase();

      setVerifyDaaScoreStatus(ok);

      if (!ok) {
        throw new Error(`Anchor hash mismatch. local=${localAnchorHash} remote=${remoteAnchorHash}`);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      setVerifyDaaScoreStatus(false);
      setVerifyDetail(msg);
      if (msg && msg !== "[object Object]") {
        message.error(msg);
      }
    }
  }, [form, vspcRangeLoading, fetchVspcRangeList]);

  const currentType = Form.useWatch("type", form) || initialType;

  return (
    <div className="stats-page verify-content-page">
      <Row justify="center" className="mb20">
        <Col span={ 18 }>

          <Button
            type="text"
            icon={<ArrowLeftOutlined style={{ fontSize: '12px' }} />}
            className="verify-content-page__back"
            onClick={() => navigate("/stats")}
          >
            Go Back
          </Button>

          <Card className="verify-panel">
            <div className="verify-panel__hero">
              <Title level={1} className="verify-title">
                SGX/ZK <span>Verify</span>
              </Title>
              <Paragraph className="verify-desc">
                Execute cryptographic validation of block data using Intel SGX
                enclaves and Zero-Knowledge proofs.
              </Paragraph>
            </div>

            <Form<VerifyFormValues>
              form={form}
              layout="vertical"
              initialValues={initialValues}
              preserve={false}
              requiredMark={false}
              className="verify-form"
            >
              <Form.Item name="type" rules={typeRules} className="verify-panel__type-item">
                <Radio.Group
                  optionType="button"
                  buttonStyle="solid"
                  disabled={true}
                  className="verify-panel__radio-group mb20"
                >
                  <Radio.Button value="TEE">TEE</Radio.Button>
                  <Radio.Button value="ZK">ZK</Radio.Button>
                </Radio.Group>
              </Form.Item>

              <div className="verify-fields">
                <div className="verify-fields__row">
                  <div className="verify-fields__label">Block</div>
                  <Form.Item name="block" rules={blockRules} className="verify-fields__item">
                    <Input className="verify-fields__input" inputMode="numeric" placeholder="Enter block number" />
                  </Form.Item>
                </div>

                <div className="verify-fields__row">
                  <div className="verify-fields__label">DaaScore</div>
                  <Form.Item name="daaScore" rules={daaScoreRules} className="verify-fields__item">
                    <Input className="verify-fields__input" inputMode="numeric" placeholder="Enter daaScore number" />
                  </Form.Item>
                </div>

                <div className="verify-fields__row">
                  <div className="verify-fields__label">AnchorHash</div>
                  <Form.Item name="anchorHash" rules={anchorHashRules} className="verify-fields__item">
                    <Input className="verify-fields__input" placeholder="0x..." />
                  </Form.Item>
                </div>

                <div className="verify-fields__row">
                  <div className="verify-fields__label">Input</div>
                  <Form.Item name="input" rules={inputRules} className="verify-fields__item">
                    <Input.TextArea
                      className="verify-fields__textarea"
                      placeholder="0x..."
                      autoSize={{ minRows: 2, maxRows: 4 }}
                    />
                  </Form.Item>
                </div>

                <div className="verify-fields__row">
                  <div className="verify-fields__label">Proof</div>
                  <Form.Item name="proof" rules={proofRules} className="verify-fields__item">
                    <Input.TextArea
                      className="verify-fields__textarea"
                      placeholder="0x..."
                      autoSize={{ minRows: 2, maxRows: 4 }}
                    />
                  </Form.Item>
                </div>

                <div className="verify-fields__row">
                  <div className="verify-fields__label">Quote</div>
                  <Form.Item name="quote" rules={quoteRules} className="verify-fields__item">
                    <Input className="verify-fields__input" placeholder="Enter quote value" />
                  </Form.Item>
                </div>
              </div>

              {(verifyOk !== null || verifyDaaScoreStatus !== null) && (
                <div className="verify-status">
                  <div className="verify-status__left">
                    <div className="verify-status__icon">
                      <CheckCircleFilled />
                    </div>

                    <div className="verify-status__content">
                      <Text className="verify-status__caption">
                        {verifyOk !== null ? "Current Proof State" : "Current DaaScore State"}
                      </Text>

                      <Space size={12} wrap>
                        {verifyOk !== null && (
                          <>
                            <Text className="verify-status__score">
                              Proof: {shortenHex(form.getFieldValue("proof") || "", 5, 14)}
                            </Text>
                            <Tag className={`verify-status__tag ${verifyOk ? "is-success" : "is-failed"}`}>
                              {verifyOk ? "Verified" : "Failed"}
                            </Tag>
                          </>
                        )}

                        {verifyDaaScoreStatus !== null && (
                          <>
                            <Text className="verify-status__score">
                              DaaScore: {String(form.getFieldValue("daaScore") ?? "")}
                            </Text>
                            <Tag
                              className={`verify-status__tag ${verifyDaaScoreStatus ? "is-success" : "is-failed"}`}
                            >
                              {verifyDaaScoreStatus ? "Verified" : "Failed"}
                            </Tag>
                          </>
                        )}
                      </Space>

                      {!!verifyDetail && (
                        <div className="verify-status__error">{verifyDetail}</div>
                      )}
                    </div>
                  </div>

                  {!isMobile && (
                    <div className="verify-status__right">
                      <Text className="verify-status__caption">Validation Mode</Text>
                      <Text className="verify-status__validator">{currentType}</Text>
                    </div>
                  )}
                </div>
              )}


              <Row gutter={[16, 16]} className="verify-panel__actions mt30 ">
                <Col xs={24} sm={12}>
                  <Button
                    type="primary"
                    onClick={verifierFun}
                    loading={loading}
                    block
                    className="verify-panel__action-btn"
                  >
                    Verify
                  </Button>
                </Col>

                <Col xs={24} sm={12}>
                  <Button
                    onClick={verifyDaaScore}
                    loading={vspcRangeLoading}
                    block
                    className="verify-panel__action-btn verify-btn-secondary"
                  >
                    Verify DaaScore
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Verify;