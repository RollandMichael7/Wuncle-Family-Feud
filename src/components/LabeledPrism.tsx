import { PrismSide } from "@/lib/utils/feud-types";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

interface LabeledPrismProps {
  isVisible: boolean;
  currentSide: PrismSide;
  frontLabel: string;
  bottomLabel: string;
  rightLabel?: string;
  backLabel?: string;
  leftLabel?: string;
  topLabel?: string;
  width?: number;
  height?: number;
  depth?: number;
}

const LabeledPrism: React.FC<LabeledPrismProps> = ({
  isVisible,
  currentSide,
  frontLabel,
  bottomLabel,
  rightLabel = "",
  backLabel = "",
  leftLabel = "",
  topLabel = "",
  width = 550,
  height = 150,
  depth = 150,
}) => {
  const { t } = useTranslation();
  const [displaySide, setDisplaySide] = useState(currentSide);

  // w = 400
  // h = 200
  // d = 50
  const showClass = `show-${PrismSide[displaySide].toLowerCase()}`;

  const frontBackTranslate = depth / 2;
  const frontBackStyle = (isFront: boolean) => {
    return {
      width: width,
      height: height,
      lineHeight: `${height}px`,
      transform: `rotateY(${isFront ? "0deg" : "180deg"}) translateZ(${frontBackTranslate}px)`,
    };
  };

  const leftTranslate = depth / 2;
  const rightTranslate = width - depth / 2;
  const leftRightStyle = (isLeft: boolean) => {
    return {
      width: depth,
      height: height,
      lineHeight: `${height}px`,
      transform: `rotateY(${isLeft ? "-90deg" : "90deg"}) translateZ(${isLeft ? leftTranslate : rightTranslate}px)`,
    };
  };

  const topTranslate = depth / 2;
  const bottomTranslate = height - depth / 2;
  const topBottomStyles = (isTop: boolean) => {
    return {
      width: width,
      height: depth,
      lineHeight: `${depth}px`,
      transform: `rotateX(${isTop ? "90deg" : "-90deg"}) translateZ(${isTop ? topTranslate : bottomTranslate}px)`,
    };
  };

  const sceneStyles = {
    // width: width,
    // height: height,
    perspective: width,
  };

  const prismStyles = {
    width: width,
    height: height,
  };

  const LABEL_MARGIN = 30;
  const labelStyles = {
    height: `${height - LABEL_MARGIN * 2}px`,
    width: `${height - LABEL_MARGIN * 2}px`,
    marginTop: `${LABEL_MARGIN}px`,
    marginBottom: `${LABEL_MARGIN}px`,
    marginLeft: "auto",
    marginRight: "auto",
  };

  const move = () => {
    switch (displaySide) {
      case PrismSide.Front:
        setDisplaySide(PrismSide.Bottom);
        break;
      case PrismSide.Bottom:
        setDisplaySide(PrismSide.Front);
        break;
    }
  };

  return (
    <div onClick={move} style={sceneStyles} className={`prism-scene ${isVisible ? "opacity-100" : "opacity-0"}`}>
      <div style={prismStyles} className={`prism ${showClass}`}>
        <div
          className="prism__face prism__face--front bg-gradient-to-t from-primary-700 to-primary-500"
          style={frontBackStyle(true)}
        >
          <span style={labelStyles} className="prism-label bg-gradient-to-t from-primary-900 to-primary-700">
            {frontLabel}
          </span>
        </div>
        <div
          className="prism__face prism__face--back bg-gradient-to-t from-primary-700 to-primary-500"
          style={frontBackStyle(false)}
        >
          {backLabel}
        </div>
        <div
          className="prism__face prism__face--right bg-gradient-to-t from-primary-700 to-primary-500"
          style={leftRightStyle(false)}
        >
          {rightLabel}
        </div>
        <div
          className="prism__face prism__face--left bg-gradient-to-t from-primary-700 to-primary-500"
          style={leftRightStyle(true)}
        >
          {leftLabel}
        </div>
        <div
          className="prism__face prism__face--top bg-gradient-to-t from-primary-700 to-primary-500"
          style={topBottomStyles(true)}
        >
          {topLabel}
        </div>
        <div
          className="prism__face prism__face--bottom bg-gradient-to-t from-primary-500 to-primary-700"
          style={topBottomStyles(false)}
        >
          {bottomLabel}
        </div>
      </div>
    </div>
  );
};

export default LabeledPrism;
