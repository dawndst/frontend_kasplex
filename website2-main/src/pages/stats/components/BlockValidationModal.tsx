import React from "react";
import { Modal, Button, Skeleton, Typography, Tag } from "antd";
import { CloseOutlined, CheckCircleFilled, } from "@ant-design/icons";
import '@/styles/stats/blockVerifyModal.less';

const { Title, Text } = Typography;

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
  goUrl: (url: string) => void;
}

const BlockValidationModal: React.FC<BlockValidationModalProps> = ({  open, selectedBlock, validation, validationDescriptions, closeModal, goUrl, }) => {
  const buildVerifyUrl = (): string => {
    if (!selectedBlock) return "/verify";
    const params = new URLSearchParams({
      block: String(selectedBlock.number ?? ""),
      type: "TEE",
      input: String(selectedBlock.input ?? ""),
      proof: String(selectedBlock.proof ?? ""),
      quote: String(selectedBlock.quote ?? ""),
      daa_score: String(selectedBlock.daa_score ?? ""),
      anchor_hash: String(selectedBlock.anchor_hash ?? ""),
    });
    return `/verify?${params.toString()}`;
  };

  return (
    <Modal
      open={open}
      onCancel={closeModal}
      footer={null}
      closable={false}
      centered
      destroyOnHidden
      width={660}
      className="block-validation-modal"
    >
      <div className="block-validation-modal__shell">
        <div className="block-validation-modal__header">
          <Title level={4} className="block-validation-modal__title">
            {selectedBlock
              ? `Block #${selectedBlock.number} Validation`
              : "Block Validation"}
          </Title>
          <Button
            type="text"
            icon={<CloseOutlined />}
            className="block-validation-modal__close"
            onClick={closeModal}
          />
        </div>
        <div className="block-validation-modal__body">
          {selectedBlock && validation ? (
            <>
              <section className="block-validation-section">
                <div className="block-validation-section__head">
                  <span className="block-validation-section__bar" />
                  <Text className="block-validation-section__title">
                    Basic Information
                  </Text>
                </div>

                <div className="block-validation-basic">
                  <div className="block-validation-basic__item">
                    <Text className="block-validation-basic__label">
                      Block Number
                    </Text>
                    <div className="block-validation-basic__value">
                      {selectedBlock.number}
                    </div>
                  </div>

                  <div className="block-validation-basic__item">
                    <Text className="block-validation-basic__label">
                      DaaScore
                    </Text>
                    <div className="block-validation-basic__value">
                      {selectedBlock.daa_score || "--"}
                    </div>
                  </div>
                </div>
              </section>
              <section className="block-validation-section">
                <div className="block-validation-section__head">
                  <span className="block-validation-section__bar" />
                  <Text className="block-validation-section__title">
                    Hex Data Validations
                  </Text>
                </div>
                <div className="block-validation-list">
                  { validationDescriptions?.length && validationDescriptions.map((item, index) => (
                    <div
                      key={item.key}
                      className={`block-validation-list__row ${index > 0 ? "is-bordered" : ""
                        }`}
                    >
                      <div className="block-validation-list__left">
                        <span className="block-validation-list__icon">
                          {item.icon}
                        </span>
                        <span className="block-validation-list__name">
                          {item.label}
                        </span>
                      </div>

                      <div className="block-validation-list__right">
                        <Tag className="block-validation-list__len">
                          {item.detail}
                        </Tag>

                        <div className="block-validation-list__status is-ok">
                          <CheckCircleFilled />
                          <span>{item.status}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              {/* {!!validationDescriptions?.length && (
                <section className="block-validation-section">
                  <div className="block-validation-section__head">
                    <span className="block-validation-section__bar" />
                    <Text className="block-validation-section__title">
                      Validation Details
                    </Text>
                  </div>
                  <div className="block-validation-detail">
                    {validationDescriptions.map((item) => (
                      <div className="block-validation-detail__item" key={item.key}>
                        {item.label && (
                          <div className="block-validation-detail__label">
                            {item.label}
                          </div>
                        )}
                        <div className="block-validation-detail__content">
                          {item.children}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )} */}
            </>
          ) : (
            <div className="block-validation-modal__loading">
              <Skeleton active paragraph={{ rows: 8 }} />
            </div>
          )}
        </div>

        <div className="block-validation-modal__footer">
          <Button
            className="block-validation-modal__btn block-validation-modal__btn-ghost"
            onClick={closeModal}
          >
            Close
          </Button>
          <Button
            className="block-validation-modal__btn block-validation-modal__btn-primary"
            onClick={() => selectedBlock && goUrl(buildVerifyUrl())}
          >
            Verify
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default BlockValidationModal;